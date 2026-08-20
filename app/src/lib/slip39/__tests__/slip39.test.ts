import { combineMnemonics, generateMnemonics } from '../slip39';

import officialVectors from './official-vectors.json';

type Vector = [string, string[], string, string];

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

describe('SLIP-39 official test vectors', () => {
  const vectors = officialVectors as Vector[];
  // The reference implementation's own test suite (test_shamir.py::test_vectors)
  // combines these with passphrase "TREZOR" — it's a fixed convention for this
  // vector set, not a default.
  const VECTOR_PASSPHRASE = 'TREZOR';

  test.each(vectors)('%s', (_description, mnemonics, expectedSecretHex) => {
    if (expectedSecretHex) {
      const secret = combineMnemonics(mnemonics, VECTOR_PASSPHRASE);
      expect(bytesToHex(secret)).toBe(expectedSecretHex);
    } else {
      expect(() => combineMnemonics(mnemonics, VECTOR_PASSPHRASE)).toThrow();
    }
  });
});

describe('SLIP-39 round trip', () => {
  test('1-of-1 single group, 128-bit secret', () => {
    const secret = hexToBytes('bb54aac4b89dc868ba37d9cc21b2cece');
    const groups = generateMnemonics(1, [{ memberThreshold: 1, memberCount: 1 }], secret);
    const recovered = combineMnemonics(groups[0]);
    expect(bytesToHex(recovered)).toBe(bytesToHex(secret));
  });

  test('3-of-5 single group, 256-bit secret, exact threshold', () => {
    const secret = hexToBytes(
      '989baf9dcaad5b10ca33dfd8cc75e42477025dce88ae83e75a25f86f0e9d1e70',
    );
    const groups = generateMnemonics(1, [{ memberThreshold: 3, memberCount: 5 }], secret);
    const shares = groups[0];
    const recovered = combineMnemonics([shares[0], shares[2], shares[4]]);
    expect(bytesToHex(recovered)).toBe(bytesToHex(secret));
  });

  test('3-of-5 single group fails with only 2 shares', () => {
    const secret = hexToBytes('bb54aac4b89dc868ba37d9cc21b2cece');
    const groups = generateMnemonics(1, [{ memberThreshold: 3, memberCount: 5 }], secret);
    const shares = groups[0];
    expect(() => combineMnemonics([shares[0], shares[1]])).toThrow();
  });

  test('different 3-share subsets of a 3-of-5 group all recover the same secret', () => {
    const secret = hexToBytes('0123456789abcdeffedcba9876543210');
    const groups = generateMnemonics(1, [{ memberThreshold: 3, memberCount: 5 }], secret);
    const shares = groups[0];
    const a = combineMnemonics([shares[0], shares[1], shares[2]]);
    const b = combineMnemonics([shares[1], shares[3], shares[4]]);
    const c = combineMnemonics([shares[0], shares[2], shares[4]]);
    expect(bytesToHex(a)).toBe(bytesToHex(secret));
    expect(bytesToHex(b)).toBe(bytesToHex(secret));
    expect(bytesToHex(c)).toBe(bytesToHex(secret));
  });

  test('2-of-3 groups, each 2-of-3 members', () => {
    const secret = hexToBytes('bb54aac4b89dc868ba37d9cc21b2cece');
    const groups = generateMnemonics(
      2,
      [
        { memberThreshold: 2, memberCount: 3 },
        { memberThreshold: 2, memberCount: 3 },
        { memberThreshold: 2, memberCount: 3 },
      ],
      secret,
    );
    const recovered = combineMnemonics([
      groups[0][0],
      groups[0][1],
      groups[2][0],
      groups[2][2],
    ]);
    expect(bytesToHex(recovered)).toBe(bytesToHex(secret));
  });

  test('passphrase round trip', () => {
    const secret = hexToBytes('bb54aac4b89dc868ba37d9cc21b2cece');
    const groups = generateMnemonics(1, [{ memberThreshold: 2, memberCount: 3 }], secret, {
      passphrase: 'correct horse battery staple',
    });
    const recovered = combineMnemonics(
      [groups[0][0], groups[0][1]],
      'correct horse battery staple',
    );
    expect(bytesToHex(recovered)).toBe(bytesToHex(secret));
  });

  test('wrong passphrase does not recover the original secret', () => {
    const secret = hexToBytes('bb54aac4b89dc868ba37d9cc21b2cece');
    const groups = generateMnemonics(1, [{ memberThreshold: 2, memberCount: 3 }], secret, {
      passphrase: 'correct horse battery staple',
    });
    const recovered = combineMnemonics([groups[0][0], groups[0][1]], 'wrong passphrase');
    expect(bytesToHex(recovered)).not.toBe(bytesToHex(secret));
  });

  test('rejects member threshold 1 with more than 1 member', () => {
    const secret = hexToBytes('bb54aac4b89dc868ba37d9cc21b2cece');
    expect(() =>
      generateMnemonics(1, [{ memberThreshold: 1, memberCount: 2 }], secret),
    ).toThrow();
  });
});
