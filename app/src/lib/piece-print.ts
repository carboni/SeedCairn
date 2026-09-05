import { buildQrSvg } from './qr';

export type PiecePrintOptions = {
  personLabel: string;
  pieceNumber: number;
  totalPieces: number;
  memberThreshold: number;
  words: string[];
};

/**
 * Kept with the pieces so a recovery years from now (possibly without this
 * app) knows what it's looking at and which tool settings to use — see the
 * cryptographic review in the repo README.
 */
const RECOVERY_NOTE = 'SLIP-39 · extendable · master secret is entropy, not the phrase';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Builds a minimal, print-friendly, one-page HTML sheet for one SLIP-39 backup piece. */
export function buildPieceHtml({
  personLabel,
  pieceNumber,
  totalPieces,
  memberThreshold,
  words,
}: PiecePrintOptions): string {
  const rows = words
    .map(
      (word, i) =>
        `<div class="word"><span class="index">${i + 1}</span><span>${escapeHtml(word)}</span></div>`,
    )
    .join('');
  const qrSvg = buildQrSvg(words.join(' '));

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: -apple-system, Helvetica, Arial, sans-serif;
        color: #161817;
        padding: 22px;
      }
      .header {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #d8d4cb;
      }
      .header svg {
        flex: none;
        width: 130px;
        height: 130px;
        display: block;
      }
      .header-text {
        flex: 1;
        min-width: 0;
      }
      h1 {
        font-size: 20px;
        margin: 0 0 4px;
      }
      .subtitle {
        font-size: 12.5px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #6a6862;
        margin: 0 0 10px;
      }
      .scan-caption {
        margin: 0;
        font-size: 13px;
        line-height: 1.5;
        color: #6a6862;
      }
      .note {
        margin: 0 0 18px;
        padding: 8px 11px;
        border: 1px dashed #d8d4cb;
        border-radius: 6px;
        font-size: 11.5px;
        letter-spacing: 0.02em;
        color: #6a6862;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px 16px;
      }
      .word {
        display: flex;
        align-items: baseline;
        gap: 8px;
        padding: 8px 10px;
        border: 1px solid #d8d4cb;
        border-radius: 6px;
        font-size: 15px;
      }
      .index {
        width: 20px;
        text-align: right;
        color: #8a867e;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      ${qrSvg}
      <div class="header-text">
        <p class="subtitle">Piece ${pieceNumber} of ${totalPieces} · ${memberThreshold} pieces are requred for recovery</p>
        <h1>${escapeHtml(personLabel)}&rsquo;s piece</h1>
        <p class="scan-caption">Scan the code in the app to enter this piece instantly during recovery — or type the words below if the code is ever damaged.</p>
      </div>
    </div>
    <p class="note">Recovery note: ${RECOVERY_NOTE}</p>
    <div class="grid">${rows}</div>
  </body>
</html>`;
}
