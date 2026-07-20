'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { FocusRatingPicker } from '@/components/shared/FocusRatingPicker';
import { DistractionTagPicker } from '@/components/shared/DistractionTagPicker';
import { JournalNoteEditor } from '@/components/journal/JournalNoteEditor';
import { useTaskStore } from '@/store/StoreProvider';
import {
  formatDuration,
  formatTimeRange,
  formatFocusPeriodRanges,
  formatFullDate,
  getSessionOrdinalTitle,
  hasAbnormalFocusGap,
} from '@/lib/sessionUtils';
import type { Category, Session, Task } from '@/types';

interface Props {
  session: Session;
  task: Task | null;
  category: Category | null;
  onBack?: () => void;
  onDeleted: () => void;
}

export function JournalDetailPanel({ session, task, category, onBack, onDeleted }: Props) {
  const updateSessionNote = useTaskStore((s) => s.updateSessionNote);
  const updateSessionRating = useTaskStore((s) => s.updateSessionRating);
  const updateSessionTags = useTaskStore((s) => s.updateSessionTags);
  const deleteSession = useTaskStore((s) => s.deleteSession);
  const sessions = useTaskStore((s) => s.sessions);

  const sessionIndex = (() => {
    const dateKey = session.startedAt.slice(0, 10);
    const sorted = sessions
      .filter((s) => s.startedAt.slice(0, 10) === dateKey)
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    return sorted.findIndex((s) => s.id === session.id);
  })();

  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDelete() {
    deleteSession(session.id);
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

      {/* Task Section */}
      <div className="flex flex-col gap-2">
        {category && <CategoryBadge category={category} className="self-start" />}
        <h2
          className={`text-xl font-bold tracking-tight ${!task ? 'text-muted-foreground' : 'text-foreground'}`}
        >
          {task?.title ?? getSessionOrdinalTitle(session.startedAt, sessionIndex)}
        </h2>
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{formatFullDate(session.startedAt)}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>
            {hasAbnormalFocusGap(session.focusPeriods)
              ? formatFocusPeriodRanges(session.focusPeriods)
              : formatTimeRange(session.startedAt, session.endedAt)}
          </span>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Focus Rating Section */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          집중도
        </span>
        <FocusRatingPicker
          value={session.focusRating}
          onChange={(rating) => updateSessionRating(session.id, rating)}
        />
      </div>

      {/* Distraction Tags Section */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          방해요소
        </span>
        <DistractionTagPicker
          value={session.distractionTags}
          onChange={(tags) => updateSessionTags(session.id, tags)}
        />
      </div>

      <div className="border-t border-border" />

      {/* Note Section */}
      <JournalNoteEditor
        note={session.note}
        onSave={(next) => updateSessionNote(session.id, next)}
      />

      <div className="border-t border-border" />

      {/* Session Stats */}
      <div className="flex">
        <div className="flex-1 flex flex-col gap-1 pr-4 border-r border-border">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            집중 시간
          </span>
          <span className="text-base font-bold text-foreground">
            {formatDuration(session.focusSeconds)}
          </span>
        </div>
        <div className="flex-1 flex flex-col gap-1 pl-4">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {session.mode === 'free' ? '방식' : '사이클'}
          </span>
          <span className="text-base font-bold text-foreground">
            {session.mode === 'free'
              ? '자유 집중'
              : `${session.completedCycles} / ${session.totalCycles}`}
          </span>
        </div>
      </div>

      {/* Delete */}
      <div className="mt-6 pt-4 border-t border-border">
        <button
          onClick={() => setConfirmDelete(true)}
          className="text-sm text-destructive hover:text-destructive/80 transition-colors"
        >
          세션 삭제
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="세션을 삭제할까요?"
        description="삭제한 기록은 복구할 수 없어요."
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
