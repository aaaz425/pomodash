import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getMonthlyActivityData, getSessionsForDate } from '@pomodash/shared';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';
import { CalendarMonthNav } from './CalendarMonthNav';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { CalendarDayModal } from './CalendarDayModal';

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

  const monthData = getMonthlyActivityData(sessions, viewedMonth);

  const daySessions = selectedDate
    ? [...getSessionsForDate(sessions, selectedDate)].sort((a, b) =>
        b.startedAt.localeCompare(a.startedAt),
      )
    : [];

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
        onSelectSession={(id) => {
          setSelectedDate(null);
          onSelect(id);
        }}
        onClose={() => setSelectedDate(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
