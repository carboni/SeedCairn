module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: ['/node_modules/', '/ios/', '/android/'],
  // @noble/hashes and @scure/bip39 ship pure ESM with no CJS fallback,
  // so they need transforming too (the jest-expo preset's default
  // pattern only transforms RN/Expo packages).
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|@noble|@scure))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
};
