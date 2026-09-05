import { StyleSheet, Text, View } from 'react-native';
import { Modal } from '@/components/shared/Modal';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';
import { SessionListItem } from './SessionListItem';

interface Props {
  date: Date | null;
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
  selectedId: string | null;
  onSelectSession: (session: Session) => void;
  onClose: () => void;
}

export function CalendarDayModal({
  date,
  sessions,
  tasks,
  categories,
  selectedId,
  onSelectSession,
  onClose,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  if (!date) return null;

  const title = date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <Modal visible title={title} onClose={onClose}>
      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text
            style={[
              styles.emptyText,
              { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
            ]}
          >
            이 날은 기록이 없어요
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {sessions.map((session, displayIdx) => {
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
                sessionIndex={sessions.length - 1 - displayIdx}
                isSelected={session.id === selectedId}
                onPress={() => onSelectSession(session)}
              />
            );
          })}
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
  },
  list: {
    gap: 6,
  },
});
