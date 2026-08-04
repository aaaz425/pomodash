import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  Icon: LucideIcon;
  label: string;
  value: string;
  onPress: () => void;
}

export function SettingsMenuRow({ Icon, label, value, onPress }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.left}>
        <Icon size={16} color={theme.mutedForeground} />
        <Text style={[styles.label, { color: theme.foreground, fontFamily: FONTS.sansRegular }]}>
          {label}
        </Text>
      </View>
      <View style={styles.right}>
        <Text
          style={[styles.value, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          {value}
        </Text>
        <ChevronRight size={16} color={theme.mutedForeground} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 12,
  },
});
