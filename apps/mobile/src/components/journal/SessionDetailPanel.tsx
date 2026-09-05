import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getSessionOrdinalTitle, type FocusRating } from '@pomodash/shared';
import { useTaskStore } from '@/store/StoreProvider';
import { Modal } from '@/components/shared/Modal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { FocusRatingPicker } from '@/components/shared/FocusRatingPicker';
import { DistractionTagPicker } from '@/components/shared/DistractionTagPicker';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Session } from '@/types/sessions';
import { SessionDetailHeader } from './SessionDetailHeader';
import { SessionNoteField } from './SessionNoteField';
import { SessionStatsRow } from './SessionStatsRow';

interface Props {
  session: Session | null;
  onClose: () => void;
  onUpdated: (patch: Partial<Session>) => void;
  onDeleted: () => void;
}

interface EditDraft {
  title: string;
  focusRating: FocusRating | null;
  distractionTags: string[];
  note: string;
}

export function SessionDetailPanel({ session, onClose, onUpdated, onDeleted }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  // 동일 날짜 순번 계산용 — 저널 리스트/캘린더는 각자 페이지네이션/월별로 세션을 들고 있어
  // 전체 히스토리를 아는 전역 store를 그대로 사용한다 (웹 JournalDetailPanel과 동일한 방식)
  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);
  const updateSessionFields = useTaskStore((s) => s.updateSessionFields);
  const deleteSession = useTaskStore((s) => s.deleteSession);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditDraft | null>(null);

  if (!session) return null;

  const task = tasks.find((t) => t.id === session.taskId) ?? null;
  const category = task ? (categories.find((c) => c.id === task.categoryId) ?? null) : null;

  const dateKey = session.startedAt.slice(0, 10);
  const sessionIndex = sessions
    .filter((s) => s.startedAt.slice(0, 10) === dateKey)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    .findIndex((s) => s.id === session.id);

  const displayTitle =
    session.title ?? task?.title ?? getSessionOrdinalTitle(session.startedAt, sessionIndex);
  const hasRealTitle = session.title !== null || task !== null;
  const taskTitles = [...new Set(tasks.map((t) => t.title))];

  function handleEdit() {
    setDraft({
      title: displayTitle,
      focusRating: session?.focusRating ?? null,
      distractionTags: session?.distractionTags ?? [],
      note: session?.note ?? '',
    });
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setDraft(null);
  }

  function handleSaveEdit() {
    if (!draft || !session) return;
    const patch = {
      title: draft.title.trim() || null,
      focusRating: draft.focusRating,
      distractionTags: draft.distractionTags,
      note: draft.note.trim() || null,
    };
    void updateSessionFields(session.id, patch);
    onUpdated(patch);
    setIsEditing(false);
    setDraft(null);
  }

  function handleDelete() {
    if (!session) return;
    void deleteSession(session.id);
    onDeleted();
    onClose();
  }

  return (
    <Modal visible title="기록 상세" onClose={onClose} keyboardShouldPersistTaps="handled">
      <SessionDetailHeader
        session={session}
        category={category}
        displayTitle={displayTitle}
        hasRealTitle={hasRealTitle}
        taskTitles={taskTitles}
        isEditing={isEditing}
        draftTitle={draft?.title ?? ''}
        onDraftTitleChange={(v) => setDraft((d) => (d ? { ...d, title: v } : d))}
        onEdit={handleEdit}
        onDelete={() => setConfirmDelete(true)}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
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
          value={isEditing ? (draft?.focusRating ?? null) : session.focusRating}
          onChange={(rating) => setDraft((d) => (d ? { ...d, focusRating: rating } : d))}
          disabled={!isEditing}
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
          value={isEditing ? (draft?.distractionTags ?? []) : session.distractionTags}
          onChange={(tags) => setDraft((d) => (d ? { ...d, distractionTags: tags } : d))}
          disabled={!isEditing}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <SessionNoteField
        note={session.note}
        isEditing={isEditing}
        draftNote={draft?.note ?? ''}
        onDraftNoteChange={(text) => setDraft((d) => (d ? { ...d, note: text } : d))}
      />

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <SessionStatsRow session={session} />

      <ConfirmModal
        visible={confirmDelete}
        title="기록을 삭제할까요?"
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
});
