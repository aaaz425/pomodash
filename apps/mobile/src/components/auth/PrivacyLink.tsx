import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { WEB_APP_URL } from '@/store/AuthProvider';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export function PrivacyLink() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <Pressable onPress={() => Linking.openURL(`${WEB_APP_URL}/privacy`)}>
      <Text style={[styles.text, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}>
        개인정보처리방침
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
});
