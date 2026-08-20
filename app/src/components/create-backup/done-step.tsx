import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type DoneStepProps = {
  personLabels: string[];
  onDone: () => void;
};

function CompletedCairnIllustration() {
  return (
    <Svg width={120} height={112} viewBox="0 0 120 112" fill="none">
      <Ellipse cx={60} cy={98} rx={42} ry={9} fill={Palette.stone} />
      <Ellipse cx={60} cy={80} rx={34} ry={8} fill={Palette.stone} />
      <Ellipse cx={60} cy={63} rx={27} ry={7} fill={Palette.stone} />
      <Ellipse cx={60} cy={48} rx={20} ry={6} fill={Palette.stone} />
      <Ellipse cx={60} cy={35} rx={14} ry={5} fill={Palette.stone} />
      <Circle cx={60} cy={18} r={9} fill={Palette.ochre} />
    </Svg>
  );
}

export function DoneStep({ personLabels, onDone }: DoneStepProps) {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationWrap}>
        <CompletedCairnIllustration />
      </View>
      <Text style={styles.title}>Your cairn is built.</Text>
      <Text style={styles.body}>
        Five pieces are written. Give one to each person, and tell them what it is and that they
        should keep it somewhere safe.
      </Text>

      <View style={styles.checklist}>
        {personLabels.map((label, i) => (
          <View key={i} style={styles.checklistRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.checklistName}>{label}</Text>
            <Text style={styles.checklistPiece}>piece {i + 1}</Text>
          </View>
        ))}
      </View>

      <View style={styles.spacer} />

      <Text style={styles.trustText}>
        <Text style={styles.trustTextBold}>This app remembers nothing.</Text> Close it and no
        trace of your phrase or your pieces remains. We&rsquo;ll nudge you in a year to run a
        drill.
      </Text>
      <Pressable onPress={onDone} style={styles.cta}>
        <Text style={styles.ctaText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  illustrationWrap: {
    alignItems: 'center',
    paddingBottom: Spacing.three,
  },
  title: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.9,
    color: Palette.textPrimary,
    marginBottom: Spacing.two,
  },
  body: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: Palette.textSecondary,
    marginBottom: Spacing.three,
  },
  checklist: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  check: {
    color: Palette.action,
    fontFamily: ArchivoFonts.bold,
    fontSize: 15,
  },
  checklistName: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 15,
    color: Palette.textPrimary,
  },
  checklistPiece: {
    marginLeft: 'auto',
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    color: Palette.textTertiary,
  },
  spacer: {
    flex: 1,
  },
  trustText: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    lineHeight: 21,
    color: Palette.textTertiary,
    marginBottom: Spacing.three,
  },
  trustTextBold: {
    fontFamily: ArchivoFonts.semiBold,
    color: Palette.textPrimary,
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
