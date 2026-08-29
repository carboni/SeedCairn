import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WordGrid } from '@/components/seed-entry/word-grid';
import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';
import { SLIP39_WORDLIST } from '@/lib/slip39';

const PIECE_WORD_COUNT = 33;

type TypeStepProps = {
  onSubmit: (mnemonic: string) => void;
};

export function TypeStep({ onSubmit }: TypeStepProps) {
  const [words, setWords] = useState<string[]>(Array(PIECE_WORD_COUNT).fill(''));

  const isComplete = words.every((w) => SLIP39_WORDLIST.includes(w));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Type this piece, word by word</Text>
      <Text style={styles.body}>
        A piece is 33 words. Space or enter moves on. The piece carries a checksum, so
        we&rsquo;ll flag it if a word can&rsquo;t belong.
      </Text>

      <WordGrid
        words={words}
        onChangeWords={setWords}
        wordlist={SLIP39_WORDLIST}
        columns={3}
        footer={
          <>
            <View style={styles.footerRow}>
              <Text style={styles.wordCount}>
                {words.filter((w) => w !== '').length} of {PIECE_WORD_COUNT}
              </Text>
            </View>
            <Pressable
              onPress={() => onSubmit(words.join(' '))}
              disabled={!isComplete}
              style={[styles.cta, !isComplete && styles.ctaDisabled]}>
              <Text style={[styles.ctaText, !isComplete && styles.ctaTextDisabled]}>
                {isComplete ? 'These 33 words check out — keep it' : 'Waiting for all 33 words'}
              </Text>
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
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.three,
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
  ctaTextDisabled: {
    color: 'rgba(255,255,255,.7)',
  },
});
