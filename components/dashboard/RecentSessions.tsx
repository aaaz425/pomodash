import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { formatDuration, formatTimeRange } from '@/lib/sessionUtils';
import type { Category, Session, Task } from '@/types';

interface Props {
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
}

export function RecentSessions({ sessions, tasks, categories }: Props) {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  if (sessions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">아직 기록된 세션이 없어요</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sessions.map((session) => {
        const task = session.taskId ? (taskMap.get(session.taskId) ?? null) : null;
        const category = task ? (categoryMap.get(task.categoryId) ?? null) : null;
        const timeRange = formatTimeRange(session.startedAt, session.endedAt);
        const duration = formatDuration(session.focusSeconds);

        return (
          <div
            key={session.id}
            className="flex flex-col gap-1.5 px-3 py-2.5 rounded-md bg-muted/50"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {category && <CategoryBadge category={category} />}
                <span className="text-sm font-medium text-foreground truncate">
                  {task?.title ?? '미분류 세션'}
                </span>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{duration}</span>
            </div>
            <p className="text-xs text-muted-foreground">{timeRange}</p>
            {session.note && (
              <p className="text-xs text-muted-foreground/80 line-clamp-1 italic">
                &quot;{session.note}&quot;
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
