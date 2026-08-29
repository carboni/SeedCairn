import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

/** Height budget for the floating suggestion bar, used so the scroll view
 * knows to leave room for it when bringing the active field into view. */
const SUGGESTION_BAR_HEIGHT = 72;

/** How long to wait, after a field blurs, before treating the grid as
 * having lost focus entirely — cancelled if another field focuses first,
 * so switching between fields doesn't flash the suggestion bar off. */
const BLUR_SETTLE_MS = 50;

type WordGridProps = {
  /** One entry per visible slot; '' for a slot not yet filled. */
  words: string[];
  onChangeWords: (words: string[]) => void;
  wordlist: readonly string[];
  /** Chips per row — 2 for a 12/24-word BIP-39 phrase, 3 for a 33-word SLIP-39 piece. */
  columns?: 2 | 3;
};

function isWordInvalid(word: string, wordlist: readonly string[]) {
  return word !== '' && !wordlist.some((w) => w.startsWith(word));
}

export function WordGrid({ words, onChangeWords, wordlist, columns = 2 }: WordGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const focusTokenRef = useRef(0);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateWord = (index: number, value: string) => {
    onChangeWords(words.map((w, i) => (i === index ? value : w)));
  };

  const focusIndex = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const advanceFrom = (index: number) => {
    const nextEmpty = words.findIndex((w, i) => i > index && w === '');
    focusIndex(nextEmpty !== -1 ? nextEmpty : Math.min(index + 1, words.length - 1));
  };

  const handleFocus = (index: number) => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    focusTokenRef.current += 1;
    setActiveIndex(index);
    const word = words[index];
    setSuggestions(word ? wordlist.filter((w) => w.startsWith(word)) : []);
  };

  const handleBlur = () => {
    const token = focusTokenRef.current;
    blurTimeoutRef.current = setTimeout(() => {
      if (focusTokenRef.current === token) {
        setActiveIndex(null);
        setSuggestions([]);
      }
    }, BLUR_SETTLE_MS);
  };

  const handleChangeText = (index: number, text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes(' ')) {
      const tokens = lower.trim().split(/\s+/).filter(Boolean);
      if (tokens.length > 1) {
        // A multi-word paste — fan the tokens out across the following slots.
        const next = [...words];
        let cursor = index;
        for (const token of tokens) {
          if (cursor >= next.length) break;
          next[cursor] = token;
          cursor += 1;
        }
        onChangeWords(next);
        setSuggestions([]);
        focusIndex(Math.min(cursor, words.length - 1));
        return;
      }
      // A single word followed by a space confirms it and moves on.
      const word = tokens[0] ?? '';
      if (word && wordlist.includes(word)) {
        updateWord(index, word);
        advanceFrom(index);
      }
      return;
    }

    updateWord(index, lower);
    if (lower === '') {
      setSuggestions([]);
    } else {
      const matches = wordlist.filter((w) => w.startsWith(lower));
      // Leave suggestions untouched (frozen at the last valid prefix) when
      // the new text no longer matches anything, so a typo doesn't wipe
      // the list the user might want to pick a correction from.
      if (matches.length > 0) setSuggestions(matches);
    }
  };

  const clearWord = (index: number) => {
    updateWord(index, '');
    setSuggestions([]);
    focusIndex(index);
  };

  const selectSuggestion = (word: string) => {
    if (activeIndex === null) return;
    updateWord(activeIndex, word);
    advanceFrom(activeIndex);
  };

  return (
    <>
      <KeyboardAwareScrollView
        style={styles.wordScroll}
        contentContainerStyle={styles.wordGrid}
        bottomOffset={SUGGESTION_BAR_HEIGHT}
        keyboardShouldPersistTaps="handled">
        {words.map((word, i) => {
          const isActive = activeIndex === i;
          const isInvalid = isWordInvalid(word, wordlist);
          return (
            <View
              key={i}
              style={[
                styles.wordChip,
                columns === 3 && styles.wordChipCompact,
                isActive && styles.wordChipActive,
                isInvalid && styles.wordChipError,
              ]}>
              <Text style={styles.wordIndex}>{i + 1}</Text>
              <TextInput
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={word}
                onChangeText={(text) => handleChangeText(i, text)}
                onFocus={() => handleFocus(i)}
                onBlur={handleBlur}
                onSubmitEditing={() => advanceFrom(i)}
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.wordInput, word.length > 0 && styles.wordInputWithClear]}
              />
              {word.length > 0 && (
                <Pressable onPress={() => clearWord(i)} hitSlop={8} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </KeyboardAwareScrollView>

      <KeyboardStickyView enabled={activeIndex !== null && suggestions.length > 0}>
        {activeIndex !== null && suggestions.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.suggestionsBar}
            contentContainerStyle={styles.suggestionsRow}>
            {suggestions.map((word) => (
              <Pressable
                key={word}
                onPress={() => selectSuggestion(word)}
                style={styles.suggestionChip}>
                <Text style={styles.suggestionText}>{word}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </KeyboardStickyView>
    </>
  );
}

const styles = StyleSheet.create({
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
    width: '48%',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  wordChipCompact: {
    width: '31.3%',
    paddingHorizontal: Spacing.two,
  },
  wordChipActive: {
    borderColor: Palette.action,
    borderWidth: 2,
  },
  wordChipError: {
    borderColor: Palette.error,
  },
  wordIndex: {
    width: 16,
    textAlign: 'right',
    marginRight: Spacing.two,
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 12,
    color: Palette.textTertiary,
  },
  wordInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    fontFamily: ArchivoFonts.medium,
    fontSize: 15,
    color: Palette.textPrimary,
  },
  wordInputWithClear: {
    paddingRight: Spacing.four,
  },
  clearButton: {
    position: 'absolute',
    right: Spacing.two,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: Spacing.one,
  },
  clearButtonText: {
    fontSize: 13,
    color: Palette.textTertiary,
  },
  suggestionsBar: {
    marginHorizontal: -Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Palette.sunken,
    borderTopWidth: 1,
    borderTopColor: Palette.borderStrong,
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
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
});
