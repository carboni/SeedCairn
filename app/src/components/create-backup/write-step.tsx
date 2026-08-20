import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type WriteStepProps = {
  personLabel: string;
  pieceNumber: number;
  totalPieces: number;
  onMarkWritten: () => void;
};

function WriteIllustration() {
  return (
    <Svg width={180} height={150} viewBox="0 0 180 150" fill="none">
      <Rect x={24} y={34} width={88} height={58} rx={10} fill={Palette.action} />
      <Circle cx={52} cy={63} r={8} stroke="rgba(255,255,255,.75)" strokeWidth={1.6} fill="none" />
      <Path
        d="M64 53a15 15 0 0 1 0 20M72 46a24 24 0 0 1 0 34"
        stroke="rgba(255,255,255,.75)"
        strokeWidth={1.6}
        fill="none"
      />
      <Rect x={104} y={14} width={52} height={98} rx={12} fill={Palette.stoneDark} />
      <Rect x={110} y={20} width={40} height={86} rx={8} fill="#3a3d3b" />
      <Ellipse cx={90} cy={132} rx={56} ry={7} fill="rgba(27,29,28,.08)" />
    </Svg>
  );
}

export function WriteStep({ personLabel, pieceNumber, totalPieces, onMarkWritten }: WriteStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.counter}>
        PIECE {pieceNumber} OF {totalPieces}
      </Text>
      <Text style={styles.title}>Tap to write {personLabel}&rsquo;s piece</Text>
      <Text style={styles.body}>Hold a blank NFC card against the back of your phone until it buzzes.</Text>

      <View style={styles.illustrationWrap}>
        <WriteIllustration />
      </View>

      <View style={styles.spacer} />

      <Pressable onPress={onMarkWritten} style={styles.cta}>
        <Text style={styles.ctaText}>Mark as written</Text>
      </Pressable>
      <View style={styles.altRow}>
        <View style={styles.altButton}>
          <Text style={styles.altButtonText}>Print it instead</Text>
        </View>
        <View style={styles.altButton}>
          <Text style={styles.altButtonText}>Stamp into metal</Text>
        </View>
      </View>
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
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.five,
  },
  spacer: {
    flex: 1,
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
  altRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  altButton: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
  },
  altButtonText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 14,
    color: Palette.textPrimary,
  },
});
