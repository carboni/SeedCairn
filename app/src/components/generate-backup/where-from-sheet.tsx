import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type WhereFromSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function WhereFromSheet({ visible, onClose }: WhereFromSheetProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <Text style={styles.title}>Where these words come from</Text>
        <Text style={styles.paragraph}>
          Your phone has a hardware random number generator — the same one that protects your
          banking apps. We ask it for a fresh handful of randomness.
        </Text>
        <Text style={styles.paragraph}>
          That randomness is turned into words using the published BIP-39 list of 2,048 words,
          the same standard your wallet uses. The last word carries a checksum, so a mistyped
          phrase is usually caught.
        </Text>
        <Text style={styles.paragraph}>
          Nothing is asked of any server, and nothing is kept. Turn the internet off while you do
          this if you&rsquo;d like to be certain.
        </Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(22,24,23,.5)',
    justifyContent: 'flex-end',
    zIndex: 60,
  },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  title: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 22,
    letterSpacing: -0.5,
    color: Palette.textPrimary,
  },
  paragraph: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 14.5,
    lineHeight: 22,
    color: '#5d5a54',
  },
  closeButton: {
    marginTop: Spacing.one,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  closeButtonText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 16,
    color: Palette.textPrimary,
  },
});
