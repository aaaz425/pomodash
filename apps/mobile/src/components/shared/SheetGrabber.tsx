import { StyleSheet, View } from 'react-native';
import { useThemeTokens } from '@/hooks/use-theme-scheme';

export function SheetGrabber() {
  const theme = useThemeTokens();

  return (
    <View style={styles.wrap}>
      <View style={[styles.bar, { backgroundColor: theme.mutedForeground }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: 8,
  },
  bar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
});
