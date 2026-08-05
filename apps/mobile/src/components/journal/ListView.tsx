import { StyleSheet, Text, View } from 'react-native';
import { groupSessionsByDate } from '@pomodash/shared';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';
import { JournalSessionList } from './JournalSessionList';

interface Props {
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ListView({ sessions, tasks, categories, selectedId, onSelect }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const groups = groupSessionsByDate(sessions);

  return (
    <View style={styles.container}>
      <Text style={[styles.count, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}>
        {sessions.length}개의 세션
      </Text>
      <JournalSessionList
        groups={groups}
        tasks={tasks}
        categories={categories}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  count: {
    fontSize: 12,
  },
});
