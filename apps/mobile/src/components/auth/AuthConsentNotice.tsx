import { Linking, StyleSheet, Text } from 'react-native';
import { WEB_APP_URL } from '@/store/AuthProvider';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export function AuthConsentNotice() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <Text style={[styles.text, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}>
      가입 시{' '}
      <Text style={styles.link} onPress={() => Linking.openURL(`${WEB_APP_URL}/terms`)}>
        이용약관
      </Text>{' '}
      및{' '}
      <Text style={styles.link} onPress={() => Linking.openURL(`${WEB_APP_URL}/privacy`)}>
        개인정보처리방침
      </Text>
      에 동의하는 것으로 간주됩니다
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
});
