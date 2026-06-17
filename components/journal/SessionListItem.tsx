'use client';

import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { formatDuration, formatTimeRange, getSessionOrdinalTitle } from '@/lib/sessionUtils';
import type { Category, Session, Task } from '@/types';

interface Props {
  session: Session;
  task: Task | null;
  category: Category | null;
  sessionIndex: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function SessionListItem({
  session,
  task,
  category,
  sessionIndex,
  isSelected,
  onSelect,
}: Props) {
  const taskTitle = task?.title ?? getSessionOrdinalTitle(session.startedAt, sessionIndex);
  const timeRange = formatTimeRange(session.startedAt, session.endedAt);
  const duration = formatDuration(session.focusSeconds);

  return (
    <button
      onClick={onSelect}
      className={[
        'w-full text-left flex flex-col gap-1.5 px-3.5 py-3 rounded-lg border transition-colors',
        isSelected ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:bg-muted/40',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-sm font-medium truncate ${task ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          {taskTitle}
        </span>
        <span className="shrink-0 text-[11px] text-muted-foreground">{timeRange}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {category ? (
          <CategoryBadge category={category} />
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
            기타
          </span>
        )}
        <span className="text-[11px] text-muted-foreground">{duration}</span>
      </div>
    </button>
  );
}
