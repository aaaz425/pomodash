import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export function JournalEmptyState() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📋</Text>
      <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansMedium }]}>
        아직 기록이 없어요
      </Text>
      <Text
        style={[styles.subtitle, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
      >
        타이머를 시작해 첫 기록을 만들어보세요
      </Text>
      <Pressable
        onPress={() => router.push('/')}
        style={[styles.cta, { backgroundColor: theme.primary }]}
      >
        <Text
          style={[
            styles.ctaText,
            { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
          ]}
        >
          타이머로 이동
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 96,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 15,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
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
