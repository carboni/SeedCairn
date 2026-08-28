import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

import { RecoveryRing } from './recovery-ring';

type GatheredPiece = {
  memberIndex: number;
  via: string;
};

type GatherStepProps = {
  pieces: GatheredPiece[];
  required: number;
  error: string | null;
  onAddPiece: () => void;
  onReveal: () => void;
  onOpenHelp: () => void;
};

export function GatherStep({ pieces, required, error, onAddPiece, onReveal, onOpenHelp }: GatherStepProps) {
  const enough = pieces.length >= required;
  const stoneOpacities = [0, 1, 2, 3, 4].map((i) =>
    pieces.some((p) => p.memberIndex === i) ? 1 : 0.2,
  ) as [number, number, number, number, number];
  const countNote = enough
    ? 'pieces — enough'
    : pieces.length === required - 1
      ? 'pieces — one more'
      : 'pieces so far';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gather any three pieces</Text>
      <Text style={styles.body}>
        It doesn&rsquo;t matter which three, or how they reach you. The other two stay where they
        are.
      </Text>

      <View style={styles.ringWrap}>
        <RecoveryRing stoneOpacities={stoneOpacities} seedColor={enough ? Palette.ochre : '#3a3d3b'} />
      </View>
      <View style={styles.countRow}>
        <Text style={styles.countValue}>
          {pieces.length} of {required}
        </Text>
        <Text style={styles.countNote}>{countNote}</Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {pieces.length > 0 && (
        <View style={styles.pieceList}>
          {pieces.map((piece) => (
            <View key={piece.memberIndex} style={styles.pieceRow}>
              <Text style={styles.pieceCheck}>✓</Text>
              <Text style={styles.pieceTitle}>Piece {piece.memberIndex + 1}</Text>
              <Text style={styles.pieceVia}>{piece.via}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.spacer} />

      <Pressable onPress={enough ? onReveal : onAddPiece} style={styles.cta}>
        <Text style={styles.ctaText}>
          {enough ? 'Bring the phrase back' : pieces.length === 0 ? 'Add the first piece' : 'Add another piece'}
        </Text>
      </Pressable>
      <Pressable onPress={onOpenHelp} hitSlop={8} style={styles.helpLink}>
        <Text style={styles.helpLinkText}>I can&rsquo;t get three pieces</Text>
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
  },
  ringWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 7,
    marginBottom: Spacing.three,
  },
  countValue: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 20,
    letterSpacing: -0.4,
    color: Palette.textPrimary,
  },
  countNote: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 14,
    color: Palette.textTertiary,
  },
  errorBox: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(178,58,58,.1)',
    borderWidth: 1,
    borderColor: 'rgba(178,58,58,.3)',
    marginBottom: Spacing.three,
  },
  errorText: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#8d3131',
  },
  pieceList: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  pieceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 13,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  pieceCheck: {
    color: Palette.action,
    fontFamily: ArchivoFonts.bold,
    fontSize: 15,
  },
  pieceTitle: {
    flex: 1,
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 15,
    color: Palette.textPrimary,
  },
  pieceVia: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    color: Palette.textTertiary,
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
  helpLink: {
    alignSelf: 'center',
    marginTop: Spacing.three,
  },
  helpLinkText: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 14,
    color: Palette.textSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Palette.underline,
  },
});
