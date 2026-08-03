'use client';

import { useMemo, useState } from 'react';
import { CalendarMonthNav } from '@/components/journal/CalendarMonthNav';
import { CalendarMonthGrid } from '@/components/journal/CalendarMonthGrid';
import { CalendarDayModal } from '@/components/journal/CalendarDayModal';
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
        onPrevYear={() => setViewedMonth((m) => addMonths(m, -12))}
        onPrevMonth={() => setViewedMonth((m) => addMonths(m, -1))}
        onNextMonth={() => setViewedMonth((m) => addMonths(m, 1))}
        onNextYear={() => setViewedMonth((m) => addMonths(m, 12))}
        onToday={() => setViewedMonth(new Date())}
      />
      <CalendarMonthGrid
        data={monthData}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <CalendarDayModal
        date={selectedDate}
        sessions={daySessions}
        tasks={tasks}
        categories={categories}
        selectedId={selectedId}
        onSelectSession={(id) => {
          setSelectedDate(null);
          onSelect(id);
        }}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}
