import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckStep } from '@/components/create-backup/check-step';
import { DoneStep } from '@/components/create-backup/done-step';
import { EnterStep } from '@/components/create-backup/enter-step';
import { PeopleStep } from '@/components/create-backup/people-step';
import { ProgressHeader } from '@/components/create-backup/progress-header';
import { WriteStep } from '@/components/create-backup/write-step';
import { MaxContentWidth, Palette } from '@/constants/theme';

type Step = 'enter' | 'check' | 'people' | 'write' | 'done';

const STEP_LABELS: Record<Step, string> = {
  enter: 'ENTER YOUR PHRASE',
  check: "CHECK IT'S RIGHT",
  people: 'CHOOSE YOUR PEOPLE',
  write: 'WRITE THE PIECES',
  done: 'DONE',
};

const STEP_SEGMENTS: Record<Step, number> = {
  enter: 1,
  check: 2,
  people: 3,
  write: 4,
  done: 4,
};

const PEOPLE_COUNT = 5;

export default function NewBackupScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('enter');
  const [wordLength, setWordLength] = useState<12 | 24>(24);
  const [words, setWords] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>(Array(PEOPLE_COUNT).fill(''));
  const [writeIndex, setWriteIndex] = useState(0);

  const personLabel = (index: number) => people[index]?.trim() || `Person ${index + 1}`;

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
            <PeopleStep people={people} onChangePeople={setPeople} onNext={() => setStep('write')} />
          )}
          {step === 'write' && (
            <WriteStep
              personLabel={personLabel(writeIndex)}
              pieceNumber={writeIndex + 1}
              totalPieces={PEOPLE_COUNT}
              onMarkWritten={handleMarkWritten}
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
