/**
 * RS1024 checksum, per SLIP-39 (SatoshiLabs SLIP-0039). Customization
 * string is "shamir" for standard shares, "shamir_extendable" for the
 * extendable variant (ext=1).
 */

const GEN = [
  0xe0e040, 0x1c1c080, 0x3838100, 0x7070200, 0xe0e0009, 0x1c0c2412, 0x38086c24, 0x3090fc48,
  0x21b1f890, 0x3f3f120,
];

function polymod(values: number[]): number {
  let chk = 1;
  for (const v of values) {
    const b = chk >> 20;
    chk = ((chk & 0xfffff) << 10) ^ v;
    for (let i = 0; i < 10; i++) {
      if ((b >> i) & 1) chk ^= GEN[i];
    }
  }
  return chk;
}

function customizationValues(customizationString: string): number[] {
  return Array.from(customizationString).map((ch) => ch.charCodeAt(0));
}

export function rs1024CreateChecksum(customizationString: string, data: number[]): number[] {
  const values = customizationValues(customizationString).concat(data, [0, 0, 0]);
  const mod = polymod(values) ^ 1;
  const checksum: number[] = [];
  for (let i = 0; i < 3; i++) {
    checksum.push((mod >> (10 * (2 - i))) & 1023);
  }
  return checksum;
}

export function rs1024VerifyChecksum(customizationString: string, data: number[]): boolean {
  const values = customizationValues(customizationString).concat(data);
  return polymod(values) === 1;
}
