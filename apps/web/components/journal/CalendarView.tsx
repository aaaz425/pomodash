'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { CalendarMonthNav } from '@/components/journal/CalendarMonthNav';
import { CalendarMonthGrid } from '@/components/journal/CalendarMonthGrid';
import { CalendarDayModal } from '@/components/journal/CalendarDayModal';
import { useMonthSessions } from '@/hooks/useMonthSessions';
import { getMonthlyActivityData } from '@/lib/dashboard';
import { getSessionsForDate } from '@/lib/sessionUtils';
import type { Category, Session, Task } from '@/types';
import type { SessionSyncHandle } from '@/components/journal/ListView';

interface Props {
  tasks: Task[];
  categories: Category[];
  selectedId: string | null;
  onSelect: (session: Session) => void;
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export const CalendarView = forwardRef<SessionSyncHandle, Props>(function CalendarView(
  { tasks, categories, selectedId, onSelect },
  ref,
) {
  const [viewedMonth, setViewedMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { items: monthSessions, updateItem, removeItem } = useMonthSessions(viewedMonth);

  useImperativeHandle(ref, () => ({ updateItem, removeItem }), [updateItem, removeItem]);

  const monthData = getMonthlyActivityData(monthSessions, viewedMonth);

  const daySessions = selectedDate
    ? [...getSessionsForDate(monthSessions, selectedDate)].sort((a, b) =>
        b.startedAt.localeCompare(a.startedAt),
      )
    : [];

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
        onSelectSession={(session) => {
          setSelectedDate(null);
          onSelect(session);
        }}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
});
