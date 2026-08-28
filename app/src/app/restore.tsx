import { entropyToMnemonic } from '@scure/bip39';
import { wordlist as BIP39_WORDLIST } from '@scure/bip39/wordlists/english.js';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressHeader } from '@/components/create-backup/progress-header';
import { AfterStep } from '@/components/recover-backup/after-step';
import { GatherStep } from '@/components/recover-backup/gather-step';
import { HelpSheet } from '@/components/recover-backup/help-sheet';
import { MethodStep } from '@/components/recover-backup/method-step';
import { PhraseStep } from '@/components/recover-backup/phrase-step';
import { TapStep } from '@/components/recover-backup/tap-step';
import { TypeStep } from '@/components/recover-backup/type-step';
import { MaxContentWidth, Palette } from '@/constants/theme';
import { combineMnemonics, decodeMnemonics, type Share } from '@/lib/slip39';

type Step = 'gather' | 'method' | 'tap' | 'type' | 'phrase' | 'after';

type GatheredPiece = {
  mnemonic: string;
  share: Share;
  via: string;
};

const STEP_LABELS: Record<Step, string> = {
  gather: 'YOUR PIECES',
  method: 'YOUR PIECES',
  tap: 'YOUR PIECES',
  type: 'YOUR PIECES',
  phrase: 'YOUR PHRASE',
  after: 'DONE',
};

const STEP_SEGMENTS: Record<Step, number> = {
  gather: 1,
  method: 1,
  tap: 1,
  type: 1,
  phrase: 2,
  after: 3,
};

const SEGMENT_COUNT = 3;
const DEFAULT_REQUIRED = 3;

/** Decodes and validates a single SLIP-39 mnemonic, reusing the same checksum and word checks as combining a full set. */
function decodeSinglePiece(mnemonic: string): Share {
  const groups = decodeMnemonics([mnemonic]);
  return groups.values().next().value![0];
}

export default function RestoreScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('gather');
  const [pieces, setPieces] = useState<GatheredPiece[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const required = pieces[0]?.share.memberThreshold ?? DEFAULT_REQUIRED;
  const enough = pieces.length >= required;

  const words = useMemo(() => {
    if (!enough) return null;
    try {
      const entropy = combineMnemonics(pieces.map((p) => p.mnemonic));
      return entropyToMnemonic(entropy, BIP39_WORDLIST).split(' ');
    } catch {
      return null;
    }
  }, [pieces, enough]);

  const addPiece = (mnemonic: string, via: string) => {
    let share: Share;
    try {
      share = decodeSinglePiece(mnemonic);
    } catch {
      setError("That doesn't check out as a valid piece — check the words and try again.");
      setStep('gather');
      return;
    }
    const first = pieces[0]?.share;
    if (first && first.identifier !== share.identifier) {
      setError(
        'This piece belongs to a different backup — check you’re using pieces from the same set.',
      );
      setStep('gather');
      return;
    }
    if (pieces.some((p) => p.share.memberIndex === share.memberIndex)) {
      setError('You already have this piece.');
      setStep('gather');
      return;
    }
    setPieces((prev) => [...prev, { mnemonic, share, via }]);
    setError(null);
    setStep('gather');
  };

  const handleHeaderBack = () => {
    if (step === 'gather') {
      router.back();
    } else if (step === 'after') {
      setStep('phrase');
    } else {
      setStep('gather');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ProgressHeader
          label={STEP_LABELS[step]}
          activeSegments={STEP_SEGMENTS[step]}
          segmentCount={SEGMENT_COUNT}
          onBack={handleHeaderBack}
        />
        <View style={styles.sheet}>
          {step === 'gather' && (
            <GatherStep
              pieces={pieces.map((p) => ({ memberIndex: p.share.memberIndex, via: p.via }))}
              required={required}
              error={error}
              onAddPiece={() => {
                setError(null);
                setStep('method');
              }}
              onReveal={() => setStep('phrase')}
              onOpenHelp={() => setHelpOpen(true)}
            />
          )}
          {step === 'method' && (
            <MethodStep onSelectTap={() => setStep('tap')} onSelectType={() => setStep('type')} />
          )}
          {step === 'tap' && <TapStep onTagRead={(mnemonic) => addPiece(mnemonic, 'tapped card')} />}
          {step === 'type' && <TypeStep onSubmit={(mnemonic) => addPiece(mnemonic, 'typed in')} />}
          {step === 'phrase' && words && <PhraseStep words={words} onNext={() => setStep('after')} />}
          {step === 'after' && <AfterStep onDone={() => router.back()} />}
        </View>
      </SafeAreaView>
      <HelpSheet visible={helpOpen} onClose={() => setHelpOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.stoneDark,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  sheet: {
    flex: 1,
    backgroundColor: Palette.stoneSheet,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
});
