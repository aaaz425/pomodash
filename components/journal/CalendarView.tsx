'use client';

import { useMemo, useState } from 'react';
import { CalendarMonthNav } from '@/components/journal/CalendarMonthNav';
import { CalendarMonthGrid } from '@/components/journal/CalendarMonthGrid';
import { SessionListItem } from '@/components/journal/SessionListItem';
import { getMonthlyActivityData } from '@/lib/dashboard';
import { getSessionsForDate } from '@/lib/sessionUtils';
import type { Category, Session, Task } from '@/types';

interface Props {
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function CalendarView({ sessions, tasks, categories, selectedId, onSelect }: Props) {
  const [viewedMonth, setViewedMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthData = useMemo(
    () => getMonthlyActivityData(sessions, viewedMonth),
    [sessions, viewedMonth],
  );

  const daySessions = useMemo(
    () =>
      selectedDate
        ? [...getSessionsForDate(sessions, selectedDate)].sort((a, b) =>
            b.startedAt.localeCompare(a.startedAt),
          )
        : [],
    [sessions, selectedDate],
  );

  return (
    <div className="flex flex-col gap-4">
      <CalendarMonthNav
        month={viewedMonth}
        onPrev={() => setViewedMonth((m) => addMonths(m, -1))}
        onNext={() => setViewedMonth((m) => addMonths(m, 1))}
      />
      <CalendarMonthGrid
        data={monthData}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {selectedDate && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">
            {selectedDate.toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </span>
          {daySessions.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              이 날은 기록이 없어요
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {daySessions.map((session, displayIdx) => {
                const task = tasks.find((t) => t.id === session.taskId) ?? null;
                const category = task
                  ? (categories.find((c) => c.id === task.categoryId) ?? null)
                  : null;
                return (
                  <SessionListItem
                    key={session.id}
                    session={session}
                    task={task}
                    category={category}
                    sessionIndex={daySessions.length - 1 - displayIdx}
                    isSelected={selectedId === session.id}
                    onSelect={() => onSelect(session.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
