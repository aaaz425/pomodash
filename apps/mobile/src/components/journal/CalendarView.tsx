import { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getMonthlyActivityData, getSessionsForDate } from '@pomodash/shared';
import { useMonthSessions } from '@/hooks/useMonthSessions';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';
import type { SessionSyncHandle } from './ListView';
import { CalendarMonthNav } from './CalendarMonthNav';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { CalendarDayModal } from './CalendarDayModal';

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

  const { items, updateItem, removeItem } = useMonthSessions(viewedMonth);
  useImperativeHandle(ref, () => ({ updateItem, removeItem }), [updateItem, removeItem]);

  const monthData = getMonthlyActivityData(items, viewedMonth);

  const daySessions = selectedDate
    ? [...getSessionsForDate(items, selectedDate)].sort((a, b) =>
        b.startedAt.localeCompare(a.startedAt),
      )
    : [];

  function handleSelectSession(session: Session) {
    setSelectedDate(null);
    onSelect(session);
  }

  return (
    <View style={styles.container}>
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
        onSelectSession={handleSelectSession}
        onClose={() => setSelectedDate(null)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
