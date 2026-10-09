import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  title: string;
}

export function GuestPrompt({ title }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansMedium }]}>
            {title}
          </Text>
          <Pressable
            onPress={() => router.push('/login')}
            style={[styles.cta, { backgroundColor: theme.primary }]}
          >
            <Text
              style={[
                styles.ctaText,
                { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              로그인
            </Text>
          </Pressable>
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 15,
    textAlign: 'center',
  },
  cta: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ctaText: {
    fontSize: 14,
  },
});
