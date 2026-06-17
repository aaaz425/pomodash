import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';

import type { Session } from '@/types';

export type TabType = 'today' | 'week' | 'month' | 'all';

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

export function filterSessionsByTab(
  sessions: Session[],
  tab: TabType,
  today: Date = new Date(),
): Session[] {
  if (tab === 'all') return sessions;
  const interval = getTabInterval(tab, today);
  return sessions.filter((s) => isWithinInterval(parseISO(s.startedAt), interval));
}

export function getTotalFocusSeconds(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + s.focusSeconds, 0);
}

export function getSessionCount(sessions: Session[]): number {
  return sessions.length;
}

export function getAvgSessionSeconds(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  return Math.round(getTotalFocusSeconds(sessions) / sessions.length);
}

function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getStreakDays(sessions: Session[], today: Date = new Date()): number {
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

// 이전 기간 집계 함수들

export function getPrevDayFocusSeconds(sessions: Session[], today: Date = new Date()): number {
  const yesterday = subDays(today, 1);
  const interval = { start: startOfDay(yesterday), end: endOfDay(yesterday) };
  return sessions
    .filter((s) => isWithinInterval(parseISO(s.startedAt), interval))
    .reduce((sum, s) => sum + s.focusSeconds, 0);
}

export function getPrevDaySessionCount(sessions: Session[], today: Date = new Date()): number {
  const yesterday = subDays(today, 1);
  const interval = { start: startOfDay(yesterday), end: endOfDay(yesterday) };
  return sessions.filter((s) => isWithinInterval(parseISO(s.startedAt), interval)).length;
}

export function getPrevWeekFocusSeconds(sessions: Session[], today: Date = new Date()): number {
  const prevWeek = subWeeks(today, 1);
  const interval = {
    start: startOfWeek(prevWeek, { weekStartsOn: 1 }),
    end: endOfWeek(prevWeek, { weekStartsOn: 1 }),
  };
  return sessions
    .filter((s) => isWithinInterval(parseISO(s.startedAt), interval))
    .reduce((sum, s) => sum + s.focusSeconds, 0);
}

export function getPrevWeekSessionCount(sessions: Session[], today: Date = new Date()): number {
  const prevWeek = subWeeks(today, 1);
  const interval = {
    start: startOfWeek(prevWeek, { weekStartsOn: 1 }),
    end: endOfWeek(prevWeek, { weekStartsOn: 1 }),
  };
  return sessions.filter((s) => isWithinInterval(parseISO(s.startedAt), interval)).length;
}

export function getPrevMonthFocusSeconds(sessions: Session[], today: Date = new Date()): number {
  const prevMonth = subMonths(today, 1);
  const interval = { start: startOfMonth(prevMonth), end: endOfMonth(prevMonth) };
  return sessions
    .filter((s) => isWithinInterval(parseISO(s.startedAt), interval))
    .reduce((sum, s) => sum + s.focusSeconds, 0);
}

export function getPrevMonthSessionCount(sessions: Session[], today: Date = new Date()): number {
  const prevMonth = subMonths(today, 1);
  const interval = { start: startOfMonth(prevMonth), end: endOfMonth(prevMonth) };
  return sessions.filter((s) => isWithinInterval(parseISO(s.startedAt), interval)).length;
}

export function getFirstSessionDate(sessions: Session[]): Date | null {
  if (sessions.length === 0) return null;
  const earliest = sessions.reduce((min, s) => (s.startedAt < min.startedAt ? s : min));
  return parseISO(earliest.startedAt);
}

export function getRecentSessions(sessions: Session[], limit = 3): Session[] {
  return [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, limit);
}
