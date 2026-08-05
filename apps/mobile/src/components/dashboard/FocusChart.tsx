import { StyleSheet, Text, View } from 'react-native';
import type { TabType } from '@pomodash/shared';
import { getFocusTrendData } from '@/lib/dashboard';
import { EmptyState } from '@/components/shared/EmptyState';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';

interface Props {
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
  tab: TabType;
  focusLabel: string;
}

export function FocusChart({ sessions, tasks, categories, tab, focusLabel }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const { data, categories: usedCategories } = getFocusTrendData(sessions, tasks, categories, tab);
  const hasData = usedCategories.length > 0;

  const rowTotals = data.map((item) =>
    usedCategories.reduce((sum, c) => sum + ((item[c.name] as number) ?? 0), 0),
  );
  const maxTotal = Math.max(...rowTotals, 1);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
          {focusLabel}
        </Text>
        {hasData && (
          <View style={styles.legend}>
            {usedCategories.map((cat) => (
              <View key={cat.name} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                <Text
                  style={[
                    styles.legendLabel,
                    { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                  ]}
                >
                  {cat.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {!hasData ? (
        <EmptyState message="아직 기록된 세션이 없어요" />
      ) : (
        <View style={styles.rows}>
          {data.map((item, i) => {
            const rowTotal = rowTotals[i];
            return (
              <View key={item.label} style={styles.row}>
                <Text
                  style={[
                    styles.rowLabel,
                    { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                  ]}
                >
                  {item.label}
                </Text>
                <View style={styles.trackOuter}>
                  <View
                    style={[
                      styles.trackInner,
                      { width: `${(rowTotal / maxTotal) * 100}%` },
                      rowTotal === 0 && { width: 2, backgroundColor: withAlpha(theme.border, 0.6) },
                    ]}
                  >
                    {usedCategories.map((cat) => {
                      const minutes = (item[cat.name] as number) ?? 0;
                      if (minutes === 0) return null;
                      return (
                        <View
                          key={cat.name}
                          style={{ flex: minutes, backgroundColor: cat.color }}
                        />
                      );
                    })}
                  </View>
                </View>
                <Text
                  style={[
                    styles.rowValue,
                    { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                  ]}
                >
                  {rowTotal > 0 ? `${rowTotal}분` : ''}
                </Text>
              </View>
            );
          })}
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
    minHeight: 200,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 13,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendLabel: {
    fontSize: 11,
  },
  rows: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    width: 32,
    fontSize: 11,
  },
  trackOuter: {
    flex: 1,
    height: 14,
    justifyContent: 'center',
  },
  trackInner: {
    height: 14,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  rowValue: {
    width: 36,
    fontSize: 11,
    textAlign: 'right',
  },
});
