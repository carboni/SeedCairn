import createQrCode from 'qrcode-generator';

const ERROR_CORRECTION_LEVEL = 'M';

/**
 * Renders `data` as a QR code and returns it as a standalone `<svg>` markup
 * string — safe to inline directly into print HTML. Pure JS, no canvas or
 * native dependency, so it also runs fine on-device if ever needed there.
 */
export function buildQrSvg(data: string, cellSize = 4, margin = 8): string {
  const qr = createQrCode(0, ERROR_CORRECTION_LEVEL);
  qr.addData(data);
  qr.make();
  return qr.createSvgTag(cellSize, margin);
}
