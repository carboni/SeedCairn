import { wordlist as BIP39_WORDLIST } from '@scure/bip39/wordlists/english.js';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    const word = draft.trim().toLowerCase();
    if (word && words.length < wordLength) {
      onChangeWords([...words, word]);
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
    onChangeWords(words.slice(0, -1));
  };

  const suggestions = draft.trim()
    ? BIP39_WORDLIST.filter((w) => w.startsWith(draft.trim().toLowerCase())).slice(0, 3)
    : [];

  const isComplete = words.length === wordLength;

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
                  onChangeWords([...words, word]);
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
            placeholder={isComplete ? 'All words entered' : `Word ${words.length + 1}`}
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
          <Pressable onPress={() => onChangeWords(EXAMPLE_PHRASES[wordLength])} hitSlop={8}>
            <Text style={styles.exampleLink}>Use an example phrase</Text>
          </Pressable>
          <Text style={styles.wordCount}>
            {words.length} of {wordLength}
          </Text>
        </View>
        <Pressable
          onPress={onNext}
          disabled={!isComplete}
          style={[styles.cta, !isComplete && styles.ctaDisabled]}>
          <Text style={styles.ctaText}>Check my phrase</Text>
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
