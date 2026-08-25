'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { FocusRatingPicker } from '@/components/shared/FocusRatingPicker';
import { DistractionTagPicker } from '@/components/shared/DistractionTagPicker';
import { MemoTextarea } from '@/components/shared/MemoTextarea';
import { SessionDetailHeader } from '@/components/journal/SessionDetailHeader';
import { SessionStatsRow } from '@/components/journal/SessionStatsRow';
import { useTaskStore } from '@/store/StoreProvider';
import { getSessionOrdinalTitle } from '@/lib/sessionUtils';
import type { Category, FocusRating, Session, Task } from '@/types';

interface Props {
  session: Session;
  task: Task | null;
  category: Category | null;
  onBack?: () => void;
  onDeleted: () => void;
}

interface EditDraft {
  title: string;
  focusRating: FocusRating | null;
  distractionTags: string[];
  note: string;
}

export function JournalDetailPanel({ session, task, category, onBack, onDeleted }: Props) {
  const updateSessionFields = useTaskStore((s) => s.updateSessionFields);
  const deleteSession = useTaskStore((s) => s.deleteSession);
  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);

  const sessionIndex = (() => {
    const dateKey = session.startedAt.slice(0, 10);
    const sorted = sessions
      .filter((s) => s.startedAt.slice(0, 10) === dateKey)
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    return sorted.findIndex((s) => s.id === session.id);
  })();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditDraft | null>(null);

  const displayTitle =
    session.title ?? task?.title ?? getSessionOrdinalTitle(session.startedAt, sessionIndex);
  const hasRealTitle = session.title !== null || task !== null;
  const taskTitles = [...new Set(tasks.map((t) => t.title))];

  function handleEdit() {
    setDraft({
      title: displayTitle,
      focusRating: session.focusRating,
      distractionTags: session.distractionTags,
      note: session.note ?? '',
    });
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setDraft(null);
  }

  function handleSaveEdit() {
    if (!draft) return;
    void updateSessionFields(session.id, {
      title: draft.title.trim() || null,
      focusRating: draft.focusRating,
      distractionTags: draft.distractionTags,
      note: draft.note.trim() || null,
    });
    setIsEditing(false);
    setDraft(null);
  }

  function handleDelete() {
    void deleteSession(session.id);
    onDeleted();
  }

  return (
    <div className="flex flex-col gap-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로
        </button>
      )}

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

      <div className="border-t border-border" />

      {/* Focus Rating Section */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          집중도
        </span>
        <FocusRatingPicker
          value={isEditing ? (draft?.focusRating ?? null) : session.focusRating}
          onChange={(rating) => setDraft((d) => (d ? { ...d, focusRating: rating } : d))}
          disabled={!isEditing}
        />
      </div>

      {/* Distraction Tags Section */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          방해요소
        </span>
        <DistractionTagPicker
          value={isEditing ? (draft?.distractionTags ?? []) : session.distractionTags}
          onChange={(tags) => setDraft((d) => (d ? { ...d, distractionTags: tags } : d))}
          disabled={!isEditing}
        />
      </div>

      <div className="border-t border-border" />

      {/* Note Section */}
      <div className="flex-1 min-h-0 flex flex-col gap-3">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          메모
        </span>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <MemoTextarea
              value={draft?.note ?? ''}
              onChange={(e) => setDraft((d) => (d ? { ...d, note: e.target.value } : d))}
              placeholder="메모를 남겨보세요..."
              className="flex-1 min-h-0 w-full resize-none rounded-lg bg-muted/50 dark:bg-muted/50 border-border px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-border focus-visible:ring-1 focus-visible:ring-primary"
            />
            <span className="text-xs text-muted-foreground self-end">
              {draft?.note.length ?? 0} / 500
            </span>
          </div>
        ) : (
          <div className="rounded-lg bg-muted/40 px-3.5 py-3">
            {session.note ? (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {session.note}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">메모가 없어요</p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      <SessionStatsRow session={session} />

      <ConfirmDialog
        open={confirmDelete}
        title="기록을 삭제할까요?"
        description="삭제한 기록은 복구할 수 없어요."
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
