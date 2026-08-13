import {
  addHours,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  min as minDate,
  parseISO,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import type { FocusPeriod } from '../types/timer';
import { TIMER_LIMITS } from '../constants/limits';
import { clampPeriodDuration } from './focusPeriods';

export type TabType = 'today' | 'week' | 'month' | 'all';

export interface DayActivity {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
}

type SessionLike = {
  startedAt: string;
  focusSeconds: number;
  focusPeriods: FocusPeriod[];
};

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
    // 1분 미만 집중도 캘린더에서 사라지지 않도록 반올림 대신 최소 1분 보장
    const focusMinutes = focusSeconds > 0 ? Math.max(1, Math.round(focusSeconds / 60)) : 0;
    return { date: dateKey, focusMinutes };
  });
}

function getTabInterval(tab: Exclude<TabType, 'all'>, today: Date) {
  switch (tab) {
    case 'today':
      return { start: startOfDay(today), end: endOfDay(today) };
    case 'week':
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      };
    case 'month':
      return { start: startOfMonth(today), end: endOfMonth(today) };
  }
}

export function filterSessionsByTab<T extends SessionLike>(
  sessions: T[],
  tab: TabType,
  today: Date = new Date(),
): T[] {
  if (tab === 'all') return sessions;
  const interval = getTabInterval(tab, today);
  return sessions.filter((s) => isWithinInterval(parseISO(s.startedAt), interval));
}

export function getTotalFocusSeconds<T extends SessionLike>(sessions: T[]): number {
  return sessions.reduce((sum, s) => sum + s.focusSeconds, 0);
}

function addPeriodToHourlyTotals(totals: number[], period: FocusPeriod): void {
  const clamped = clampPeriodDuration(period, TIMER_LIMITS.FOCUS_MINUTES_MAX * 60);
  const periodEnd = parseISO(clamped.end);
  let cursor = parseISO(clamped.start);
  while (cursor < periodEnd) {
    const nextHour = addHours(startOfHour(cursor), 1);
    const segmentEnd = minDate([nextHour, periodEnd]);
    totals[cursor.getHours()] += (segmentEnd.getTime() - cursor.getTime()) / 1000;
    cursor = segmentEnd;
  }
}

export function getHourlyFocusSeconds<T extends SessionLike>(sessions: T[]): number[] {
  const totals = Array<number>(24).fill(0);
  for (const s of sessions) {
    if (s.focusPeriods.length === 0) {
      totals[parseISO(s.startedAt).getHours()] += s.focusSeconds;
      continue;
    }
    for (const period of s.focusPeriods) addPeriodToHourlyTotals(totals, period);
  }
  return totals;
}

export function getSessionCount<T extends SessionLike>(sessions: T[]): number {
  return sessions.length;
}

export function getAvgSessionSeconds<T extends SessionLike>(sessions: T[]): number {
  if (sessions.length === 0) return 0;
  return Math.round(getTotalFocusSeconds(sessions) / sessions.length);
}

export function getStreakDays<T extends SessionLike>(
  sessions: T[],
  today: Date = new Date(),
): number {
  if (sessions.length === 0) return 0;

  const dateSet = new Set(sessions.map((s) => toLocalDateKey(parseISO(s.startedAt))));

  let streak = 0;
  const cursor = startOfDay(today);

  while (dateSet.has(toLocalDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getPrevDayFocusSeconds<T extends SessionLike>(
  sessions: T[],
  today: Date = new Date(),
): number {
  const yesterday = subDays(today, 1);
  const interval = { start: startOfDay(yesterday), end: endOfDay(yesterday) };
  return sessions
    .filter((s) => isWithinInterval(parseISO(s.startedAt), interval))
    .reduce((sum, s) => sum + s.focusSeconds, 0);
}

export function getPrevDaySessionCount<T extends SessionLike>(
  sessions: T[],
  today: Date = new Date(),
): number {
  const yesterday = subDays(today, 1);
  const interval = { start: startOfDay(yesterday), end: endOfDay(yesterday) };
  return sessions.filter((s) => isWithinInterval(parseISO(s.startedAt), interval)).length;
}

export function getPrevWeekFocusSeconds<T extends SessionLike>(
  sessions: T[],
  today: Date = new Date(),
): number {
  const prevWeek = subWeeks(today, 1);
  const interval = {
    start: startOfWeek(prevWeek, { weekStartsOn: 1 }),
    end: endOfWeek(prevWeek, { weekStartsOn: 1 }),
  };
  return sessions
    .filter((s) => isWithinInterval(parseISO(s.startedAt), interval))
    .reduce((sum, s) => sum + s.focusSeconds, 0);
}

export function getPrevWeekSessionCount<T extends SessionLike>(
  sessions: T[],
  today: Date = new Date(),
): number {
  const prevWeek = subWeeks(today, 1);
  const interval = {
    start: startOfWeek(prevWeek, { weekStartsOn: 1 }),
    end: endOfWeek(prevWeek, { weekStartsOn: 1 }),
  };
  return sessions.filter((s) => isWithinInterval(parseISO(s.startedAt), interval)).length;
}

export function getPrevMonthFocusSeconds<T extends SessionLike>(
  sessions: T[],
  today: Date = new Date(),
): number {
  const prevMonth = subMonths(today, 1);
  const interval = { start: startOfMonth(prevMonth), end: endOfMonth(prevMonth) };
  return sessions
    .filter((s) => isWithinInterval(parseISO(s.startedAt), interval))
    .reduce((sum, s) => sum + s.focusSeconds, 0);
}

export function getPrevMonthSessionCount<T extends SessionLike>(
  sessions: T[],
  today: Date = new Date(),
): number {
  const prevMonth = subMonths(today, 1);
  const interval = { start: startOfMonth(prevMonth), end: endOfMonth(prevMonth) };
  return sessions.filter((s) => isWithinInterval(parseISO(s.startedAt), interval)).length;
}

export function getMaxStreakDays<T extends SessionLike>(sessions: T[]): number {
  if (sessions.length === 0) return 0;

  const dateSet = Array.from(
    new Set(sessions.map((s) => toLocalDateKey(parseISO(s.startedAt)))),
  ).sort();

  let maxStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < dateSet.length; i++) {
    const prev = new Date(dateSet[i - 1] + 'T00:00:00');
    const curr = new Date(dateSet[i] + 'T00:00:00');
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);

    if (diffDays === 1) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
  }

  return Math.max(maxStreak, currentStreak);
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export function getBusiestDayOfWeek<T extends SessionLike>(
  sessions: T[],
  today: Date = new Date(),
): string | null {
  const monthSessions = filterSessionsByTab(sessions, 'month', today);
  if (monthSessions.length === 0) return null;

  const totals = new Array(7).fill(0);
  for (const s of monthSessions) {
    totals[parseISO(s.startedAt).getDay()] += s.focusSeconds;
  }
  return DAY_NAMES[totals.indexOf(Math.max(...totals))] + '요일';
}

export function getFirstSessionDate<T extends SessionLike>(sessions: T[]): Date | null {
  if (sessions.length === 0) return null;
  const earliest = sessions.reduce((min, s) => (s.startedAt < min.startedAt ? s : min));
  return parseISO(earliest.startedAt);
}
