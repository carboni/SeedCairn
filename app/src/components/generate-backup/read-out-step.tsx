import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type ReadOutStepProps = {
  words: string[];
  onNext: () => void;
};

export function ReadOutStep({ words, onNext }: ReadOutStepProps) {
  const [index, setIndex] = useState(0);
  const isFirst = index === 0;
  const isLast = index === words.length - 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Now set your wallet up</Text>
      <Text style={styles.body}>
        Choose &ldquo;import a recovery phrase&rdquo; in your wallet, then type these in one at a
        time. Take it slowly — a single wrong word makes a different wallet.
      </Text>

      <View style={styles.wordArea}>
        <Text style={styles.counter}>
          WORD {index + 1} OF {words.length}
        </Text>
        <Text style={styles.word}>{words[index]}</Text>
        <View style={styles.navRow}>
          <Pressable
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            style={[styles.navButton, styles.navButtonPrev, isFirst && styles.navButtonDisabled]}>
            <Text style={[styles.navButtonText, isFirst && styles.navButtonTextDisabled]}>‹</Text>
          </Pressable>
          <Pressable
            onPress={() => setIndex((i) => Math.min(words.length - 1, i + 1))}
            disabled={isLast}
            style={[styles.navButton, styles.navButtonNext, isLast && styles.navButtonDisabled]}>
            <Text style={styles.navButtonNextText}>›</Text>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={onNext} disabled={!isLast} style={[styles.cta, !isLast && styles.ctaDisabled]}>
        <Text style={styles.ctaText}>
          {isLast ? 'I’ve typed it into my wallet' : 'Page through all the words first'}
        </Text>
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
  },
  wordArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.five,
  },
  counter: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 13,
    letterSpacing: 1.4,
    color: Palette.textTertiary,
  },
  word: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 44,
    letterSpacing: -1.4,
    color: Palette.textPrimary,
    textAlign: 'center',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonPrev: {
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
  },
  navButtonNext: {
    backgroundColor: Palette.action,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 24,
    color: Palette.textSecondary,
  },
  navButtonTextDisabled: {
    color: Palette.textTertiary,
  },
  navButtonNextText: {
    fontSize: 24,
    color: '#ffffff',
  },
  cta: {
    marginTop: Spacing.three,
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
});
