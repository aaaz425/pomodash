import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTaskStore } from '@/store/StoreProvider';
import { Modal } from '@/components/shared/Modal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { FocusRatingPicker } from '@/components/shared/FocusRatingPicker';
import { DistractionTagPicker } from '@/components/shared/DistractionTagPicker';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { SessionDetailHeader } from './SessionDetailHeader';
import { SessionStatsRow } from './SessionStatsRow';
import { JournalNoteEditor } from './JournalNoteEditor';

interface Props {
  sessionId: string | null;
  onClose: () => void;
}

export function SessionDetailPanel({ sessionId, onClose }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);
  const updateSessionNote = useTaskStore((s) => s.updateSessionNote);
  const updateSessionRating = useTaskStore((s) => s.updateSessionRating);
  const updateSessionTags = useTaskStore((s) => s.updateSessionTags);
  const deleteSession = useTaskStore((s) => s.deleteSession);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const session = sessions.find((s) => s.id === sessionId) ?? null;

  if (!session) return null;

  const task = tasks.find((t) => t.id === session.taskId) ?? null;
  const category = task ? (categories.find((c) => c.id === task.categoryId) ?? null) : null;

  const dateKey = session.startedAt.slice(0, 10);
  const sessionIndex = sessions
    .filter((s) => s.startedAt.slice(0, 10) === dateKey)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    .findIndex((s) => s.id === session.id);

  function handleDelete() {
    if (!session) return;
    void deleteSession(session.id);
    setConfirmDelete(false);
    onClose();
  }

  return (
    <Modal visible title="세션 기록" onClose={onClose}>
      <SessionDetailHeader
        session={session}
        task={task}
        category={category}
        sessionIndex={sessionIndex}
      />

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.field}>
        <Text
          style={[
            styles.sectionLabel,
            { color: theme.mutedForeground, fontFamily: FONTS.sansSemiBold },
          ]}
        >
          집중도
        </Text>
        <FocusRatingPicker
          value={session.focusRating}
          onChange={(rating) => void updateSessionRating(session.id, rating)}
        />
      </View>

      <View style={styles.field}>
        <Text
          style={[
            styles.sectionLabel,
            { color: theme.mutedForeground, fontFamily: FONTS.sansSemiBold },
          ]}
        >
          방해요소
        </Text>
        <DistractionTagPicker
          value={session.distractionTags}
          onChange={(tags) => void updateSessionTags(session.id, tags)}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <JournalNoteEditor
        note={session.note}
        onSave={(next) => void updateSessionNote(session.id, next)}
      />

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <SessionStatsRow session={session} />

      <Pressable onPress={() => setConfirmDelete(true)} style={styles.deleteRow}>
        <Text
          style={[styles.deleteText, { color: theme.destructive, fontFamily: FONTS.sansRegular }]}
        >
          세션 삭제
        </Text>
      </Pressable>

      <ConfirmModal
        visible={confirmDelete}
        title="세션을 삭제할까요?"
        description="삭제한 기록은 복구할 수 없어요."
        confirmLabel="삭제"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
  field: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  deleteRow: {
    paddingTop: 8,
  },
  deleteText: {
    fontSize: 14,
  },
});
