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
import { SessionDetailHeader } from './SessionDetailHeader';
import { SessionNoteField } from './SessionNoteField';
import { SessionStatsRow } from './SessionStatsRow';

interface Props {
  sessionId: string | null;
  onClose: () => void;
}

interface EditDraft {
  title: string;
  focusRating: FocusRating | null;
  distractionTags: string[];
  note: string;
}

export function SessionDetailPanel({ sessionId, onClose }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);
  const updateSessionFields = useTaskStore((s) => s.updateSessionFields);
  const deleteSession = useTaskStore((s) => s.deleteSession);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  // 저장이 비동기(Supabase 왕복)라 이게 없으면 응답 오기 전에 다시 눌러 중복 저장될 수 있음
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const session = sessions.find((s) => s.id === sessionId) ?? null;

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

  async function handleSaveEdit() {
    if (!draft || !session || isSubmitting) return;
    setIsSubmitting(true);
    await updateSessionFields(session.id, {
      title: draft.title.trim() || null,
      focusRating: draft.focusRating,
      distractionTags: draft.distractionTags,
      note: draft.note.trim() || null,
    });
    setIsEditing(false);
    setDraft(null);
  }

  async function handleDelete() {
    if (!session || isDeleting) return;
    setIsDeleting(true);
    await deleteSession(session.id);
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
        isSubmitting={isSubmitting}
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
        loading={isDeleting}
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
