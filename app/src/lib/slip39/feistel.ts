import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

/** Minimum total PBKDF2 iterations across all rounds, per SLIP-39. */
const BASE_ITERATION_COUNT = 10000;
const ROUNDS = 4;

function textEncode(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const length = arrays.reduce((sum, a) => sum + a.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

function idToBytes(identifier: number): Uint8Array {
  return new Uint8Array([(identifier >> 8) & 0xff, identifier & 0xff]);
}

function saltPrefix(extendable: boolean, identifier: number): Uint8Array {
  if (extendable) return new Uint8Array(0);
  return concatBytes(textEncode('shamir'), idToBytes(identifier));
}

function round(
  i: number,
  passphrase: Uint8Array,
  salt: Uint8Array,
  iterationExponent: number,
  half: Uint8Array,
): Uint8Array {
  const password = concatBytes(new Uint8Array([i]), passphrase);
  const roundSalt = concatBytes(salt, half);
  const iterations = Math.floor((BASE_ITERATION_COUNT << iterationExponent) / ROUNDS);
  return pbkdf2(sha256, password, roundSalt, { c: iterations, dkLen: half.length });
}

function feistel(
  order: number[],
  masterSecret: Uint8Array,
  passphrase: Uint8Array,
  identifier: number,
  extendable: boolean,
  iterationExponent: number,
): Uint8Array {
  const half = masterSecret.length / 2;
  let l = masterSecret.slice(0, half);
  let r = masterSecret.slice(half);
  const salt = saltPrefix(extendable, identifier);

  for (const i of order) {
    const f = round(i, passphrase, salt, iterationExponent, r);
    const newR = new Uint8Array(half);
    for (let k = 0; k < half; k++) newR[k] = l[k] ^ f[k];
    l = r;
    r = newR;
  }

  return concatBytes(r, l);
}

/** Encrypt a master secret into an "encrypted master secret" using the passphrase. */
export function encryptMasterSecret(
  masterSecret: Uint8Array,
  passphrase: string,
  identifier: number,
  extendable: boolean,
  iterationExponent: number,
): Uint8Array {
  return feistel(
    [0, 1, 2, 3],
    masterSecret,
    textEncode(passphrase),
    identifier,
    extendable,
    iterationExponent,
  );
}

/** Reverse of encryptMasterSecret — recovers the master secret given the passphrase. */
export function decryptMasterSecret(
  encryptedMasterSecret: Uint8Array,
  passphrase: string,
  identifier: number,
  extendable: boolean,
  iterationExponent: number,
): Uint8Array {
  return feistel(
    [3, 2, 1, 0],
    encryptedMasterSecret,
    textEncode(passphrase),
    identifier,
    extendable,
    iterationExponent,
  );
}
