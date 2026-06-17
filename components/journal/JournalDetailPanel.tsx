'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useTaskStore } from '@/store/StoreProvider';
import { formatDuration, formatTimeRange, formatFullDate } from '@/lib/sessionUtils';
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
  const deleteSession = useTaskStore((s) => s.deleteSession);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(session.note ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  function handleSaveNote() {
    const next = draft.trim() || null;
    if (next !== session.note) {
      updateSessionNote(session.id, next);
    }
    setEditing(false);
  }

  function handleCancelNote() {
    setDraft(session.note ?? '');
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSaveNote();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelNote();
    }
  }

  function handleDelete() {
    deleteSession(session.id);
    onDeleted();
  }

  return (
    <div className="flex flex-col gap-6 bg-card border border-border rounded-xl p-6">
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
        {category && <CategoryBadge category={category} />}
        <h2
          className={`text-xl font-bold tracking-tight ${!task ? 'text-muted-foreground' : 'text-foreground'}`}
        >
          {task?.title ?? '미분류'}
        </h2>
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{formatFullDate(session.startedAt)}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{formatTimeRange(session.startedAt, session.endedAt)}</span>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Note Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            메모
          </span>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="w-3 h-3" />
              편집
            </button>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
              rows={5}
              placeholder="세션에 대한 메모를 남겨보세요..."
              className="w-full resize-none rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{draft.length} / 500</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelNote}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setEditing(true)}
            className="rounded-lg bg-muted/40 px-3.5 py-3 cursor-pointer hover:bg-muted/60 transition-colors min-h-[72px]"
          >
            {session.note ? (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {session.note}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">메모를 추가하려면 클릭하세요...</p>
            )}
          </div>
        )}
      </div>

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
            사이클
          </span>
          <span className="text-base font-bold text-foreground">
            {session.completedCycles} / {session.totalCycles}
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
