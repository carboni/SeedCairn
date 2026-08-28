import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type MethodStepProps = {
  onSelectTap: () => void;
  onSelectType: () => void;
};

export function MethodStep({ onSelectTap, onSelectType }: MethodStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How is this piece stored?</Text>
      <Text style={styles.body}>
        Pieces can be mixed — a tapped card and two typed ones rebuild the phrase just as well.
      </Text>

      <View style={styles.rows}>
        <Pressable onPress={onSelectTap} style={styles.row}>
          <View style={styles.rowIcon}>
            <SymbolView
              name={{ ios: 'wave.3.right', android: 'nfc', web: 'nfc' }}
              tintColor={Palette.action}
              size={22}
            />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Tap an NFC card</Text>
            <Text style={styles.rowSubtitle}>Nothing to type, nothing to mistype</Text>
          </View>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            tintColor={Palette.textTertiary}
            size={20}
          />
        </Pressable>
        <Pressable onPress={onSelectType} style={styles.row}>
          <View style={styles.rowIcon}>
            <SymbolView
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              tintColor={Palette.action}
              size={22}
            />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Type the words</Text>
            <Text style={styles.rowSubtitle}>From a printed card or stamped metal</Text>
          </View>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            tintColor={Palette.textTertiary}
            size={20}
          />
        </Pressable>
      </View>

      <View style={styles.spacer} />

      <Text style={styles.footnote}>
        A single piece can&rsquo;t reveal anything on its own — not even how long your phrase is.
      </Text>
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
    padding: 17,
    borderRadius: Spacing.three,
    backgroundColor: Palette.card,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47,95,114,.09)',
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 17,
    letterSpacing: -0.2,
    color: Palette.textPrimary,
  },
  rowSubtitle: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Palette.textSecondary,
  },
  spacer: {
    flex: 1,
  },
  footnote: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    lineHeight: 21,
    color: Palette.textTertiary,
  },
});
