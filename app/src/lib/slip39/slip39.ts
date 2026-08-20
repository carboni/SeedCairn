import { decryptMasterSecret, encryptMasterSecret } from './feistel';
import { mnemonicToShare, shareToMnemonic, type Share } from './mnemonic';
import { randomBytes, randomIdentifier } from './random';
import { recoverSecret, splitSecret, type ByteShare } from './shamir';

const MIN_STRENGTH_BITS = 128;

export type GroupSpec = {
  memberThreshold: number;
  memberCount: number;
};

export type GenerateOptions = {
  passphrase?: string;
  /** Defaults to true, matching the reference SLIP-39 implementation. */
  extendable?: boolean;
  /** Defaults to 1 (20000 total PBKDF2 iterations), matching the reference implementation. */
  iterationExponent?: number;
};

function assertPrintableAscii(passphrase: string) {
  for (const ch of passphrase) {
    const code = ch.charCodeAt(0);
    if (code < 32 || code > 126) {
      throw new Error('Passphrase must contain only printable ASCII characters.');
    }
  }
}

/**
 * Split a master secret into SLIP-39 mnemonic shares, organized as
 * `groupThreshold`-of-`groups.length` groups, each internally split
 * `memberThreshold`-of-`memberCount`. Returns one array of mnemonic
 * strings per group.
 */
export function generateMnemonics(
  groupThreshold: number,
  groups: GroupSpec[],
  masterSecret: Uint8Array,
  options: GenerateOptions = {},
): string[][] {
  const passphrase = options.passphrase ?? '';
  const extendable = options.extendable ?? true;
  const iterationExponent = options.iterationExponent ?? 1;

  if (masterSecret.length * 8 < MIN_STRENGTH_BITS) {
    throw new Error(`Master secret must be at least ${MIN_STRENGTH_BITS / 8} bytes.`);
  }
  if (masterSecret.length % 2 !== 0) {
    throw new Error('Master secret length in bytes must be even.');
  }
  if (groupThreshold > groups.length) {
    throw new Error('Group threshold cannot exceed the number of groups.');
  }
  if (groups.some((g) => g.memberThreshold === 1 && g.memberCount > 1)) {
    throw new Error(
      'Creating multiple member shares with member threshold 1 is not allowed — use 1-of-1 for that group.',
    );
  }
  assertPrintableAscii(passphrase);

  const identifier = randomIdentifier();
  const ciphertext = encryptMasterSecret(
    masterSecret,
    passphrase,
    identifier,
    extendable,
    iterationExponent,
  );

  const groupShares = splitSecret(groupThreshold, groups.length, ciphertext, randomBytes);

  return groupShares.map(({ index: groupIndex, value: groupSecret }) => {
    const { memberThreshold, memberCount } = groups[groupIndex];
    const memberShares = splitSecret(memberThreshold, memberCount, groupSecret, randomBytes);
    return memberShares.map(({ index: memberIndex, value }) =>
      shareToMnemonic({
        identifier,
        extendable,
        iterationExponent,
        groupIndex,
        groupThreshold,
        groupCount: groups.length,
        memberIndex,
        memberThreshold,
        value,
      }),
    );
  });
}

/** Decode mnemonics into shares grouped by group index, validating consistency. */
export function decodeMnemonics(mnemonics: string[]): Map<number, Share[]> {
  if (mnemonics.length === 0) throw new Error('No mnemonics provided.');

  const groups = new Map<number, Share[]>();
  let commonParams: Pick<
    Share,
    'identifier' | 'extendable' | 'iterationExponent' | 'groupThreshold' | 'groupCount'
  > | null = null;

  for (const mnemonic of mnemonics) {
    const share = mnemonicToShare(mnemonic);

    if (commonParams === null) {
      commonParams = share;
    } else if (
      commonParams.identifier !== share.identifier ||
      commonParams.extendable !== share.extendable ||
      commonParams.iterationExponent !== share.iterationExponent ||
      commonParams.groupThreshold !== share.groupThreshold ||
      commonParams.groupCount !== share.groupCount
    ) {
      throw new Error(
        'Invalid set of mnemonics — they must all belong to the same backup (same identifier, group threshold and group count).',
      );
    }

    const groupShares = groups.get(share.groupIndex) ?? [];
    if (groupShares.length > 0) {
      if (groupShares[0].memberThreshold !== share.memberThreshold) {
        throw new Error('Invalid set of mnemonics — member threshold mismatch within a group.');
      }
      if (groupShares.some((s) => s.memberIndex === share.memberIndex)) {
        throw new Error('Invalid set of mnemonics — duplicate member index within a group.');
      }
    }
    groupShares.push(share);
    groups.set(share.groupIndex, groupShares);
  }

  return groups;
}

/** Recombine SLIP-39 mnemonics (from any number of groups) back into the master secret. */
export function combineMnemonics(mnemonics: string[], passphrase = ''): Uint8Array {
  const groups = decodeMnemonics(mnemonics);

  const firstShare = groups.values().next().value?.[0];
  if (!firstShare) throw new Error('No mnemonics provided.');
  const { groupThreshold, identifier, extendable, iterationExponent } = firstShare;

  if (groups.size !== groupThreshold) {
    throw new Error(
      `Wrong number of mnemonic groups — expected ${groupThreshold}, got ${groups.size}.`,
    );
  }

  const groupSecrets: ByteShare[] = [];
  for (const [groupIndex, shares] of groups) {
    const memberThreshold = shares[0].memberThreshold;
    if (shares.length !== memberThreshold) {
      throw new Error(
        `Wrong number of mnemonics in group ${groupIndex} — expected ${memberThreshold}, got ${shares.length}.`,
      );
    }
    const byteShares: ByteShare[] = shares.map((s) => ({ index: s.memberIndex, value: s.value }));
    groupSecrets.push({ index: groupIndex, value: recoverSecret(byteShares, memberThreshold) });
  }

  const ciphertext = recoverSecret(groupSecrets, groupThreshold);
  return decryptMasterSecret(ciphertext, passphrase, identifier, extendable, iterationExponent);
}
