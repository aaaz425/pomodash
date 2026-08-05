import { StyleSheet, Text, View } from 'react-native';
import { formatDuration, type SessionGroup } from '@pomodash/shared';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';
import { SessionListItem } from './SessionListItem';

interface Props {
  groups: SessionGroup<Session>[];
  tasks: Task[];
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function JournalSessionList({ groups, tasks, categories, selectedId, onSelect }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.container}>
      {groups.map((group) => (
        <View key={group.dateKey} style={styles.group}>
          <View style={styles.groupHeader}>
            <Text
              style={[
                styles.groupLabel,
                { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              {group.displayLabel}
            </Text>
            <View style={[styles.groupDivider, { backgroundColor: theme.border }]} />
            <Text
              style={[
                styles.groupTotal,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              {formatDuration(group.totalFocusSeconds)}
            </Text>
          </View>

          <View style={styles.items}>
            {group.sessions.map((session, displayIdx) => {
              const task = tasks.find((t) => t.id === session.taskId) ?? null;
              const category = task
                ? (categories.find((c) => c.id === task.categoryId) ?? null)
                : null;
              return (
                <SessionListItem
                  key={session.id}
                  session={session}
                  task={task}
                  category={category}
                  sessionIndex={group.sessions.length - 1 - displayIdx}
                  isSelected={session.id === selectedId}
                  onPress={() => onSelect(session.id)}
                />
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  group: {
    gap: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupLabel: {
    fontSize: 12,
  },
  groupDivider: {
    flex: 1,
    height: 1,
  },
  groupTotal: {
    fontSize: 11,
  },
  items: {
    gap: 6,
  },
});
