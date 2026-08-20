import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArchivoFonts, Palette, Spacing } from '@/constants/theme';

type ComingSoonProps = {
  title: string;
  description: string;
};

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.stoneSheet,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  title: {
    fontFamily: ArchivoFonts.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.6,
    color: Palette.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontFamily: ArchivoFonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: Palette.textSecondary,
    textAlign: 'center',
  },
});
