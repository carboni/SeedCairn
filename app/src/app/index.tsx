import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CairnMark } from '@/components/cairn-mark';
import { ExternalLink } from '@/components/external-link';
import { ArchivoFonts, MaxContentWidth, Palette, Spacing } from '@/constants/theme';
// import { useOnboarding } from '@/contexts/onboarding-context';

export default function HomeScreen() {
  const router = useRouter();
  // const { replayOnboarding } = useOnboarding();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <CairnMark size={19} />
            <Text style={styles.brandText}>SeedCairn</Text>
          </View>
          <Text style={styles.hero}>keep it together</Text>
          <Text style={styles.heroSubtitle}>Where would you like to start?</Text>
        </View>

        <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent}>
          <Pressable
            onPress={() => router.push('/new-backup')}
            style={({ pressed }) => [styles.card, styles.primaryCard, pressed && styles.pressed]}>
            <View style={[styles.iconChip, styles.primaryIconChip]}>
              <SymbolView
                name={{ ios: 'square.and.arrow.up', android: 'upload', web: 'upload' }}
                tintColor="#ffffff"
                size={22}
              />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.primaryCardTitle}>I have a seed phrase</Text>
              <Text style={styles.primaryCardSubtitle}>Split it into five pieces and hand them out</Text>
            </View>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              tintColor="rgba(255,255,255,.85)"
              size={20}
            />
          </Pressable>

          <Pressable
            onPress={() => router.push('/generate-backup')}
            style={({ pressed }) => [styles.card, styles.middleCard, pressed && styles.pressed]}>
            <View style={[styles.iconChip, styles.middleIconChip]}>
              <SymbolView
                name={{ ios: 'plus', android: 'add', web: 'add' }}
                tintColor="#d8a75a"
                size={22}
              />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.middleCardTitle}>I need a new seed phrase</Text>
              <Text style={styles.middleCardSubtitle}>
                We&rsquo;ll make one, back it up, then set your wallet up from it
              </Text>
            </View>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              tintColor="rgba(246,244,239,.7)"
              size={20}
            />
          </Pressable>

          <Pressable
            onPress={() => router.push('/restore')}
            style={({ pressed }) => [styles.card, styles.secondaryCard, pressed && styles.pressed]}>
            <View style={[styles.iconChip, styles.secondaryIconChip]}>
              <SymbolView
                name={{ ios: 'square.and.arrow.down', android: 'download', web: 'download' }}
                tintColor={Palette.textPrimary}
                size={22}
              />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.secondaryCardTitle}>I need my phrase back</Text>
              <Text style={styles.secondaryCardSubtitle}>Gather three pieces from your people</Text>
            </View>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              tintColor={Palette.textTertiary}
              size={20}
            />
          </Pressable>

          <View style={styles.spacer} />

          {/* <Pressable onPress={replayOnboarding} hitSlop={8} style={styles.replayLink}>
            <Text style={styles.replayText}>Replay the intro</Text>
          </Pressable> */}

          <SafeAreaView edges={['bottom']}>
            <Text style={styles.trustText}>
              <Text style={styles.trustTextBold}>Nothing ever leaves your phone.</Text> This app
              secures your seed phrase (BIP&#8209;39) using Shamir Secret Sharing (SLIP&#8209;39).
              The code is open source so you can verify it:{' '}
              <ExternalLink
                href="https://github.com/carboni/seedcairn"
                style={styles.trustLink}>
                github.com/carboni/seedcairn
              </ExternalLink>
            </Text>
          </SafeAreaView>
        </ScrollView>
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
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  brandText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 13,
    letterSpacing: 1.3,
    color: Palette.headerTextOnDark,
  },
  hero: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: -1.4,
    color: Palette.textOnDark,
    marginBottom: Spacing.three,
  },
  heroSubtitle: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 16,
    lineHeight: 25,
    color: Palette.textOnDarkMuted,
    maxWidth: 300,
  },
  sheet: {
    flex: 1,
    backgroundColor: Palette.stoneSheet,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  sheetContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  primaryCard: {
    backgroundColor: Palette.action,
    boxShadow: `0px 6px 10px 0px ${Palette.stoneDark}40`,
    elevation: 3,
  },
  middleCard: {
    backgroundColor: Palette.stoneDark,
  },
  secondaryCard: {
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  iconChip: {
    width: 46,
    height: 46,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryIconChip: {
    backgroundColor: 'rgba(255,255,255,.16)',
  },
  middleIconChip: {
    backgroundColor: 'rgba(216,167,90,.16)',
  },
  secondaryIconChip: {
    backgroundColor: Palette.chip,
  },
  cardText: {
    flex: 1,
    gap: 5,
  },
  primaryCardTitle: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 18,
    lineHeight: 23,
    letterSpacing: -0.2,
    color: '#ffffff',
  },
  primaryCardSubtitle: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,.75)',
  },
  middleCardTitle: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 18,
    lineHeight: 23,
    letterSpacing: -0.2,
    color: Palette.textOnDark,
  },
  middleCardSubtitle: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Palette.textOnDarkMuted,
  },
  secondaryCardTitle: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 18,
    lineHeight: 23,
    letterSpacing: -0.2,
    color: Palette.textPrimary,
  },
  secondaryCardSubtitle: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Palette.textSecondary,
  },
  spacer: {
    flex: 1,
  },
  replayLink: {
    alignSelf: 'flex-start',
  },
  replayText: {
    fontFamily: ArchivoFonts.medium,
    fontSize: 13,
    color: Palette.textSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Palette.underline,
  },
  pressed: {
    opacity: 0.85,
  },
  trustText: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 12,
    lineHeight: 20,
    color: Palette.textQuaternary,
    paddingVertical: Spacing.three,
  },
  trustTextBold: {
    fontFamily: ArchivoFonts.semiBold,
    color: Palette.textPrimary,
  },
  trustLink: {
    color: Palette.action,
    textDecorationLine: 'underline',
  },
});
