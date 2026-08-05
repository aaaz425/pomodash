import { Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { DayActivity } from '@pomodash/shared';

const SATURDAY_BLUE = '#3B82F6';
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  data: DayActivity[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function CalendarMonthGrid({ data, selectedDate, onSelectDate }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  if (data.length === 0) return null;

  const firstDayOffset = parseDateKey(data[0].date).getDay();
  const cells: (DayActivity | null)[] = [...Array(firstDayOffset).fill(null), ...data];
  const remainder = cells.length % 7;
  if (remainder > 0) cells.push(...Array(7 - remainder).fill(null));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function weekdayColor(dayOfWeek: number): string {
    if (dayOfWeek === 0) return theme.destructive;
    if (dayOfWeek === 6) return SATURDAY_BLUE;
    return theme.foreground;
  }

  return (
    <View style={[styles.container, { borderColor: theme.border }]}>
      <View
        style={[
          styles.headerRow,
          { borderColor: theme.border, backgroundColor: withAlpha(theme.muted, 0.4) },
        ]}
      >
        {DAY_LABELS.map((label, i) => (
          <Text
            key={label}
            style={[
              styles.headerLabel,
              {
                color:
                  i === 0 ? theme.destructive : i === 6 ? SATURDAY_BLUE : theme.mutedForeground,
                fontFamily: FONTS.sansSemiBold,
              },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (!day) {
            return (
              <View key={`empty-${i}`} style={[styles.cell, { backgroundColor: theme.card }]} />
            );
          }

          const date = parseDateKey(day.date);
          const dayOfWeek = date.getDay();
          const isSelected = selectedDate ? isSameDate(date, selectedDate) : false;
          const isToday = isSameDate(date, today);
          const isFuture = date.getTime() > today.getTime();
          const hasFocus = day.focusMinutes > 0 && !isFuture;
          const isDisabled = isFuture || !hasFocus;

          return (
            <Pressable
              key={day.date}
              onPress={() => onSelectDate(date)}
              disabled={isDisabled}
              style={[
                styles.cell,
                { backgroundColor: isSelected ? withAlpha(theme.primary, 0.1) : theme.card },
              ]}
            >
              <View
                style={[
                  styles.dayNumber,
                  isSelected
                    ? { backgroundColor: theme.primary }
                    : isToday
                      ? { backgroundColor: withAlpha(theme.primary, 0.15) }
                      : undefined,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumberText,
                    {
                      color: isFuture
                        ? withAlpha(theme.mutedForeground, 0.3)
                        : isSelected
                          ? theme.primaryForeground
                          : isToday
                            ? theme.primary
                            : weekdayColor(dayOfWeek),
                      fontFamily: FONTS.sansMedium,
                    },
                  ]}
                >
                  {date.getDate()}
                </Text>
              </View>

              {hasFocus && <View style={[styles.dot, { backgroundColor: theme.primary }]} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  headerLabel: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    minHeight: 56,
    alignItems: 'flex-start',
    padding: 6,
    gap: 4,
  },
  dayNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberText: {
    fontSize: 12,
  },
  dot: {
    marginTop: 'auto',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
