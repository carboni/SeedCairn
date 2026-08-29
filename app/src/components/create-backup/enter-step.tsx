import { wordlist as BIP39_WORDLIST } from '@scure/bip39/wordlists/english.js';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WordGrid } from '@/components/seed-entry/word-grid';
import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

/**
 * Well-known public BIP-39 test vectors - safe as a
 * placeholder "Use an example phrase" fill, since they're not anyone's
 * real secret.
 *
 * see: https://github.com/trezor/python-mnemonic/blob/master/vectors.json
 */
export const EXAMPLE_PHRASES: Record<12 | 24, string[]> = {
  12: 'vessel ladder alter error federal sibling chat ability sun glass valve picture'.split(
    ' ',
  ),
  24: 'void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold'.split(
    ' ',
  ),
};

type EnterStepProps = {
  wordLength: 12 | 24;
  onChangeWordLength: (length: 12 | 24) => void;
  words: string[];
  onChangeWords: (words: string[]) => void;
  onNext: () => void;
};

export function EnterStep({
  wordLength,
  onChangeWordLength,
  words,
  onChangeWords,
  onNext,
}: EnterStepProps) {
  const isComplete = words.every((w) => BIP39_WORDLIST.includes(w));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your seed phrase</Text>
      <Text style={styles.body}>
        One word at a time, in order. Nobody but you will ever see these — not us, not the
        internet.
      </Text>

      <View style={styles.lengthRow}>
        <Pressable
          onPress={() => onChangeWordLength(24)}
          style={[styles.lengthPill, wordLength === 24 && styles.lengthPillActive]}>
          <Text style={[styles.lengthPillText, wordLength === 24 && styles.lengthPillTextActive]}>
            24 words
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onChangeWordLength(12)}
          style={[styles.lengthPill, wordLength === 12 && styles.lengthPillActive]}>
          <Text style={[styles.lengthPillText, wordLength === 12 && styles.lengthPillTextActive]}>
            12 words
          </Text>
        </Pressable>
        <Text style={styles.lengthHint}>Most wallets use 24</Text>
      </View>

      <WordGrid
        words={words}
        onChangeWords={onChangeWords}
        wordlist={BIP39_WORDLIST}
        columns={2}
        footer={
          <>
            <View style={styles.footerRow}>
              <Pressable onPress={() => onChangeWords(EXAMPLE_PHRASES[wordLength])} hitSlop={8}>
                <Text style={styles.exampleLink}>Use an example phrase</Text>
              </Pressable>
              <Text style={styles.wordCount}>
                {words.filter((w) => w !== '').length} of {wordLength}
              </Text>
            </View>
            <Pressable
              onPress={onNext}
              disabled={!isComplete}
              style={[styles.cta, !isComplete && styles.ctaDisabled]}>
              <Text style={styles.ctaText}>Check my phrase</Text>
            </Pressable>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  title: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.8,
    color: Palette.textPrimary,
    marginBottom: Spacing.two,
  },
  body: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: Palette.textSecondary,
    marginBottom: Spacing.three,
  },
  lengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  lengthPill: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
  },
  lengthPillActive: {
    backgroundColor: Palette.stoneDark,
    borderColor: Palette.stoneDark,
  },
  lengthPillText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 13,
    color: Palette.textPrimary,
  },
  lengthPillTextActive: {
    color: Palette.textOnDark,
  },
  lengthHint: {
    marginLeft: 'auto',
    fontFamily: ArchivoFonts.regular,
    fontSize: 12.5,
    color: Palette.textTertiary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.three,
  },
  exampleLink: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 13,
    color: Palette.action,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,95,114,.4)',
  },
  wordCount: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 13,
    color: Palette.textSecondary,
  },
  cta: {
    marginTop: Spacing.three,
    paddingVertical: 17,
    borderRadius: 13,
    alignItems: 'center',
    backgroundColor: Palette.action,
  },
  ctaDisabled: {
    backgroundColor: Palette.stone,
  },
  ctaText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 16,
    color: '#ffffff',
  },
});
