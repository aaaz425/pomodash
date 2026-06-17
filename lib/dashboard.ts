import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subWeeks,
} from 'date-fns';

import type { Session } from '@/types';

export type TabType = 'today' | 'week' | 'month';

function getTabInterval(tab: TabType, today: Date) {
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

export function getPrevWeekSessionCount(sessions: Session[], today: Date = new Date()): number {
  const prevWeek = subWeeks(today, 1);
  const interval = {
    start: startOfWeek(prevWeek, { weekStartsOn: 1 }),
    end: endOfWeek(prevWeek, { weekStartsOn: 1 }),
  };
  return sessions.filter((s) => isWithinInterval(parseISO(s.startedAt), interval)).length;
}

export function getRecentSessions(sessions: Session[], limit = 3): Session[] {
  return [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, limit);
}
