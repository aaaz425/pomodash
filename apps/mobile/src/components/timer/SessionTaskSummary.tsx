import { StyleSheet, Text, View } from 'react-native';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task, Category } from '@/types/tasks';
import { SessionProgressBadge } from './SessionProgressBadge';
import { SessionTaskSelector } from './SessionTaskSelector';

interface Props {
  isTaskSession: boolean;
  task: Task | null;
  category: Category | null;
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
}

// 세션이 작업에 귀속돼 있으면 요약을, 아니면(미분류) 작업 선택 UI를 보여준다
export function SessionTaskSummary({
  isTaskSession,
  task,
  category,
  selectedTaskId,
  onSelectTask,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  if (!isTaskSession) {
    return <SessionTaskSelector selectedTaskId={selectedTaskId} onSelect={onSelectTask} />;
  }

  return (
    <View style={styles.taskRow}>
      <View style={styles.taskInfo}>
        <Text
          numberOfLines={1}
          style={[styles.taskTitle, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}
        >
          {task?.title ?? '작업 없음'}
        </Text>
        {category && task && <CategoryBadge category={category} style={styles.taskCategoryBadge} />}
      </View>
      <SessionProgressBadge />
    </View>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  taskInfo: {
    flex: 1,
    gap: 8,
  },
  taskTitle: {
    fontSize: 18,
  },
  taskCategoryBadge: {
    alignSelf: 'flex-start',
  },
});
