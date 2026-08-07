import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export function AuthDivider() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.row}>
      <View style={[styles.line, { backgroundColor: theme.border }]} />
      <Text style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}>
        또는
      </Text>
      <View style={[styles.line, { backgroundColor: theme.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 12,
  },
});
