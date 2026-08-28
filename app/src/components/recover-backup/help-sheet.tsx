import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type HelpSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function HelpSheet({ visible, onClose }: HelpSheetProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <Text style={styles.title}>If three pieces are out of reach</Text>
        <Text style={styles.paragraph}>
          A piece can arrive from a distance. Ask the person holding it to photograph their card,
          or to read the 33 words to you over the phone — a single piece on its own reveals
          nothing, so a phone call is safe enough.
        </Text>
        <Text style={styles.paragraph}>
          Two pieces are not enough, and never will be. That&rsquo;s the trade you made for the
          fact that one lost piece can&rsquo;t hurt you.
        </Text>
        <Text style={styles.paragraph}>
          If your wallet still works, don&rsquo;t wait — read its phrase out and build a fresh
          set of five while you can.
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
