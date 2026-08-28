import { useEffect, useState } from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';
import { cancelNfcWrite, isBenignNfcAbort, isNfcReady, readTextFromTag } from '@/lib/nfc';

type TapStepProps = {
  onTagRead: (mnemonic: string) => void;
};

type NfcStatus = 'checking' | 'unsupported' | 'waiting' | 'error';

const RETRY_DELAY_MS = 1500;

const NFC_STATUS_TEXT: Record<NfcStatus, string | null> = {
  checking: null,
  unsupported: "This device can't read NFC cards — use Type the words instead.",
  waiting: 'Listening for a card…',
  error: "Couldn't read that card — trying again…",
};

function TapIllustration() {
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

export function TapStep({ onTagRead }: TapStepProps) {
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
          const text = await readTextFromTag();
          if (cancelled) return;
          Vibration.vibrate();
          onTagRead(text);
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
  }, [onTagRead]);

  const statusText = NFC_STATUS_TEXT[nfcStatus];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hold the card to the back of your phone</Text>
      <Text style={styles.body}>Keep it still until it buzzes. We&rsquo;ll tell you which piece it is.</Text>
      {statusText && <Text style={styles.status}>{statusText}</Text>}

      <View style={styles.illustrationWrap}>
        <TapIllustration />
      </View>
      <View style={styles.spacer} />
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
  status: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 13,
    marginTop: Spacing.two,
    color: Palette.textTertiary,
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.five,
  },
  spacer: {
    flex: 1,
  },
});
