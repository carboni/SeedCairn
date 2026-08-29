import { getRandomValues } from 'expo-crypto';

/**
 * @scure/bip39 (and its @noble/hashes dependency) call the Web Crypto
 * `crypto.getRandomValues`, which Hermes doesn't provide. expo-crypto
 * ships a native implementation of it; this just wires it up as the
 * global before anything else runs.
 */
if (typeof global.crypto !== 'object') {
  // @ts-expect-error - crypto isn't declared as writable on global
  global.crypto = {};
}
if (typeof global.crypto.getRandomValues !== 'function') {
  // @ts-expect-error - getRandomValues isn't declared as writable on Crypto
  global.crypto.getRandomValues = getRandomValues;
}
