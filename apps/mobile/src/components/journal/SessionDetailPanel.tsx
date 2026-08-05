import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  formatDuration,
  formatTimeRange,
  formatFocusPeriodRanges,
  formatFullDate,
  getSessionOrdinalTitle,
  hasAbnormalFocusGap,
} from '@pomodash/shared';
import { useTaskStore } from '@/store/StoreProvider';
import { Modal } from '@/components/shared/Modal';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { FocusRatingPicker } from '@/components/shared/FocusRatingPicker';
import { DistractionTagPicker } from '@/components/shared/DistractionTagPicker';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
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
      <View style={styles.taskSection}>
        {category && <CategoryBadge category={category} style={styles.categoryBadge} />}
        <Text
          style={[
            styles.taskTitle,
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

      <View style={styles.stats}>
        <View style={[styles.statCol, { borderRightColor: theme.border }]}>
          <Text
            style={[
              styles.statLabel,
              { color: theme.mutedForeground, fontFamily: FONTS.sansMedium },
            ]}
          >
            집중 시간
          </Text>
          <Text style={[styles.statValue, { color: theme.foreground, fontFamily: FONTS.sansBold }]}>
            {formatDuration(session.focusSeconds)}
          </Text>
        </View>
        <View style={styles.statCol}>
          <Text
            style={[
              styles.statLabel,
              { color: theme.mutedForeground, fontFamily: FONTS.sansMedium },
            ]}
          >
            {session.mode === 'free' ? '방식' : '사이클'}
          </Text>
          <Text style={[styles.statValue, { color: theme.foreground, fontFamily: FONTS.sansBold }]}>
            {session.mode === 'free'
              ? '자유 집중'
              : `${session.completedCycles} / ${session.totalCycles}`}
          </Text>
        </View>
      </View>

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
  taskSection: {
    gap: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  taskTitle: {
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
  stats: {
    flexDirection: 'row',
  },
  statCol: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 12,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 16,
  },
  deleteRow: {
    paddingTop: 8,
  },
  deleteText: {
    fontSize: 14,
  },
});
