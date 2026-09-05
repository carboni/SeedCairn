import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';

import { interpolate } from './gf256';

export const DIGEST_INDEX = 254;
export const SECRET_INDEX = 255;
const DIGEST_LENGTH_BYTES = 4;

function createDigest(randomPart: Uint8Array, sharedSecret: Uint8Array): Uint8Array {
  return hmac(sha256, randomPart, sharedSecret).slice(0, DIGEST_LENGTH_BYTES);
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export type ByteShare = { index: number; value: Uint8Array };

export function splitSecret(
  threshold: number,
  shareCount: number,
  secret: Uint8Array,
  randomBytes: (length: number) => Uint8Array,
): ByteShare[] {
  if (threshold < 1) throw new Error('threshold must be at least 1');
  if (threshold > shareCount) throw new Error('threshold cannot exceed share count');
  if (shareCount > 16) throw new Error('share count cannot exceed 16');

  if (threshold === 1) {
    return Array.from({ length: shareCount }, (_, i) => ({ index: i, value: secret }));
  }

  const randomShareCount = threshold - 2;
  const shares: ByteShare[] = [];
  for (let i = 0; i < randomShareCount; i++) {
    shares.push({ index: i, value: randomBytes(secret.length) });
  }

  const randomPart = randomBytes(secret.length - DIGEST_LENGTH_BYTES);
  const digest = createDigest(randomPart, secret);
  const digestValue = new Uint8Array(secret.length);
  digestValue.set(digest, 0);
  digestValue.set(randomPart, DIGEST_LENGTH_BYTES);

  const baseShares = new Map<number, Uint8Array>();
  for (const s of shares) baseShares.set(s.index, s.value);
  baseShares.set(DIGEST_INDEX, digestValue);
  baseShares.set(SECRET_INDEX, secret);

  for (let i = randomShareCount; i < shareCount; i++) {
    shares.push({ index: i, value: interpolate(baseShares, i) });
  }

  return shares;
}

export function recoverSecret(shares: ByteShare[], threshold: number): Uint8Array {
  if (threshold === 1) {
    return shares[0].value;
  }

  const shareLength = shares[0].value.length;
  if (shares.some((s) => s.value.length !== shareLength)) {
    throw new Error('Shares have mismatched lengths — they do not belong to the same backup.');
  }

  const points = new Map<number, Uint8Array>();
  for (const s of shares) points.set(s.index, s.value);

  const sharedSecret = interpolate(points, SECRET_INDEX);
  const digestShare = interpolate(points, DIGEST_INDEX);
  const digest = digestShare.slice(0, DIGEST_LENGTH_BYTES);
  const randomPart = digestShare.slice(DIGEST_LENGTH_BYTES);

  if (!bytesEqual(digest, createDigest(randomPart, sharedSecret))) {
    throw new Error('Invalid digest of the shared secret — shares do not match.');
  }

  return sharedSecret;
}
