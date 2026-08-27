import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';
import { cancelNfcWrite, isBenignNfcAbort, isNfcReady, writeTextToTag } from '@/lib/nfc';

type WriteStepProps = {
  personLabel: string;
  pieceNumber: number;
  totalPieces: number;
  pieceMnemonic: string;
  onMarkWritten: () => void;
  onPrintInstead: () => void;
  onStampIntoMetal: () => void;
};

type NfcStatus = 'checking' | 'unsupported' | 'waiting' | 'success' | 'error';

const RETRY_DELAY_MS = 1500;

const NFC_STATUS_TEXT: Record<NfcStatus, string | null> = {
  checking: null,
  unsupported: "This device can't write NFC cards — use Print it instead or Stamp into metal below.",
  waiting: 'Listening for a card…',
  success: 'Card written. Tap Mark as written to continue.',
  error: "Couldn't write to that card — trying again…",
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

export function WriteStep({
  personLabel,
  pieceNumber,
  totalPieces,
  pieceMnemonic,
  onMarkWritten,
  onPrintInstead,
  onStampIntoMetal,
}: WriteStepProps) {
  const [nfcStatus, setNfcStatus] = useState<NfcStatus>('checking');

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    async function loop() {
      const ready = await isNfcReady();
      if (cancelled) return;
      if (!ready) {
        setNfcStatus('unsupported');
        return;
      }

      while (!cancelled) {
        setNfcStatus('waiting');
        try {
          await writeTextToTag(pieceMnemonic);
          if (cancelled) return;
          setNfcStatus('success');
          Vibration.vibrate();
          return;
        } catch (error) {
          if (cancelled) return;
          if (!isBenignNfcAbort(error)) {
            setNfcStatus('error');
            await new Promise((resolve) => {
              retryTimer = setTimeout(resolve, RETRY_DELAY_MS);
            });
          }
        }
      }
    }

    loop();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      cancelNfcWrite();
    };
  }, [pieceMnemonic]);

  const statusText = NFC_STATUS_TEXT[nfcStatus];

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>
        PIECE {pieceNumber} OF {totalPieces}
      </Text>
      <Text style={styles.title}>Tap to write {personLabel}&rsquo;s piece</Text>
      <Text style={styles.body}>Hold a blank NFC card against the back of your phone until it buzzes.</Text>
      {statusText && (
        <Text style={[styles.status, nfcStatus === 'success' && styles.statusSuccess]}>
          {statusText}
        </Text>
      )}

      <View style={styles.illustrationWrap}>
        <WriteIllustration />
      </View>

      <View style={styles.spacer} />

      <Pressable onPress={onMarkWritten} style={styles.cta}>
        <Text style={styles.ctaText}>Mark as written</Text>
      </Pressable>
      <View style={styles.altRow}>
        <Pressable onPress={onPrintInstead} style={styles.altButton}>
          <Text style={styles.altButtonText}>Print it instead</Text>
        </Pressable>
        <Pressable onPress={onStampIntoMetal} style={styles.altButton}>
          <Text style={styles.altButtonText}>Stamp into metal</Text>
        </Pressable>
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
  status: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 13,
    marginTop: Spacing.two,
    color: Palette.textTertiary,
  },
  statusSuccess: {
    color: Palette.action,
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
