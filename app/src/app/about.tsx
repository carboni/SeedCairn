import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ResetConfirmSheet } from '@/components/about/reset-confirm-sheet';
import { BuildInfo } from '@/constants/build-info';
import { ArchivoFonts, MaxContentWidth, Palette, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/contexts/onboarding-context';

const REPO_URL = 'https://github.com/carboni/seedcairn';

export default function AboutScreen() {
  const router = useRouter();
  const { replayOnboarding } = useOnboarding();
  const [resetOpen, setResetOpen] = useState(false);

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const builtAt = BuildInfo.builtAt === 'unknown' ? 'unknown' : BuildInfo.builtAt.slice(0, 10);
  const commitUrl =
    BuildInfo.commit === 'unknown' ? REPO_URL : `${REPO_URL}/commit/${BuildInfo.commit}`;

  const openCommit = async () => {
    if (process.env.EXPO_OS === 'web') {
      await Linking.openURL(commitUrl);
    } else {
      await openBrowserAsync(commitUrl, { presentationStyle: WebBrowserPresentationStyle.AUTOMATIC });
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              tintColor={Palette.textOnDark}
              size={22}
            />
          </Pressable>
          <Text style={styles.headerTitle}>About this app</Text>
        </View>

        <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>This build</Text>
            <Text style={styles.cardBody}>
              Every version of SeedCairn is published in the open. The commit below is the exact
              code running on this phone, so you — or anyone you ask — can read it and see that
              nothing is sent anywhere.
            </Text>
            <View style={styles.rows}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Version</Text>
                <Text style={styles.rowValue}>{version}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Commit</Text>
                <Text style={styles.rowValueMono}>{BuildInfo.commitShort}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Built</Text>
                <Text style={styles.rowValue}>{builtAt}</Text>
              </View>
            </View>
            <Pressable
              onPress={openCommit}
              style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}>
              <SymbolView
                name={{ ios: 'link', android: 'link', web: 'link' }}
                tintColor={Palette.action}
                size={18}
              />
              <Text style={styles.linkText}>See this commit on GitHub</Text>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                tintColor={Palette.textTertiary}
                size={18}
              />
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Start again</Text>
            <Text style={styles.cardBody}>
              This app remembers nothing — no phrase, no pieces, no account. Resetting clears
              what you&rsquo;ve typed so far and puts you back at the very first screen. Cards
              you&rsquo;ve already written, printed or stamped are untouched.
            </Text>
            <Pressable
              onPress={() => setResetOpen(true)}
              style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
              <Text style={styles.resetButtonText}>Reset the app</Text>
            </Pressable>
          </View>

          <SafeAreaView edges={['bottom']}>
            <Text style={styles.footer}>SeedCairn · open source, MIT licensed</Text>
          </SafeAreaView>
        </ScrollView>
      </SafeAreaView>

      <ResetConfirmSheet
        visible={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          setResetOpen(false);
          replayOnboarding();
        }}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  backButton: {
    width: 44,
    height: 44,
    marginLeft: -Spacing.two,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 17,
    letterSpacing: -0.2,
    color: Palette.textOnDark,
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
    gap: Spacing.four,
  },
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.chip,
  },
  cardLabel: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: Palette.action,
  },
  cardBody: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.textSecondary,
  },
  rows: {
    gap: Spacing.one + 5,
    paddingTop: Spacing.two,
    paddingBottom: 2,
    borderTopWidth: 1,
    borderTopColor: Palette.stoneSheet,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.three,
  },
  rowLabel: {
    width: 76,
    fontFamily: ArchivoFonts.regular,
    fontSize: 12.5,
    color: Palette.textSecondary,
  },
  rowValue: {
    flex: 1,
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 14,
    color: Palette.textPrimary,
  },
  rowValueMono: {
    flex: 1,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: Palette.textPrimary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: 2,
    padding: Spacing.two + 7,
    borderRadius: Spacing.three,
    backgroundColor: Palette.stoneSheet,
  },
  linkText: {
    flex: 1,
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 15,
    letterSpacing: -0.1,
    color: Palette.textPrimary,
  },
  resetButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
  },
  resetButtonText: {
    fontFamily: ArchivoFonts.semiBold,
    fontSize: 15,
    color: Palette.textPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
  footer: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    color: Palette.textSecondary,
    paddingVertical: Spacing.three,
  },
});
