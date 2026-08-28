import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type PhraseStepProps = {
  words: string[];
  onNext: () => void;
};

export function PhraseStep({ words, onNext }: PhraseStepProps) {
  const [revealAll, setRevealAll] = useState(false);
  const [heldIndex, setHeldIndex] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Here it is — all {words.length} words</Text>
      <Text style={styles.body}>Hold a word to reveal it; it hides again when you let go.</Text>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Don&rsquo;t screenshot this. Type it straight into your wallet, then close this screen
          — the phrase is gone from here the moment you do.
        </Text>
      </View>

      <View style={styles.toolbarRow}>
        <Pressable
          onPress={() => setRevealAll((v) => !v)}
          style={[styles.toggle, revealAll && styles.toggleActive]}>
          <Text style={[styles.toggleText, revealAll && styles.toggleTextActive]}>
            {revealAll ? 'Hide all words' : 'Show all words'}
          </Text>
        </Pressable>
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

      <Pressable onPress={onNext} style={styles.cta}>
        <Text style={styles.ctaText}>It&rsquo;s in my wallet</Text>
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
  warningBox: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(216,167,90,.16)',
    borderWidth: 1,
    borderColor: 'rgba(168,118,61,.28)',
    marginBottom: Spacing.three,
  },
  warningText: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#6d4f1d',
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
  cta: {
    marginTop: Spacing.three,
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
