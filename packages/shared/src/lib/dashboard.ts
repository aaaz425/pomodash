import { eachDayOfInterval, endOfMonth, parseISO, startOfMonth } from 'date-fns';

export interface DayActivity {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
}

function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getMonthlyActivityData<T extends { startedAt: string; focusSeconds: number }>(
  sessions: T[],
  today: Date = new Date(),
): DayActivity[] {
  const days = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });

  return days.map((day) => {
    const dateKey = toLocalDateKey(day);
    const focusSeconds = sessions
      .filter((s) => toLocalDateKey(parseISO(s.startedAt)) === dateKey)
      .reduce((sum, s) => sum + s.focusSeconds, 0);
    return { date: dateKey, focusMinutes: Math.round(focusSeconds / 60) };
  });
}
