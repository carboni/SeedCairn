import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type PeopleStepProps = {
  people: string[];
  onChangePeople: (people: string[]) => void;
  onNext: () => void;
};

export function PeopleStep({ people, onChangePeople, onNext }: PeopleStepProps) {
  const setName = (index: number, name: string) => {
    const next = [...people];
    next[index] = name;
    onChangePeople(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who will hold a piece?</Text>
      <Text style={styles.body}>
        Five people, five pieces. Any three of them, together, bring your phrase back. No one
        person can do it alone, and losing up to two pieces is fine.
      </Text>

      <View style={styles.rows}>
        {people.map((name, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{i + 1}</Text>
            </View>
            <TextInput
              value={name}
              onChangeText={(text) => setName(i, text)}
              placeholder={`Person ${i + 1}`}
              placeholderTextColor={Palette.textTertiary}
              style={styles.nameInput}
            />
          </View>
        ))}
      </View>

      <View style={styles.adjustRow}>
        <View style={styles.adjustButton}>
          <Text style={styles.adjustButtonText}>Share with fewer people</Text>
        </View>
        <View style={styles.adjustButton}>
          <Text style={styles.adjustButtonText}>…with more</Text>
        </View>
      </View>

      <View style={styles.spacer} />

      <Text style={styles.footnote}>
        Names are only a reminder for you. They&rsquo;re written on the pieces, never sent
        anywhere.
      </Text>
      <Pressable onPress={onNext} style={styles.cta}>
        <Text style={styles.ctaText}>Make the five pieces</Text>
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
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.chip,
  },
  avatarText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 13,
    color: Palette.textSecondary,
  },
  nameInput: {
    flex: 1,
    fontFamily: ArchivoFonts.medium,
    fontSize: 16,
    color: Palette.textPrimary,
    paddingVertical: Spacing.one,
  },
  adjustRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  adjustButton: {
    paddingVertical: 11,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
  },
  adjustButtonText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 13.5,
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
