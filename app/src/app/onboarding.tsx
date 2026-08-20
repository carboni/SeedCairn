import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import {
  Alert,
  Linking,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { CairnMark } from '@/components/cairn-mark';
import { ArchivoFonts, MaxContentWidth, Palette, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/contexts/onboarding-context';
import { scheduleAnnualBackupDrillReminder } from '@/lib/backup-drill-reminder';

function TrustCircleIllustration() {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180" fill="none" style={styles.illustration}>
      <Circle cx={100} cy={52} r={20} fill={Palette.ochre} />
      <Circle cx={34} cy={132} r={15} fill={Palette.stone} />
      <Circle cx={67} cy={150} r={15} fill={Palette.stone} />
      <Circle cx={100} cy={156} r={15} fill={Palette.stone} />
      <Circle cx={133} cy={150} r={15} fill={Palette.stone} />
      <Circle cx={166} cy={132} r={15} fill={Palette.stone} />
      <Path
        d="M100 74v46M100 90 40 124M100 90l60 34M100 96 70 136M100 96l30 40"
        stroke="rgba(207,202,191,.32)"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function CairnStackIllustration() {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180" fill="none" style={styles.illustration}>
      <Ellipse cx={100} cy={160} rx={62} ry={13} fill={Palette.stone} />
      <Ellipse cx={100} cy={132} rx={50} ry={12} fill={Palette.ochre} />
      <Ellipse cx={100} cy={106} rx={40} ry={11} fill={Palette.ochre} />
      <Ellipse cx={100} cy={82} rx={30} ry={10} fill={Palette.ochre} />
      <Ellipse cx={100} cy={60} rx={21} ry={8} fill={Palette.stone} />
      <Circle cx={100} cy={34} r={11} fill={Palette.headerTextOnDark} />
    </Svg>
  );
}

function NfcCardIllustration() {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180" fill="none" style={styles.illustration}>
      <Rect x={18} y={96} width={76} height={50} rx={9} fill={Palette.stone} />
      <Circle cx={42} cy={121} r={9} stroke={Palette.borderStrong} strokeWidth={1.5} fill="none" />
      <Path
        d="M53 112a13 13 0 0 1 0 18M60 106a21 21 0 0 1 0 30"
        stroke={Palette.borderStrong}
        strokeWidth={1.5}
        fill="none"
      />
      <Circle cx={140} cy={121} r={26} fill={Palette.stone} />
      <Circle cx={140} cy={121} r={10} fill={Palette.stoneDark} />
      <Path d="M126 104l28 34M154 104l-28 34" stroke="rgba(216,167,90,.5)" strokeWidth={1.5} />
      <Rect x={70} y={42} width={60} height={38} rx={8} fill={Palette.ochre} />
      <Path
        d="M80 56h40M80 66h26"
        stroke={Palette.stoneDark}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

type Slide = {
  key: string;
  Illustration: () => React.JSX.Element;
  title: string;
  body: string;
  footnote?: string;
  link?: string;
};

const SLIDES: Slide[] = [
  {
    key: 'who',
    Illustration: TrustCircleIllustration,
    title: 'Keep something precious with the people you trust.',
    body: "Your seed phrase is the key to your wallet. Lose it and it's gone. If someone finds it, so is your money. There's a better way than hiding a copy.",
  },
  {
    key: 'how',
    Illustration: CairnStackIllustration,
    title: 'Five pieces. Any three bring it back.',
    body: `We split your phrase into five pieces. You give one to each of your trusted people. No single piece reveals anything. Any three of them, together, rebuild your phrase exactly.`,
    link: 'Change these numbers',
  },
  {
    key: 'where',
    Illustration: NfcCardIllustration,
    title: 'Written onto things you can hold.',
    body: 'Tap each piece onto an NFC card, print it, or stamp it into metal. Nothing is sent anywhere and nothing about your phrase is stored. This app remembers none of it between uses.',
    link: 'Set a reminder',
    footnote:
      "Once a year we can suggest a quick drill, so you can check your backup works long before you need it.",
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useOnboarding();
  const scrollRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [reminderBusy, setReminderBusy] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const isLast = index === SLIDES.length - 1;

  const handleSetReminder = async () => {
    if (reminderBusy) return;
    setReminderBusy(true);
    try {
      const result = await scheduleAnnualBackupDrillReminder();
      if (result === 'scheduled') {
        setReminderSet(true);
        return;
      }
      if (result === 'denied') {
        Alert.alert(
          'Notifications are off',
          'Enable notifications for SeedCairn in Settings to get a yearly backup drill reminder.',
          [
            { text: 'Not now', style: 'cancel' },
            { text: 'Open Settings', onPress: () => void Linking.openSettings() },
          ],
        );
        return;
      }
      Alert.alert(
        'Reminders need a phone',
        'Yearly backup drills can be scheduled on iOS and Android.',
      );
    } finally {
      setReminderBusy(false);
    }
  };

  const goTo = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * containerWidth, animated: true });
    setIndex(i);
  };

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!containerWidth) return;
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / containerWidth);
    setIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <CairnMark size={19} />
            <Text style={styles.brandText}>SeedCairn</Text>
          </View>
          {!isLast && (
            <Pressable onPress={completeOnboarding} hitSlop={12}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>

        <View
          style={styles.scrollWrapper}
          onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            scrollEnabled={containerWidth > 0}>
            {SLIDES.map((slide) => (
              <View key={slide.key} style={[styles.slide, { width: containerWidth }]}>
                <slide.Illustration />
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.body}>{slide.body}</Text>
                {slide.footnote && <Text style={styles.footnote}>{slide.footnote}</Text>}
                {slide.link && (
                  <Pressable
                    hitSlop={8}
                    disabled={slide.key === 'where' && reminderBusy}
                    onPress={slide.key === 'where' ? handleSetReminder : undefined}>
                    <Text style={styles.link}>
                      {slide.key === 'where' && reminderSet ? 'Reminder set' : slide.link}
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((slide, i) => (
              <View
                key={slide.key}
                style={[styles.dot, { backgroundColor: i === index ? Palette.action : 'rgba(242,240,235,.25)' }]}
              />
            ))}
          </View>

          <Pressable
            onPress={() => (isLast ? completeOnboarding() : goTo(index + 1))}
            style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}>
            <Text style={styles.nextButtonText}>{isLast ? 'Get started' : 'Next'}</Text>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              tintColor="#ffffff"
              size={16}
            />
          </Pressable>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    minHeight: Spacing.six,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  brandText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 13,
    letterSpacing: 1.3,
    color: Palette.headerTextOnDark,
  },
  skipText: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 14,
    color: Palette.labelOnDark,
  },
  scrollWrapper: {
    flex: 1,
  },
  slide: {
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  illustration: {
    marginBottom: Spacing.five,
  },
  title: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 34,
    lineHeight: 37,
    letterSpacing: -1.1,
    color: Palette.textOnDark,
    marginBottom: Spacing.three,
  },
  body: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 16,
    lineHeight: 26,
    color: Palette.textOnDarkMuted,
  },
  link: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 14,
    color: '#9dc0cf',
    marginTop: Spacing.three,
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(157,192,207,.4)',
  },
  footnote: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: Palette.textOnDarkFaint,
    marginTop: Spacing.three,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Palette.action,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  nextButtonText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 16,
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.85,
  },
});
