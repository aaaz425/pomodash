import { StyleSheet, Text, View } from 'react-native';
import {
  formatFocusPeriodRanges,
  formatFullDate,
  formatTimeRange,
  getSessionOrdinalTitle,
  hasAbnormalFocusGap,
} from '@pomodash/shared';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';

interface Props {
  session: Session;
  task: Task | null;
  category: Category | null;
  sessionIndex: number;
}

export function SessionDetailHeader({ session, task, category, sessionIndex }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.container}>
      {category && <CategoryBadge category={category} style={styles.categoryBadge} />}
      <Text
        style={[
          styles.title,
          { color: task ? theme.foreground : theme.mutedForeground, fontFamily: FONTS.sansBold },
        ]}
      >
        {task?.title ?? getSessionOrdinalTitle(session.startedAt, sessionIndex)}
      </Text>
      <View style={styles.metaRow}>
        <Text
          style={[styles.meta, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          {formatFullDate(session.startedAt)}
        </Text>
        <Text style={[styles.metaDot, { color: theme.mutedForeground }]}>·</Text>
        <Text
          style={[styles.meta, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          {hasAbnormalFocusGap(session.focusPeriods)
            ? formatFocusPeriodRanges(session.focusPeriods)
            : formatTimeRange(session.startedAt, session.endedAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  meta: {
    fontSize: 13,
  },
  metaDot: {
    fontSize: 13,
  },
});
