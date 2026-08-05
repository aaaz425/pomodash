import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { formatDuration } from '@pomodash/shared';
import { getCategoryFocusData } from '@/lib/dashboard';
import { EmptyState } from '@/components/shared/EmptyState';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';

interface Props {
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
}

export function CategoryChart({ sessions, tasks, categories }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const data = getCategoryFocusData(sessions, tasks, categories);
  const hasData = data.length > 0;
  const totalMinutes = data.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
        카테고리별 집중 비중
      </Text>

      {!hasData ? (
        <EmptyState message="아직 기록된 세션이 없어요" />
      ) : (
        <View style={styles.content}>
          <View style={styles.donutWrap}>
            <PieChart
              data={data.map((item) => ({ value: item.minutes, color: item.color }))}
              donut
              radius={56}
              innerRadius={34}
              innerCircleColor={theme.card}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text
                    style={[
                      styles.centerValue,
                      { color: theme.foreground, fontFamily: FONTS.sansBold },
                    ]}
                  >
                    {formatDuration(totalMinutes * 60)}
                  </Text>
                  <Text
                    style={[
                      styles.centerCaption,
                      { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                    ]}
                  >
                    총 집중
                  </Text>
                </View>
              )}
            />
          </View>

          <View style={styles.legend}>
            {data.map((item) => (
              <View key={item.name} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.legendName,
                    { color: theme.foreground, fontFamily: FONTS.sansMedium },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.legendValue,
                    { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                  ]}
                >
                  {formatDuration(item.minutes * 60)}
                </Text>
                <Text
                  style={[
                    styles.legendPercent,
                    { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                  ]}
                >
                  {item.percent}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 13,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  donutWrap: {
    width: 112,
    height: 112,
  },
  centerLabel: {
    alignItems: 'center',
    maxWidth: 60,
  },
  centerValue: {
    fontSize: 13,
  },
  centerCaption: {
    fontSize: 10,
  },
  legend: {
    flex: 1,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendName: {
    flex: 1,
    fontSize: 12,
  },
  legendValue: {
    width: 64,
    fontSize: 11,
    textAlign: 'right',
  },
  legendPercent: {
    width: 32,
    fontSize: 11,
    textAlign: 'right',
  },
});
