import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type WalletCheckStepProps = {
  words: string[];
  onNext: () => void;
};

export function WalletCheckStep({ words, onNext }: WalletCheckStepProps) {
  const [typed, setTyped] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    const word = draft.trim().toLowerCase();
    if (word && typed.length < words.length) {
      setTyped([...typed, word]);
    }
    setDraft('');
  };

  const handleChangeText = (text: string) => {
    if (text.endsWith(' ')) {
      commitDraft();
      return;
    }
    setDraft(text);
  };

  const undoWord = () => {
    if (draft) {
      setDraft('');
      return;
    }
    setTyped(typed.slice(0, -1));
  };

  const firstMismatchIndex = typed.findIndex((word, i) => word !== words[i]);
  const hasMismatch = firstMismatchIndex !== -1;
  const isComplete = typed.length === words.length && !hasMismatch;
  const isDone = typed.length === words.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prove the wallet matches</Text>
      <Text style={styles.body}>
        Your wallet will read its phrase back to you to confirm. Type what <Text style={styles.italic}>it</Text> shows
        you, and we&rsquo;ll tell you straight away if a word has drifted.
      </Text>

      {hasMismatch && (
        <View style={styles.mismatchBox}>
          <Text style={styles.mismatchText}>
            Word {firstMismatchIndex + 1} doesn&rsquo;t match what you generated — check your
            wallet and try again.
          </Text>
        </View>
      )}

      <ScrollView style={styles.wordScroll} contentContainerStyle={styles.wordGrid}>
        {words.map((_, i) => {
          const typedWord = typed[i];
          const isMatch = typedWord !== undefined && typedWord === words[i];
          const isBad = typedWord !== undefined && typedWord !== words[i];
          return (
            <View
              key={i}
              style={[styles.wordChip, isBad && styles.wordChipBad, isMatch && styles.wordChipGood]}>
              <Text style={styles.wordIndex}>{i + 1}</Text>
              <Text style={styles.wordText} numberOfLines={1}>
                {typedWord ?? ''}
              </Text>
              {isBad && <Text style={styles.badMark}>✕</Text>}
              {isMatch && <Text style={styles.goodMark}>✓</Text>}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputBar}>
        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={handleChangeText}
            onSubmitEditing={commitDraft}
            placeholder={isDone ? 'All words entered' : `Word ${typed.length + 1}`}
            placeholderTextColor={Palette.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isDone}
            style={styles.textInput}
          />
          <Pressable onPress={undoWord} style={styles.undoButton} hitSlop={8}>
            <Text style={styles.undoButtonText}>⌫</Text>
          </Pressable>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.wordCount}>
            {typed.length} of {words.length}
          </Text>
        </View>
        <Pressable
          onPress={onNext}
          disabled={!isComplete}
          style={[styles.cta, !isComplete && styles.ctaDisabled]}>
          <Text style={styles.ctaText}>Wallet matches</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
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
  italic: {
    fontFamily: ArchivoFonts.medium,
  },
  mismatchBox: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(178,58,58,.1)',
    borderWidth: 1,
    borderColor: 'rgba(178,58,58,.3)',
    marginBottom: Spacing.three,
  },
  mismatchText: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#8d3131',
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
  wordChipGood: {
    borderColor: 'rgba(47,95,114,.4)',
  },
  wordChipBad: {
    borderColor: 'rgba(178,58,58,.4)',
    backgroundColor: 'rgba(178,58,58,.06)',
  },
  wordIndex: {
    width: 16,
    textAlign: 'right',
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 12,
    color: Palette.textTertiary,
  },
  wordText: {
    flex: 1,
    fontFamily: ArchivoFonts.medium,
    fontSize: 15,
    color: Palette.textPrimary,
  },
  goodMark: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 13,
    color: Palette.action,
  },
  badMark: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 13,
    color: '#b23a3a',
  },
  inputBar: {
    marginHorizontal: -Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    backgroundColor: Palette.sunken,
    borderTopWidth: 1,
    borderTopColor: Palette.borderStrong,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  textInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 15,
    paddingHorizontal: Spacing.three,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    backgroundColor: Palette.card,
    fontFamily: ArchivoFonts.regular,
    fontSize: 16,
    color: Palette.textPrimary,
  },
  undoButton: {
    width: 48,
    height: 48,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  undoButtonText: {
    fontSize: 18,
    color: Palette.textSecondary,
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
});
