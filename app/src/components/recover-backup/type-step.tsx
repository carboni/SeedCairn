import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';
import { SLIP39_WORDLIST } from '@/lib/slip39';

const PIECE_WORD_COUNT = 33;

type TypeStepProps = {
  onSubmit: (mnemonic: string) => void;
};

export function TypeStep({ onSubmit }: TypeStepProps) {
  const [words, setWords] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    const word = draft.trim().toLowerCase();
    if (word && words.length < PIECE_WORD_COUNT) {
      setWords([...words, word]);
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
    setWords(words.slice(0, -1));
  };

  const suggestions = draft.trim()
    ? SLIP39_WORDLIST.filter((w) => w.startsWith(draft.trim().toLowerCase())).slice(0, 3)
    : [];

  const isComplete = words.length === PIECE_WORD_COUNT;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Type this piece, word by word</Text>
      <Text style={styles.body}>
        A piece is 33 words. Space or enter moves on. The piece carries a checksum, so
        we&rsquo;ll flag it if a word can&rsquo;t belong.
      </Text>

      <ScrollView style={styles.wordScroll} contentContainerStyle={styles.wordGrid}>
        {words.map((word, i) => (
          <View key={i} style={styles.wordChip}>
            <Text style={styles.wordIndex}>{i + 1}</Text>
            <Text style={styles.wordText}>{word}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        {suggestions.length > 0 && (
          <View style={styles.suggestionsRow}>
            {suggestions.map((word) => (
              <Pressable
                key={word}
                onPress={() => {
                  setWords([...words, word]);
                  setDraft('');
                }}
                style={styles.suggestionChip}>
                <Text style={styles.suggestionText}>{word}</Text>
              </Pressable>
            ))}
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={handleChangeText}
            onSubmitEditing={commitDraft}
            placeholder={isComplete ? 'All 33 words entered' : `Word ${words.length + 1} on the card`}
            placeholderTextColor={Palette.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isComplete}
            style={styles.textInput}
          />
          <Pressable onPress={undoWord} style={styles.undoButton} hitSlop={8}>
            <Text style={styles.undoButtonText}>⌫</Text>
          </Pressable>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.wordCount}>{words.length} of {PIECE_WORD_COUNT}</Text>
        </View>
        <Pressable
          onPress={() => onSubmit(words.join(' '))}
          disabled={!isComplete}
          style={[styles.cta, !isComplete && styles.ctaDisabled]}>
          <Text style={[styles.ctaText, !isComplete && styles.ctaTextDisabled]}>
            {isComplete ? 'These 33 words check out — keep it' : 'Waiting for all 33 words'}
          </Text>
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
    width: '31.3%',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  wordIndex: {
    width: 15,
    textAlign: 'right',
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 11,
    color: Palette.textTertiary,
  },
  wordText: {
    flex: 1,
    fontFamily: ArchivoFonts.medium,
    fontSize: 13.5,
    color: Palette.textPrimary,
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
  suggestionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  suggestionChip: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 9,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
  },
  suggestionText: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 15,
    color: Palette.textPrimary,
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
  ctaTextDisabled: {
    color: 'rgba(255,255,255,.7)',
  },
});
