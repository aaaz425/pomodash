import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import {
  formatFocusPeriodRanges,
  formatFullDate,
  formatTimeRange,
  getSessionOrdinalTitle,
  hasAbnormalFocusGap,
  INPUT_LIMITS,
  type FocusRating,
} from '@pomodash/shared';
import { useTaskStore } from '@/store/StoreProvider';
import { Modal } from '@/components/shared/Modal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { TextInput } from '@/components/shared/TextInput';
import { FocusRatingPicker } from '@/components/shared/FocusRatingPicker';
import { DistractionTagPicker } from '@/components/shared/DistractionTagPicker';
import { SessionTitleInput } from '@/components/journal/SessionTitleInput';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
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
    if (!draft || !session) return;
    await updateSessionFields(session.id, {
      title: draft.title.trim() || null,
      focusRating: draft.focusRating,
      distractionTags: draft.distractionTags,
      note: draft.note.trim() || null,
    });
    setIsEditing(false);
    setDraft(null);
  }

  function handleDelete() {
    if (!session) return;
    void deleteSession(session.id);
    setConfirmDelete(false);
    onClose();
  }

  return (
    <Modal visible title="세션 기록" onClose={onClose} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          {category && <CategoryBadge category={category} style={styles.categoryBadge} />}
          <View style={styles.editControls}>
            {isEditing ? (
              <>
                <Pressable onPress={handleCancelEdit} hitSlop={4}>
                  <Text
                    style={[
                      styles.editText,
                      { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                    ]}
                  >
                    취소
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveEdit}
                  style={[styles.saveButton, { backgroundColor: theme.primary }]}
                >
                  <Text
                    style={[
                      styles.saveButtonText,
                      { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
                    ]}
                  >
                    저장
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable onPress={handleEdit} hitSlop={4} accessibilityLabel="편집">
                  <Pencil size={14} color={theme.mutedForeground} />
                </Pressable>
                <Pressable
                  onPress={() => setConfirmDelete(true)}
                  hitSlop={4}
                  accessibilityLabel="기록 삭제"
                >
                  <Trash2 size={14} color={theme.mutedForeground} />
                </Pressable>
              </>
            )}
          </View>
        </View>

        {isEditing ? (
          <SessionTitleInput
            value={draft?.title ?? ''}
            onChange={(v) => setDraft((d) => (d ? { ...d, title: v } : d))}
            taskTitles={taskTitles}
          />
        ) : (
          <Text
            style={[
              styles.title,
              {
                color: hasRealTitle ? theme.foreground : theme.mutedForeground,
                fontFamily: FONTS.sansBold,
              },
            ]}
          >
            {displayTitle}
          </Text>
        )}

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

      <View style={styles.field}>
        <Text
          style={[
            styles.sectionLabel,
            { color: theme.mutedForeground, fontFamily: FONTS.sansSemiBold },
          ]}
        >
          메모
        </Text>
        {isEditing ? (
          <View style={styles.noteEditing}>
            <TextInput
              multiline
              numberOfLines={4}
              maxLength={INPUT_LIMITS.NOTE_MAX_LENGTH}
              value={draft?.note ?? ''}
              onChangeText={(text) => setDraft((d) => (d ? { ...d, note: text } : d))}
              placeholder="세션에 대한 메모를 남겨보세요..."
              style={styles.noteInput}
            />
            <Text
              style={[
                styles.counter,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              {draft?.note.length ?? 0} / {INPUT_LIMITS.NOTE_MAX_LENGTH}
            </Text>
          </View>
        ) : (
          <View style={[styles.noteDisplay, { backgroundColor: withAlpha(theme.muted, 0.4) }]}>
            <Text
              style={[
                styles.noteText,
                {
                  color: session.note ? theme.foreground : theme.mutedForeground,
                  fontFamily: FONTS.sansRegular,
                },
              ]}
            >
              {session.note || '메모가 없어요'}
            </Text>
          </View>
        )}
      </View>

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
  header: {
    gap: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  editControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editText: {
    fontSize: 12,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 12,
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
  noteEditing: {
    gap: 8,
  },
  noteInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 11,
    textAlign: 'right',
  },
  noteDisplay: {
    minHeight: 72,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
