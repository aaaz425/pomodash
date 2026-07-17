'use client';

import { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { MemoTextarea } from '@/components/shared/MemoTextarea';

interface Props {
  note: string | null;
  onSave: (note: string | null) => void;
}

export function JournalNoteEditor({ note, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  function handleSave() {
    const next = draft.trim() || null;
    if (next !== note) onSave(next);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(note ?? '');
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
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
        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <MemoTextarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="세션에 대한 메모를 남겨보세요..."
            className="flex-1 min-h-0 w-full resize-none rounded-lg bg-muted/50 dark:bg-muted/50 border-border px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-border focus-visible:ring-1 focus-visible:ring-primary"
          />
          <div className="flex items-center justify-between shrink-0">
            <span className="text-xs text-muted-foreground">{draft.length} / 500</span>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
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
          className="flex-1 min-h-[72px] rounded-lg bg-muted/40 px-3.5 py-3 cursor-pointer hover:bg-muted/60 transition-colors"
        >
          {note ? (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{note}</p>
          ) : (
            <p className="text-sm text-muted-foreground">메모를 추가하려면 클릭하세요...</p>
          )}
        </div>
      )}
    </div>
  );
}
