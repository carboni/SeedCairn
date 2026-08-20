import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Just a "have they seen the intro" flag — not sensitive, never leaves the
 * device. The app's "remembers nothing" promise is scoped to the seed
 * phrase and shares, not to ordinary UX state like this.
 */
const STORAGE_KEY = 'seedcairn.hasCompletedOnboarding';

type OnboardingContextValue = {
  hasCompletedOnboarding: boolean;
  isReady: boolean;
  completeOnboarding: () => void;
  replayOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => setHasCompletedOnboarding(value === 'true'))
      .finally(() => setIsReady(true));
  }, []);

  const value = useMemo(
    () => ({
      hasCompletedOnboarding,
      isReady,
      completeOnboarding: () => {
        setHasCompletedOnboarding(true);
        void AsyncStorage.setItem(STORAGE_KEY, 'true');
      },
      replayOnboarding: () => {
        setHasCompletedOnboarding(false);
        void AsyncStorage.removeItem(STORAGE_KEY);
      },
    }),
    [hasCompletedOnboarding, isReady],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
