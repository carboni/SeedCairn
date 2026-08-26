export type PiecePrintOptions = {
  personLabel: string;
  pieceNumber: number;
  totalPieces: number;
  words: string[];
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Builds a minimal, print-friendly HTML page listing one SLIP-39 backup piece. */
export function buildPieceHtml({ personLabel, pieceNumber, totalPieces, words }: PiecePrintOptions): string {
  const rows = words
    .map(
      (word, i) =>
        `<div class="word"><span class="index">${i + 1}</span><span>${escapeHtml(word)}</span></div>`,
    )
    .join('');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: -apple-system, Helvetica, Arial, sans-serif;
        color: #161817;
        padding: 32px;
      }
      h1 {
        font-size: 22px;
        margin: 0 0 4px;
      }
      .subtitle {
        font-size: 13px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #6a6862;
        margin: 0 0 24px;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 24px;
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
    <p class="subtitle">Piece ${pieceNumber} of ${totalPieces}</p>
    <h1>${escapeHtml(personLabel)}&rsquo;s piece</h1>
    <div class="grid">${rows}</div>
  </body>
</html>`;
}
