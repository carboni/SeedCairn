import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type OnboardingContextValue = {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  replayOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const value = useMemo(
    () => ({
      hasCompletedOnboarding,
      completeOnboarding: () => setHasCompletedOnboarding(true),
      replayOnboarding: () => setHasCompletedOnboarding(false),
    }),
    [hasCompletedOnboarding],
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
