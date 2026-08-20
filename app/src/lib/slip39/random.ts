import * as Crypto from 'expo-crypto';

const ID_LENGTH_BITS = 15;

export function randomBytes(length: number): Uint8Array {
  return Crypto.getRandomBytes(length);
}

/** A random 15-bit share-set identifier, per SLIP-39. */
export function randomIdentifier(): number {
  const bytes = randomBytes(2);
  const value = (bytes[0] << 8) | bytes[1];
  return value & ((1 << ID_LENGTH_BITS) - 1);
}
