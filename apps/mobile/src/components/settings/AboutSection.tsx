import { Linking, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { WEB_APP_URL } from '@/store/AuthProvider';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export function AboutSection() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const version = Constants.expoConfig?.version ?? '—';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.name, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
          Pomodash
        </Text>
        <Text
          style={[styles.version, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          v{version}
        </Text>
      </View>

      <View style={styles.links}>
        <Text
          style={[styles.link, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
          onPress={() => Linking.openURL(`${WEB_APP_URL}/terms`)}
        >
          이용약관
        </Text>
        <Text
          style={[styles.link, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
          onPress={() => Linking.openURL(`${WEB_APP_URL}/privacy`)}
        >
          개인정보처리방침
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 14,
  },
  version: {
    fontSize: 12,
  },
  links: {
    flexDirection: 'row',
    gap: 16,
  },
  link: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
