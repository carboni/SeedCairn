/**
 * Well-known public BIP-39 test vectors (all "abandon…") — safe as a
 * placeholder "Use an example phrase" fill, since they're not anyone's
 * real secret. No wordlist or checksum validation happens yet; that
 * lands with the real crypto integration.
 */
export const EXAMPLE_PHRASES: Record<12 | 24, string[]> = {
  12: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'.split(
    ' ',
  ),
  24: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art'.split(
    ' ',
  ),
};

/**
 * A small subset of the real BIP-39 English wordlist, just enough for the
 * autocomplete suggestions to feel real. Not the full 2048-word list —
 * that arrives with the real crypto library.
 */
export const SAMPLE_WORDLIST = [
  'abandon',
  'ability',
  'able',
  'about',
  'above',
  'absent',
  'absorb',
  'abstract',
  'absurd',
  'abuse',
  'access',
  'accident',
  'account',
  'accuse',
  'achieve',
  'acid',
  'acoustic',
  'acquire',
  'across',
  'act',
  'action',
  'actor',
  'actual',
  'adapt',
  'add',
  'addict',
  'address',
  'adjust',
  'admit',
  'adult',
  'advance',
  'advice',
  'aerobic',
  'affair',
  'afford',
  'afraid',
  'again',
  'age',
  'agent',
  'agree',
  'ahead',
  'aim',
  'air',
  'airport',
  'aisle',
  'alarm',
  'album',
  'alcohol',
  'alert',
  'alien',
];
