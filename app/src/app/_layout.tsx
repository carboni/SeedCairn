import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
} from '@expo-google-fonts/archivo';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Palette } from '@/constants/theme';
import { OnboardingProvider, useOnboarding } from '@/contexts/onboarding-context';
import { registerBackupDrillNotificationHandler } from '@/lib/backup-drill-reminder';

registerBackupDrillNotificationHandler();

SplashScreen.preventAutoHideAsync();

/**
 * SeedCairn has one fixed brand look (dark stone header, warm stone
 * sheet), not an OS light/dark adaptive theme, so this replaces
 * expo-router's DarkTheme/DefaultTheme pair rather than switching
 * between them.
 */
const AppNavigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Palette.action,
    background: Palette.stoneSheet,
    card: Palette.stoneDark,
    text: Palette.textOnDark,
    border: Palette.border,
    notification: Palette.ochre,
  },
};

function RootNavigator() {
  const { hasCompletedOnboarding } = useOnboarding();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!hasCompletedOnboarding}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={hasCompletedOnboarding}>
        <Stack.Screen name="index" />
        <Stack.Screen name="new-backup" options={{ presentation: 'modal' }} />
        <Stack.Screen name="generate-backup" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="restore"
          options={{ headerShown: true, title: 'Restore', presentation: 'modal' }}
        />
      </Stack.Protected>
    </Stack>
  );
}

/**
 * Waits for fonts and the persisted onboarding flag before mounting
 * anything (and thus before AnimatedSplashOverlay's first onLayout hides
 * the native splash) — otherwise returning users could flash onto the
 * onboarding screen before the persisted "seen it" value loads.
 */
function AppGate() {
  const { isReady } = useOnboarding();
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
  });

  if (!fontsLoaded || !isReady) {
    return null;
  }

  return (
    <>
      <AnimatedSplashOverlay />
      <RootNavigator />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={AppNavigationTheme}>
      <OnboardingProvider>
        <AppGate />
      </OnboardingProvider>
    </ThemeProvider>
  );
}
