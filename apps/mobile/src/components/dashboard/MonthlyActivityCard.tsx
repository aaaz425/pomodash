import { StyleSheet, Text, View } from 'react-native';
import { formatDuration, type DayActivity } from '@pomodash/shared';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { ContributionCalendar } from './ContributionCalendar';

interface Props {
  monthlyActivity: DayActivity[];
  monthFocusSeconds: number;
  maxStreakDays: number;
  busiestDay: string | null;
}

export function MonthlyActivityCard({
  monthlyActivity,
  monthFocusSeconds,
  maxStreakDays,
  busiestDay,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
        이달의 잔디
      </Text>
      <View style={styles.content}>
        <ContributionCalendar data={monthlyActivity} />
        <View style={styles.stats}>
          <View style={styles.statRow}>
            <Text
              style={[
                styles.statLabel,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              이번달 총 집중
            </Text>
            <Text
              style={[styles.statValue, { color: theme.foreground, fontFamily: FONTS.sansBold }]}
            >
              {monthFocusSeconds === 0 ? '-' : formatDuration(monthFocusSeconds)}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text
              style={[
                styles.statLabel,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              최장 연속기록
            </Text>
            <Text
              style={[styles.statValue, { color: theme.foreground, fontFamily: FONTS.sansBold }]}
            >
              {maxStreakDays}일
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text
              style={[
                styles.statLabel,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              가장 활발한날
            </Text>
            <Text
              style={[styles.statValue, { color: theme.foreground, fontFamily: FONTS.sansBold }]}
            >
              {busiestDay ?? '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 13,
  },
  content: {
    flexDirection: 'row',
    gap: 20,
  },
  stats: {
    justifyContent: 'center',
    gap: 14,
  },
  statRow: {
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
  },
  statValue: {
    fontSize: 14,
  },
});
