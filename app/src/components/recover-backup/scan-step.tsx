import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type ScanStepProps = {
  onCodeScanned: (data: string) => void;
  onFallbackToType: () => void;
};

export function ScanStep({ onCodeScanned, onFallbackToType }: ScanStepProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    onCodeScanned(data);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.body}>
          SeedCairn only uses the camera to read the QR code on a printed piece — nothing is
          recorded or sent anywhere.
        </Text>
        <View style={styles.spacer} />
        <Pressable
          onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
          style={styles.cta}>
          <Text style={styles.ctaText}>
            {permission.canAskAgain ? 'Allow camera access' : 'Open Settings'}
          </Text>
        </Pressable>
        <Pressable onPress={onFallbackToType} hitSlop={8} style={styles.fallbackLink}>
          <Text style={styles.fallbackLinkText}>Type the words instead</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.body}>Point the camera at the code on the printed card.</Text>

      <View style={styles.cameraWrap}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleScanned}
        />
        <View style={styles.frame} pointerEvents="none">
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
      </View>

      <View style={styles.spacer} />
      <Pressable onPress={onFallbackToType} hitSlop={8} style={styles.fallbackLink}>
        <Text style={styles.fallbackLinkText}>The code is damaged — type the words</Text>
      </Pressable>
    </ScrollView>
  );
}

const CAMERA_SIZE = 230;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Palette.stoneDark,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  title: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.8,
    color: Palette.textOnDark,
    marginBottom: Spacing.two,
  },
  body: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 14.5,
    lineHeight: 22,
    color: Palette.textOnDarkMuted,
  },
  cameraWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#2a2d2b',
  },
  frame: {
    position: 'absolute',
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
  },
  corner: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderColor: Palette.ochre,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 18,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 18,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 18,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 18,
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
  fallbackLink: {
    alignSelf: 'center',
    marginTop: Spacing.three,
  },
  fallbackLinkText: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 14,
    color: Palette.textOnDarkMuted,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242,240,235,.3)',
  },
});
