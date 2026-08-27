import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

const DEFAULT_SEGMENT_COUNT = 4;

type ProgressHeaderProps = {
  label: string;
  /** How many of the segments are lit. */
  activeSegments: number;
  /** Total number of segments in the bar. Defaults to 4 (enter/check/people/write). */
  segmentCount?: number;
  onBack: () => void;
};

export function ProgressHeader({
  label,
  activeSegments,
  segmentCount = DEFAULT_SEGMENT_COUNT,
  onBack,
}: ProgressHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            tintColor={Palette.textOnDark}
            size={20}
          />
        </Pressable>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.bars}>
        {Array.from({ length: segmentCount }).map((_, i) => (
          <View
            key={i}
            style={[styles.bar, { backgroundColor: i < activeSegments ? Palette.action : 'rgba(242,240,235,.15)' }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  backButton: {
    width: 38,
    height: 38,
    marginLeft: -Spacing.one,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 13,
    letterSpacing: 1.2,
    color: Palette.labelOnDark,
  },
  bars: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  bar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
});
