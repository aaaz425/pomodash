import { StyleSheet, Text, View, type DimensionValue } from 'react-native';
import { getHourlyFocusSeconds } from '@pomodash/shared';
import { EmptyState } from '@/components/shared/EmptyState';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Session } from '@/types/sessions';

interface Props {
  sessions: Session[];
}

const X_LABEL_HOURS = [0, 6, 12, 18, 23];

function formatHourLabel(hour: number): string {
  if (hour === 0) return '자정';
  if (hour === 12) return '정오';
  if (hour < 12) return `오전 ${hour}시`;
  return `오후 ${hour - 12}시`;
}

export function HourlyChart({ sessions }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const hourly = getHourlyFocusSeconds(sessions);
  const max = Math.max(...hourly, 1);
  const peakHour = hourly.indexOf(Math.max(...hourly));
  const hasFocus = hourly.some((v) => v > 0);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
          시간대별 집중 분석
        </Text>
        {hasFocus && (
          <View style={[styles.badge, { backgroundColor: withAlpha(theme.primary, 0.15) }]}>
            <Text
              style={[styles.badgeText, { color: theme.primary, fontFamily: FONTS.sansSemiBold }]}
            >
              최다 {formatHourLabel(peakHour)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bars}>
        {hourly.map((val, hour) => {
          const ratio = val / max;
          const height: DimensionValue = val > 0 ? `${Math.max(ratio * 100, 10)}%` : 3;
          const opacity = val > 0 ? Math.max(0.18, 0.18 + ratio * 0.82) : 0.12;
          return (
            <View key={hour} style={styles.barTrack}>
              <View style={[styles.bar, { height, opacity, backgroundColor: theme.primary }]} />
            </View>
          );
        })}
      </View>

      <View style={styles.axisRow}>
        {X_LABEL_HOURS.map((hour) => (
          <Text
            key={hour}
            style={[
              styles.axisLabel,
              { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
            ]}
          >
            {formatHourLabel(hour)}
          </Text>
        ))}
      </View>

      {!hasFocus && <EmptyState message="아직 기록이 없어요" />}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 64,
  },
  barTrack: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 2,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisLabel: {
    fontSize: 10,
  },
});
