/**
 * GF(256) field arithmetic for SLIP-39's Shamir splitting, using the
 * Rijndael irreducible polynomial x^8 + x^4 + x^3 + x + 1 (0x11B).
 */

function multiplyNoTables(a: number, b: number): number {
  let product = 0;
  let x = a;
  let y = b;
  for (let i = 0; i < 8; i++) {
    if (y & 1) product ^= x;
    const highBit = x & 0x80;
    x = (x << 1) & 0xff;
    if (highBit) x ^= 0x1b;
    y >>= 1;
  }
  return product;
}

const EXP = new Uint8Array(510);
const LOG = new Uint8Array(256);
{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x = multiplyNoTables(x, 3);
  }
  for (let i = 255; i < 510; i++) EXP[i] = EXP[i - 255];
}

export function gf256Add(a: number, b: number): number {
  return a ^ b;
}

export function gf256Mul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

export function gf256Div(a: number, b: number): number {
  if (b === 0) throw new Error('GF(256) division by zero');
  if (a === 0) return 0;
  return EXP[(LOG[a] - LOG[b] + 255) % 255];
}

/**
 * Lagrange interpolation: given points (x_i, y_i) with y_i as equal-length
 * byte strings, evaluate the interpolated polynomial at `x`.
 */
export function interpolate(shares: Map<number, Uint8Array>, x: number): Uint8Array {
  const xs = Array.from(shares.keys());
  const length = shares.values().next().value!.length;
  const result = new Uint8Array(length);

  for (const xi of xs) {
    let numerator = 1;
    let denominator = 1;
    for (const xj of xs) {
      if (xj === xi) continue;
      numerator = gf256Mul(numerator, gf256Add(x, xj));
      denominator = gf256Mul(denominator, gf256Add(xi, xj));
    }
    const coefficient = gf256Div(numerator, denominator);
    const yi = shares.get(xi)!;
    for (let k = 0; k < length; k++) {
      result[k] ^= gf256Mul(coefficient, yi[k]);
    }
  }

  return result;
}
