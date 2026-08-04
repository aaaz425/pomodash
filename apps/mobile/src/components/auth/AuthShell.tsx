import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  title?: string;
  children: ReactNode;
}

export function AuthShell({ title, children }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={[styles.brand, { color: theme.primary, fontFamily: FONTS.sansBold }]}>
            Pomodash
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {title && (
              <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansBold }]}>
                {title}
              </Text>
            )}
            {children}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    gap: 24,
  },
  brand: {
    alignSelf: 'center',
    fontSize: 18,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    gap: 24,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
});
