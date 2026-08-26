import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type StampStepProps = {
  personLabel: string;
  pieceNumber: number;
  totalPieces: number;
  words: string[];
  onDone: () => void;
};

export function StampStep({ personLabel, pieceNumber, totalPieces, words, onDone }: StampStepProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const allRevealed = revealed.size === words.length;

  const toggleWord = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setRevealed(allRevealed ? new Set() : new Set(words.map((_, i) => i)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>
        PIECE {pieceNumber} OF {totalPieces}
      </Text>
      <Text style={styles.title}>{personLabel}&rsquo;s piece</Text>
      <Text style={styles.body}>
        Tap a word to reveal it, tap again to hide it. Work through them one at a time as you
        stamp.
      </Text>

      <View style={styles.toolbarRow}>
        <Pressable
          onPress={toggleAll}
          style={[styles.toggle, allRevealed && styles.toggleActive]}>
          <Text style={[styles.toggleText, allRevealed && styles.toggleTextActive]}>
            {allRevealed ? 'Hide all' : 'Reveal all'}
          </Text>
        </Pressable>
        <Text style={styles.hint}>Make sure nobody is looking</Text>
      </View>

      <ScrollView style={styles.wordScroll} contentContainerStyle={styles.wordGrid}>
        {words.map((word, i) => {
          const isRevealed = revealed.has(i);
          return (
            <Pressable key={i} onPress={() => toggleWord(i)} style={styles.wordChip}>
              <Text style={styles.wordIndex}>{i + 1}</Text>
              <Text style={[styles.wordText, !isRevealed && styles.wordTextMasked]}>
                {isRevealed ? word : '•'.repeat(Math.max(word.length, 4))}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable onPress={onDone} style={styles.cta}>
        <Text style={styles.ctaText}>Done stamping</Text>
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
  counter: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 13,
    letterSpacing: 1,
    color: Palette.action,
    marginBottom: Spacing.two,
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
