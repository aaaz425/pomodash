import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  month: Date;
  onPrevYear: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onNextYear: () => void;
  onToday: () => void;
}

export function CalendarMonthNav({
  month,
  onPrevYear,
  onPrevMonth,
  onNextMonth,
  onNextYear,
  onToday,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const label = month.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  return (
    <View style={styles.row}>
      <Pressable onPress={onPrevYear} hitSlop={4} style={styles.navButton}>
        <ChevronsLeft size={16} color={theme.mutedForeground} />
      </Pressable>
      <Pressable onPress={onPrevMonth} hitSlop={4} style={styles.navButton}>
        <ChevronLeft size={16} color={theme.mutedForeground} />
      </Pressable>
      <Text style={[styles.label, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
        {label}
      </Text>
      <Pressable onPress={onNextMonth} hitSlop={4} style={styles.navButton}>
        <ChevronRight size={16} color={theme.mutedForeground} />
      </Pressable>
      <Pressable onPress={onNextYear} hitSlop={4} style={styles.navButton}>
        <ChevronsRight size={16} color={theme.mutedForeground} />
      </Pressable>
      <Pressable onPress={onToday} style={[styles.todayButton, { borderColor: theme.border }]}>
        <Text
          style={[
            styles.todayText,
            { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
          ]}
        >
          오늘
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navButton: {
    padding: 6,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    minWidth: 100,
    textAlign: 'center',
  },
  todayButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  todayText: {
    fontSize: 11,
  },
});
