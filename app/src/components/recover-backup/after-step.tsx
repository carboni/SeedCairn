import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

import { RecoveryRing } from './recovery-ring';

type AfterStepProps = {
  onDone: () => void;
};

const MARK_OPACITIES: [number, number, number, number, number] = [0.618, 0.618, 0.618, 0.618, 0.618];

export function AfterStep({ onDone }: AfterStepProps) {
  return (
    <View style={styles.container}>
      <View style={styles.ringWrap}>
        <RecoveryRing size={132} stoneOpacities={MARK_OPACITIES} seedColor={Palette.ochre} />
      </View>
      <Text style={styles.title}>Back on your feet.</Text>
      <Text style={styles.body}>
        Your five pieces still work exactly as before — recovery didn&rsquo;t spend them. Put the
        ones you borrowed back where they came from.
      </Text>

      <View style={styles.infoList}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Someone else saw the phrase</Text>
          <Text style={styles.infoBody}>
            Make a new phrase and a fresh set of five — the old pieces then mean nothing
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>A piece was lost or damaged</Text>
          <Text style={styles.infoBody}>
            Rebuild the whole set of five, so three are always reachable again
          </Text>
        </View>
      </View>

      <View style={styles.spacer} />

      <Text style={styles.trustText}>
        <Text style={styles.trustTextBold}>This app remembers nothing.</Text> No record that you
        recovered, and no copy of the phrase.
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
  ringWrap: {
    alignItems: 'center',
    paddingBottom: Spacing.two,
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
  infoList: {
    gap: Spacing.two,
  },
  infoRow: {
    gap: 3,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  infoTitle: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 15.5,
    color: Palette.textPrimary,
  },
  infoBody: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textSecondary,
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
