import { mnemonicToEntropy } from '@scure/bip39';
import { wordlist as BIP39_WORDLIST } from '@scure/bip39/wordlists/english.js';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckStep } from '@/components/create-backup/check-step';
import { DoneStep } from '@/components/create-backup/done-step';
import { EnterStep } from '@/components/create-backup/enter-step';
import { PeopleStep } from '@/components/create-backup/people-step';
import { ProgressHeader } from '@/components/create-backup/progress-header';
import { StampStep } from '@/components/create-backup/stamp-step';
import { WriteStep } from '@/components/create-backup/write-step';
import { MaxContentWidth, Palette } from '@/constants/theme';
import { buildPieceHtml } from '@/lib/piece-print';
import { generateMnemonics } from '@/lib/slip39';

type Step = 'enter' | 'check' | 'people' | 'write' | 'stamp' | 'done';

const STEP_LABELS: Record<Step, string> = {
  enter: 'ENTER YOUR PHRASE',
  check: "CHECK IT'S RIGHT",
  people: 'CHOOSE YOUR PEOPLE',
  write: 'WRITE THE PIECES',
  stamp: 'WRITE THE PIECES',
  done: 'DONE',
};

const STEP_SEGMENTS: Record<Step, number> = {
  enter: 1,
  check: 2,
  people: 3,
  write: 4,
  stamp: 4,
  done: 4,
};

const PEOPLE_COUNT = 5;
const MEMBER_THRESHOLD = 3;

export default function NewBackupScreen() {
  // This whole flow shows the real phrase and the raw backup pieces — block screenshots and
  // screen recording, and blank the app-switcher thumbnail, for as long as it's on screen.
  usePreventScreenCapture();
  const router = useRouter();
  const [step, setStep] = useState<Step>('enter');
  const [wordLength, setWordLength] = useState<12 | 24>(24);
  // Always sized to the max (24) so that toggling 24 -> 12 -> 24 doesn't
  // discard anything typed into slots 13-24.
  const [allWords, setAllWords] = useState<string[]>(Array(24).fill(''));
  const words = useMemo(() => allWords.slice(0, wordLength), [allWords, wordLength]);
  const setWords = (visibleWords: string[]) => {
    setAllWords((prev) => {
      const next = [...prev];
      for (let i = 0; i < wordLength; i++) next[i] = visibleWords[i] ?? '';
      return next;
    });
  };
  const [people, setPeople] = useState<string[]>(Array(PEOPLE_COUNT).fill(''));
  const [writeIndex, setWriteIndex] = useState(0);
  const [pieces, setPieces] = useState<string[] | null>(null);

  const personLabel = (index: number) => people[index]?.trim() || `Person ${index + 1}`;

  // The split is randomized (fresh identifier and random shares each call), so this must run
  // exactly once per phrase and then stay frozen in state — recomputing while pieces are
  // already written out would silently produce a mixed, unrecoverable set.
  const finalizePieces = () => {
    try {
      const entropy = mnemonicToEntropy(words.join(' '), BIP39_WORDLIST);
      const [group] = generateMnemonics(
        1,
        [{ memberThreshold: MEMBER_THRESHOLD, memberCount: PEOPLE_COUNT }],
        entropy,
      );
      setPieces(group);
    } catch {
      setPieces(null);
    }
    setWriteIndex(0);
  };

  const handleHeaderBack = () => {
    if (step === 'enter') {
      router.back();
    } else if (step === 'check') {
      setStep('enter');
    } else if (step === 'people') {
      setStep('check');
    } else if (step === 'write') {
      if (writeIndex > 0) {
        setWriteIndex((i) => i - 1);
      } else {
        setStep('people');
      }
    } else if (step === 'stamp') {
      setStep('write');
    } else {
      setWriteIndex(PEOPLE_COUNT - 1);
      setStep('write');
    }
  };

  const handleMarkWritten = () => {
    if (writeIndex < PEOPLE_COUNT - 1) {
      setWriteIndex((i) => i + 1);
    } else {
      setStep('done');
    }
  };

  const handlePrint = async () => {
    if (!pieces) return;
    const html = buildPieceHtml({
      personLabel: personLabel(writeIndex),
      pieceNumber: writeIndex + 1,
      totalPieces: PEOPLE_COUNT,
      words: pieces[writeIndex].split(' '),
    });
    try {
      await Print.printAsync({ html });
    } catch {
      // User cancelled the print dialog, or no print service is available — nothing to do.
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ProgressHeader
          label={STEP_LABELS[step]}
          activeSegments={STEP_SEGMENTS[step]}
          onBack={handleHeaderBack}
        />
        <View style={styles.sheet}>
          {step === 'enter' && (
            <EnterStep
              wordLength={wordLength}
              onChangeWordLength={setWordLength}
              words={words}
              onChangeWords={setWords}
              onNext={() => setStep('check')}
            />
          )}
          {step === 'check' && (
            <CheckStep
              words={words}
              onNext={() => setStep('people')}
              onBack={() => setStep('enter')}
            />
          )}
          {step === 'people' && (
            <PeopleStep
              people={people}
              onChangePeople={setPeople}
              onNext={() => {
                finalizePieces();
                setStep('write');
              }}
            />
          )}
          {step === 'write' && pieces && (
            <WriteStep
              personLabel={personLabel(writeIndex)}
              pieceNumber={writeIndex + 1}
              totalPieces={PEOPLE_COUNT}
              pieceMnemonic={pieces[writeIndex]}
              onMarkWritten={handleMarkWritten}
              onPrintInstead={handlePrint}
              onStampIntoMetal={() => setStep('stamp')}
            />
          )}
          {step === 'stamp' && pieces && (
            <StampStep
              personLabel={personLabel(writeIndex)}
              pieceNumber={writeIndex + 1}
              totalPieces={PEOPLE_COUNT}
              words={pieces[writeIndex].split(' ')}
              onDone={() => setStep('write')}
            />
          )}
          {step === 'done' && (
            <DoneStep
              personLabels={people.map((_, i) => personLabel(i))}
              onDone={() => router.back()}
            />
          )}
        </View>
      </SafeAreaView>
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
