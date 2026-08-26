import { validateMnemonic } from '@scure/bip39';
import { wordlist as BIP39_WORDLIST } from '@scure/bip39/wordlists/english.js';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type CheckStepProps = {
  words: string[];
  onNext: () => void;
  onBack: () => void;
};

export function CheckStep({ words, onNext, onBack }: CheckStepProps) {
  const [revealAll, setRevealAll] = useState(false);
  const [heldIndex, setHeldIndex] = useState<number | null>(null);

  const isValid = useMemo(
    () => words.length > 0 && validateMnemonic(words.join(' '), BIP39_WORDLIST),
    [words],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check it&rsquo;s right</Text>
      <Text style={styles.body}>Hold a word to reveal it. It hides again the moment you let go.</Text>

      <View style={styles.toolbarRow}>
        <Pressable
          onPress={() => setRevealAll((v) => !v)}
          style={[styles.toggle, revealAll && styles.toggleActive]}>
          <Text style={[styles.toggleText, revealAll && styles.toggleTextActive]}>
            {revealAll ? 'Hide all' : 'Reveal all'}
          </Text>
        </Pressable>
        <Text style={styles.hint}>Make sure nobody is looking</Text>
      </View>

      <ScrollView style={styles.wordScroll} contentContainerStyle={styles.wordGrid}>
        {words.map((word, i) => {
          const revealed = revealAll || heldIndex === i;
          return (
            <Pressable
              key={i}
              onPressIn={() => setHeldIndex(i)}
              onPressOut={() => setHeldIndex(null)}
              style={styles.wordChip}>
              <Text style={styles.wordIndex}>{i + 1}</Text>
              <Text style={[styles.wordText, !revealed && styles.wordTextMasked]}>
                {revealed ? word : '•'.repeat(Math.max(word.length, 4))}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.validityBox, !isValid && styles.validityBoxInvalid]}>
        <Text style={[styles.validityCheck, !isValid && styles.validityCheckInvalid]}>
          {isValid ? '✓' : '!'}
        </Text>
        <Text style={[styles.validityText, !isValid && styles.validityTextInvalid]}>
          {isValid
            ? `${words.length} words, checksum verified. This is a valid recovery phrase.`
            : `${words.length} words, but the checksum doesn't check out. Go back and look for a typo.`}
        </Text>
      </View>

      <Pressable onPress={onNext} disabled={!isValid} style={[styles.cta, !isValid && styles.ctaDisabled]}>
        <Text style={styles.ctaText}>Yes, that&rsquo;s my phrase</Text>
      </Pressable>
      <Pressable onPress={onBack} hitSlop={8} style={styles.backLink}>
        <Text style={styles.backLinkText}>Something&rsquo;s wrong — go back</Text>
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
    marginBottom: Spacing.three,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  toggle: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
  },
  toggleActive: {
    backgroundColor: Palette.stoneDark,
    borderColor: Palette.stoneDark,
  },
  toggleText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 13,
    color: Palette.textPrimary,
  },
  toggleTextActive: {
    color: Palette.textOnDark,
  },
  hint: {
    marginLeft: 'auto',
    fontFamily: ArchivoFonts.regular,
    fontSize: 12.5,
    color: Palette.textTertiary,
  },
  wordScroll: {
    flex: 1,
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    width: '48%',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  wordIndex: {
    width: 16,
    textAlign: 'right',
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 12,
    color: Palette.textTertiary,
  },
  wordText: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 15,
    color: Palette.textPrimary,
  },
  wordTextMasked: {
    letterSpacing: 1,
    color: Palette.textTertiary,
  },
  validityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'rgba(47,95,114,.09)',
  },
  validityBoxInvalid: {
    backgroundColor: 'rgba(178,58,46,.1)',
  },
  validityCheck: {
    color: Palette.action,
    fontSize: 16,
    fontFamily: ArchivoFonts.bold,
  },
  validityCheckInvalid: {
    color: '#b23a2e',
  },
  validityText: {
    flex: 1,
    fontFamily: ArchivoFonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#2c4b57',
  },
  validityTextInvalid: {
    color: '#7a2a20',
  },
  cta: {
    paddingVertical: 18,
    borderRadius: 14,
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
  backLink: {
    alignSelf: 'center',
    marginTop: Spacing.three,
  },
  backLinkText: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 14,
    color: Palette.textSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Palette.underline,
  },
});
