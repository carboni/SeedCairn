/**
 * SeedCairn's fixed brand palette, pulled from the Claude Design draft
 * (claude.ai/design project "Bitcoin Seed Backup App"). This is a single
 * deliberate look — dark stone header, warm stone content sheet — not an
 * OS light/dark adaptive theme.
 */
export const Palette = {
  stoneDark: '#1b1d1c',
  stoneSheet: '#eae7e1',
  card: '#fbfaf7',
  sunken: '#e0dcd4',
  chip: '#e2dfd7',
  stone: '#5b6b6a',

  action: '#2f5f72',
  actionPress: '#295465',
  ochre: '#d8a75a',

  textOnDark: '#f6f4ef',
  textOnDarkMuted: 'rgba(246,244,239,0.66)',
  textOnDarkFaint: 'rgba(246,244,239,0.44)',
  labelOnDark: 'rgba(242,240,235,0.6)',
  headerTextOnDark: '#f2f0eb',

  textPrimary: '#161817',
  textSecondary: '#6a6862',
  textTertiary: '#8a867e',
  textQuaternary: '#736f68',

  border: '#d8d4cb',
  borderStrong: '#cfcabf',
  underline: '#c9c5bc',
} as const;

/** Loaded via @expo-google-fonts/archivo — see useFonts() in src/app/_layout.tsx */
export const ArchivoFonts = {
  regular: 'Archivo_400Regular',
  medium: 'Archivo_500Medium',
  semiBold: 'Archivo_600SemiBold',
  bold: 'Archivo_700Bold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 480;
