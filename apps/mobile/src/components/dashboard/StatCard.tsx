import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  label: string;
  Icon: LucideIcon;
  value: string;
  sub?: string;
}

export function StatCard({ label, Icon, value, sub }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text
          style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          {label}
        </Text>
        <Icon size={16} color={theme.mutedForeground} />
      </View>
      <Text style={[styles.value, { color: theme.foreground, fontFamily: FONTS.sansBold }]}>
        {value}
      </Text>
      {sub && (
        <Text style={[styles.sub, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}>
          {sub}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 22,
  },
  sub: {
    fontSize: 11,
  },
});
