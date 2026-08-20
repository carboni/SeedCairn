import { rs1024CreateChecksum, rs1024VerifyChecksum } from './rs1024';
import { SLIP39_WORD_INDEX, SLIP39_WORDLIST } from './wordlist';

const RADIX_BITS = 10;
const ID_LENGTH_BITS = 15;
const EXTENDABLE_FLAG_LENGTH_BITS = 1;
const ITERATION_EXP_LENGTH_BITS = 4;
const ID_EXP_LENGTH_WORDS = Math.ceil(
  (ID_LENGTH_BITS + EXTENDABLE_FLAG_LENGTH_BITS + ITERATION_EXP_LENGTH_BITS) / RADIX_BITS,
); // 2
const CHECKSUM_LENGTH_WORDS = 3;
const METADATA_LENGTH_WORDS = ID_EXP_LENGTH_WORDS + 2 + CHECKSUM_LENGTH_WORDS; // 7
const MIN_STRENGTH_BITS = 128;
const MIN_MNEMONIC_LENGTH_WORDS =
  METADATA_LENGTH_WORDS + Math.ceil(MIN_STRENGTH_BITS / RADIX_BITS); // 20

const CUSTOMIZATION_ORIGINAL = 'shamir';
const CUSTOMIZATION_EXTENDABLE = 'shamir_extendable';

function customizationString(extendable: boolean): string {
  return extendable ? CUSTOMIZATION_EXTENDABLE : CUSTOMIZATION_ORIGINAL;
}

function bitsToWords(n: number): number {
  return Math.ceil(n / RADIX_BITS);
}

function bitsToBytes(n: number): number {
  return Math.ceil(n / 8);
}

/** Big-endian bigint -> array of `length` base-1024 word indices. */
function intToWordIndices(value: bigint, length: number): number[] {
  const mask = 1023n;
  const out: number[] = new Array(length);
  for (let i = 0; i < length; i++) {
    const shift = BigInt((length - 1 - i) * RADIX_BITS);
    out[i] = Number((value >> shift) & mask);
  }
  return out;
}

function wordIndicesToInt(indices: number[]): bigint {
  let value = 0n;
  for (const index of indices) {
    value = value * 1024n + BigInt(index);
  }
  return value;
}

function bytesToBigInt(bytes: Uint8Array): bigint {
  let value = 0n;
  for (const b of bytes) value = (value << 8n) | BigInt(b);
  return value;
}

function bigIntToBytes(value: bigint, length: number): Uint8Array {
  const out = new Uint8Array(length);
  let v = value;
  for (let i = length - 1; i >= 0; i--) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  if (v !== 0n) {
    throw new Error('Value does not fit in the given byte length (invalid padding).');
  }
  return out;
}

export type Share = {
  identifier: number;
  extendable: boolean;
  iterationExponent: number;
  groupIndex: number;
  groupThreshold: number;
  groupCount: number;
  memberIndex: number;
  memberThreshold: number;
  value: Uint8Array;
};

function encodeIdExp(share: Pick<Share, 'identifier' | 'extendable' | 'iterationExponent'>): number[] {
  let idExp = BigInt(share.identifier) << BigInt(ITERATION_EXP_LENGTH_BITS + EXTENDABLE_FLAG_LENGTH_BITS);
  idExp += BigInt(share.extendable ? 1 : 0) << BigInt(ITERATION_EXP_LENGTH_BITS);
  idExp += BigInt(share.iterationExponent);
  return intToWordIndices(idExp, ID_EXP_LENGTH_WORDS);
}

function encodeShareParams(
  share: Pick<Share, 'groupIndex' | 'groupThreshold' | 'groupCount' | 'memberIndex' | 'memberThreshold'>,
): number[] {
  let val = BigInt(share.groupIndex);
  val = (val << 4n) + BigInt(share.groupThreshold - 1);
  val = (val << 4n) + BigInt(share.groupCount - 1);
  val = (val << 4n) + BigInt(share.memberIndex);
  val = (val << 4n) + BigInt(share.memberThreshold - 1);
  return intToWordIndices(val, 2);
}

