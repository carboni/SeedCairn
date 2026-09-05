import { generateMnemonic, mnemonicToEntropy } from '@scure/bip39';
import { wordlist as BIP39_WORDLIST } from '@scure/bip39/wordlists/english.js';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DoneStep } from '@/components/create-backup/done-step';
import { PeopleStep } from '@/components/create-backup/people-step';
import { ProgressHeader } from '@/components/create-backup/progress-header';
import { StampStep } from '@/components/create-backup/stamp-step';
import { WriteStep } from '@/components/create-backup/write-step';
import { LengthStep } from '@/components/generate-backup/length-step';
import { PhraseStep } from '@/components/generate-backup/phrase-step';
import { ReadOutStep } from '@/components/generate-backup/read-out-step';
import { WalletCheckStep } from '@/components/generate-backup/wallet-check-step';
import { WhereFromSheet } from '@/components/generate-backup/where-from-sheet';
import { MaxContentWidth, Palette } from '@/constants/theme';
import { buildPieceHtml } from '@/lib/piece-print';
import { generateMnemonics } from '@/lib/slip39';

type Step = 'length' | 'phrase' | 'people' | 'write' | 'stamp' | 'read' | 'check' | 'done';

const STEP_LABELS: Record<Step, string> = {
  length: 'HOW MANY WORDS',
  phrase: 'YOUR NEW PHRASE',
  people: 'CHOOSE YOUR PEOPLE',
  write: 'WRITE THE PIECES',
  stamp: 'WRITE THE PIECES',
  read: 'SET UP YOUR WALLET',
  check: 'PROVE IT MATCHES',
  done: 'DONE',
};

const STEP_SEGMENTS: Record<Step, number> = {
  length: 1,
  phrase: 2,
  people: 3,
  write: 4,
  stamp: 4,
  read: 5,
  check: 5,
  done: 5,
};

const SEGMENT_COUNT = 5;
const PEOPLE_COUNT = 5;
const MEMBER_THRESHOLD = 3;

const PEOPLE_STEP_BODY =
  'We’re doing this before your wallet exists, on purpose — if anything interrupts you, three ' +
  'pieces still bring the phrase back.';

const DONE_TITLE = 'New wallet, already backed up.';
const DONE_BODY =
  'Your wallet holds the phrase and matches word for word. Hand a piece to each person, and ' +
  'tell them what it is and to keep it somewhere safe.';
const DONE_TRUST_TEXT =
  'Close it and the phrase is gone from here — it lives in your wallet and in the five pieces. ' +
  'We’ll nudge you in a year to run a drill.';

export default function GenerateBackupScreen() {
  // This whole flow shows the real phrase and the raw backup pieces — block screenshots and
  // screen recording, and blank the app-switcher thumbnail, for as long as it's on screen.
  usePreventScreenCapture();
  const router = useRouter();
  const [step, setStep] = useState<Step>('length');
  const [wordLength, setWordLength] = useState<12 | 24>(24);
  const [words, setWords] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>(Array(PEOPLE_COUNT).fill(''));
  const [writeIndex, setWriteIndex] = useState(0);
  const [whereFromOpen, setWhereFromOpen] = useState(false);
  const [pieces, setPieces] = useState<string[] | null>(null);

  const personLabel = (index: number) => people[index]?.trim() || `Person ${index + 1}`;

  const generatePhrase = () => {
    const strength = wordLength === 24 ? 256 : 128;
    setWords(generateMnemonic(BIP39_WORDLIST, strength).split(' '));
  };

  const handleGenerate = () => {
    generatePhrase();
    setStep('phrase');
  };

  // The split is randomized (fresh identifier and random shares each call), so this must run
  // exactly once per phrase and then stay frozen in state — recomputing while pieces are
  // already written out would silently produce a mixed, unrecoverable set.
  const finalizePieces = () => {
    if (words.length === 0) {
      setPieces(null);
      return;
    }
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
    if (step === 'length') {
      router.back();
    } else if (step === 'phrase') {
      setStep('length');
    } else if (step === 'people') {
      setStep('phrase');
    } else if (step === 'write') {
      if (writeIndex > 0) {
        setWriteIndex((i) => i - 1);
      } else {
        setStep('people');
      }
    } else if (step === 'stamp') {
      setStep('write');
    } else if (step === 'read') {
      setWriteIndex(PEOPLE_COUNT - 1);
      setStep('write');
    } else if (step === 'check') {
      setStep('read');
    } else {
      setStep('check');
    }
  };

  const handleMarkWritten = () => {
    if (writeIndex < PEOPLE_COUNT - 1) {
      setWriteIndex((i) => i + 1);
    } else {
      setStep('read');
    }
  };

  const handlePrint = async () => {
    if (!pieces) return;
    const html = buildPieceHtml({
      personLabel: personLabel(writeIndex),
      pieceNumber: writeIndex + 1,
      totalPieces: PEOPLE_COUNT,
      memberThreshold: MEMBER_THRESHOLD,
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
          segmentCount={SEGMENT_COUNT}
          onBack={handleHeaderBack}
        />
        <View style={styles.sheet}>
          {step === 'length' && (
            <LengthStep
              wordLength={wordLength}
              onChangeWordLength={setWordLength}
              onNext={handleGenerate}
            />
          )}
          {step === 'phrase' && (
            <PhraseStep
              words={words}
              onNext={() => setStep('people')}
              onRegenerate={generatePhrase}
              onOpenWhereFrom={() => setWhereFromOpen(true)}
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
              body={PEOPLE_STEP_BODY}
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
          {step === 'read' && <ReadOutStep words={words} onNext={() => setStep('check')} />}
          {step === 'check' && (
            <WalletCheckStep words={words} onNext={() => setStep('done')} />
          )}
          {step === 'done' && (
            <DoneStep
              personLabels={people.map((_, i) => personLabel(i))}
              onDone={() => router.back()}
              title={DONE_TITLE}
              body={DONE_BODY}
              trustText={DONE_TRUST_TEXT}
            />
          )}
        </View>
      </SafeAreaView>
      <WhereFromSheet visible={whereFromOpen} onClose={() => setWhereFromOpen(false)} />
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
