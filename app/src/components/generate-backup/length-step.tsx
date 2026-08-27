import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type LengthStepProps = {
  wordLength: 12 | 24;
  onChangeWordLength: (length: 12 | 24) => void;
  onNext: () => void;
};

export function LengthStep({ wordLength, onChangeWordLength, onNext }: LengthStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How many words does your wallet want?</Text>
      <Text style={styles.body}>
        Open your wallet&rsquo;s set-up screen and look for &ldquo;import&rdquo; or
        &ldquo;recovery phrase&rdquo; — it will say how many words it takes. If it offers both,
        pick 24.
      </Text>

      <View style={styles.rows}>
        <Pressable
          onPress={() => onChangeWordLength(24)}
          style={[styles.row, wordLength === 24 && styles.rowActive]}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>24 words</Text>
            <Text style={styles.rowSubtitle}>The usual choice, and the strongest</Text>
          </View>
          {wordLength === 24 && <Text style={styles.check}>✓</Text>}
        </Pressable>
        <Pressable
          onPress={() => onChangeWordLength(12)}
          style={[styles.row, wordLength === 12 && styles.rowActive]}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>12 words</Text>
            <Text style={styles.rowSubtitle}>Shorter to type in, still far beyond guessing</Text>
          </View>
          {wordLength === 12 && <Text style={styles.check}>✓</Text>}
        </Pressable>
      </View>

      <View style={styles.spacer} />

      <Text style={styles.footnote}>
        Nothing is made until you tap. Once it is, it lives only on this screen — so have your
        wallet nearby and somewhere private.
      </Text>
      <Pressable onPress={onNext} style={styles.cta}>
        <Text style={styles.ctaText}>Make my seed phrase</Text>
      </Pressable>
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
    marginBottom: Spacing.four,
  },
  rows: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Palette.card,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  rowActive: {
    borderColor: Palette.action,
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 18,
    letterSpacing: -0.2,
    color: Palette.textPrimary,
  },
  rowSubtitle: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Palette.textSecondary,
  },
  check: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 18,
    color: Palette.action,
  },
  spacer: {
    flex: 1,
  },
  footnote: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    lineHeight: 21,
    color: Palette.textTertiary,
    marginBottom: Spacing.three,
  },
  cta: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: Palette.action,
  },
  ctaText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 16,
    color: '#ffffff',
  },
});
