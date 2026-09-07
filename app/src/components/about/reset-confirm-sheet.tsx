import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type ResetConfirmSheetProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ResetConfirmSheet({ visible, onCancel, onConfirm }: ResetConfirmSheetProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <Text style={styles.kicker}>RESET</Text>
        <Text style={styles.title}>Back to the first screen?</Text>
        <Text style={styles.body}>
          Nothing is deleted — there&rsquo;s nothing kept here to delete. You&rsquo;ll simply
          start the app over.
        </Text>
        <Pressable
          onPress={onConfirm}
          style={({ pressed }) => [styles.confirmButton, pressed && styles.pressed]}>
          <Text style={styles.confirmButtonText}>Reset and start over</Text>
        </Pressable>
        <Pressable onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
    gap: Spacing.two,
  },
  kicker: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Palette.action,
  },
  title: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 20,
    color: Palette.textPrimary,
  },
  body: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.textSecondary,
    marginBottom: Spacing.one,
  },
  confirmButton: {
    marginTop: Spacing.one,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Palette.action,
  },
  confirmButtonText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 16,
    color: '#ffffff',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  cancelButtonText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 16,
    color: Palette.textPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
});
