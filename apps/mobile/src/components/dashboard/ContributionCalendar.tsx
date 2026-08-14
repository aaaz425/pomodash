import { StyleSheet, Text, View } from 'react-native';
import type { DayActivity } from '@pomodash/shared';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  data: DayActivity[];
}

// 월요일 시작(웹 dashboard 원본과 동일 — Journal 캘린더는 일요일 시작이라 다름, 의도적)
const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

const INTENSITY_LEVELS_LIGHT = ['#bbf7d0', '#4ade80', '#22c55e', '#16a34a'];
const INTENSITY_LEVELS_DARK = ['#14532d', '#15803d', '#16a34a', '#4ade80'];

function intensityColor(minutes: number, colors: string[]): string | null {
  if (minutes === 0) return null;
  if (minutes <= 29) return colors[0];
  if (minutes <= 59) return colors[1];
  if (minutes <= 89) return colors[2];
  return colors[3];
}

function dayOfWeekIndex(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00');
  return (d.getDay() + 6) % 7; // 0=월 ... 6=일
}

function formatCellLabel(dateStr: string, minutes: number): string {
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (minutes === 0) return `${month}월 ${day}일`;
  return `${month}월 ${day}일 · ${minutes}분`;
}

export function ContributionCalendar({ data }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const colors = scheme === 'dark' ? INTENSITY_LEVELS_DARK : INTENSITY_LEVELS_LIGHT;

  if (data.length === 0) return null;

  const firstDayOffset = dayOfWeekIndex(data[0].date);
  const cells: (DayActivity | null)[] = [...Array(firstDayOffset).fill(null), ...data];
  const remainder = cells.length % 7;
  if (remainder > 0) cells.push(...Array(7 - remainder).fill(null));

  const weeks: (DayActivity | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {DAY_LABELS.map((label) => (
          <Text
            key={label}
            style={[
              styles.dayLabel,
              { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.weeks}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.row}>
            {week.map((day, di) => {
              if (!day) return <View key={`empty-${wi}-${di}`} style={styles.cell} />;
              const color = intensityColor(day.focusMinutes, colors);
              return (
                <View
                  key={day.date}
                  accessible
                  accessibilityLabel={formatCellLabel(day.date, day.focusMinutes)}
                  style={[styles.cell, { backgroundColor: color ?? theme.muted }]}
                />
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <Text
          style={[
            styles.legendLabel,
            { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
          ]}
        >
          적음
        </Text>
        {colors.map((c) => (
          <View key={c} style={[styles.legendSwatch, { backgroundColor: c }]} />
        ))}
        <Text
          style={[
            styles.legendLabel,
            { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
          ]}
        >
          많음
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 3,
  },
  dayLabel: {
    width: 14,
    fontSize: 9,
    textAlign: 'center',
  },
  weeks: {
    gap: 3,
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  legendLabel: {
    fontSize: 10,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
});