export function shareToWords(share: Share): string[] {
  const valueWordCount = bitsToWords(share.value.length * 8);
  const valueInt = bytesToBigInt(share.value);
  const valueData = intToWordIndices(valueInt, valueWordCount);

  const shareData = [...encodeIdExp(share), ...encodeShareParams(share), ...valueData];
  const checksum = rs1024CreateChecksum(customizationString(share.extendable), shareData);

  return [...shareData, ...checksum].map((i) => SLIP39_WORDLIST[i]);
}

export function shareToMnemonic(share: Share): string {
  return shareToWords(share).join(' ');
}

export function mnemonicToShare(mnemonic: string): Share {
  const words = mnemonic.trim().toLowerCase().split(/\s+/);
  const mnemonicData = words.map((word) => {
    const index = SLIP39_WORD_INDEX.get(word);
    if (index === undefined) throw new Error(`Invalid mnemonic word "${word}".`);
    return index;
  });

  if (mnemonicData.length < MIN_MNEMONIC_LENGTH_WORDS) {
    throw new Error(
      `Invalid mnemonic length. Each share must be at least ${MIN_MNEMONIC_LENGTH_WORDS} words.`,
    );
  }

  const paddingLen = (RADIX_BITS * (mnemonicData.length - METADATA_LENGTH_WORDS)) % 16;
  if (paddingLen > 8) {
    throw new Error('Invalid mnemonic length.');
  }

  const idExpData = mnemonicData.slice(0, ID_EXP_LENGTH_WORDS);
  const idExpInt = wordIndicesToInt(idExpData);

  const identifier = Number(idExpInt >> BigInt(EXTENDABLE_FLAG_LENGTH_BITS + ITERATION_EXP_LENGTH_BITS));
  const extendable = ((idExpInt >> BigInt(ITERATION_EXP_LENGTH_BITS)) & 1n) === 1n;
  const iterationExponent = Number(idExpInt & ((1n << BigInt(ITERATION_EXP_LENGTH_BITS)) - 1n));

  if (!rs1024VerifyChecksum(customizationString(extendable), mnemonicData)) {
    throw new Error(`Invalid mnemonic checksum for "${words.slice(0, ID_EXP_LENGTH_WORDS + 2).join(' ')} ...".`);
  }

  const shareParamsData = mnemonicData.slice(ID_EXP_LENGTH_WORDS, ID_EXP_LENGTH_WORDS + 2);
  let shareParamsInt = wordIndicesToInt(shareParamsData);
  const mask4 = 0xfn;
  const memberThresholdMinusOne = Number(shareParamsInt & mask4);
  shareParamsInt >>= 4n;
  const memberIndex = Number(shareParamsInt & mask4);
  shareParamsInt >>= 4n;
  const groupCountMinusOne = Number(shareParamsInt & mask4);
  shareParamsInt >>= 4n;
  const groupThresholdMinusOne = Number(shareParamsInt & mask4);
  shareParamsInt >>= 4n;
  const groupIndex = Number(shareParamsInt & mask4);

  const groupCount = groupCountMinusOne + 1;
  const groupThreshold = groupThresholdMinusOne + 1;
  const memberThreshold = memberThresholdMinusOne + 1;

  if (groupCount < groupThreshold) {
    throw new Error(
      `Invalid mnemonic "${words.slice(0, ID_EXP_LENGTH_WORDS + 2).join(' ')} ...". Group threshold cannot be greater than group count.`,
    );
  }

  const valueData = mnemonicData.slice(ID_EXP_LENGTH_WORDS + 2, mnemonicData.length - CHECKSUM_LENGTH_WORDS);
  const valueByteCount = bitsToBytes(RADIX_BITS * valueData.length - paddingLen);
  const valueInt = wordIndicesToInt(valueData);
  let value: Uint8Array;
  try {
    value = bigIntToBytes(valueInt, valueByteCount);
  } catch {
    throw new Error(`Invalid mnemonic padding for "${words.slice(0, ID_EXP_LENGTH_WORDS + 2).join(' ')} ...".`);
  }

  return {
    identifier,
    extendable,
    iterationExponent,
    groupIndex,
    groupThreshold,
    groupCount,
    memberIndex,
    memberThreshold,
    value,
  };
}
