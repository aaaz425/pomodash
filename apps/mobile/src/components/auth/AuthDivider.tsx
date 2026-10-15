import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/shared/Text';
import { FONTS } from '@/constants/fonts';
import { useThemeTokens } from '@/hooks/use-theme-scheme';

export function AuthDivider() {
  const theme = useThemeTokens();

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
