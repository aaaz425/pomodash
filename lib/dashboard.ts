import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';

import type { Category, Session, Task } from '@/types';
import { CATEGORY_HEX_COLORS } from '@/lib/constants/categoryColors';

function tailwindToHex(colorClass: string): string {
  return CATEGORY_HEX_COLORS[colorClass as keyof typeof CATEGORY_HEX_COLORS] ?? '#6b7280';
}

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

export interface DayActivity {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
}

export function getMonthlyActivityData(
  sessions: Session[],
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

export function getMaxStreakDays(sessions: Session[]): number {
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

export function getBusiestDayOfWeek(sessions: Session[], today: Date = new Date()): string | null {
  const monthSessions = filterSessionsByTab(sessions, 'month', today);
  if (monthSessions.length === 0) return null;

  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
  const totals = new Array(7).fill(0);
  for (const s of monthSessions) {
    totals[parseISO(s.startedAt).getDay()] += s.focusSeconds;
  }
  return DAY_NAMES[totals.indexOf(Math.max(...totals))] + '요일';
}

export function getFirstSessionDate(sessions: Session[]): Date | null {
  if (sessions.length === 0) return null;
  const earliest = sessions.reduce((min, s) => (s.startedAt < min.startedAt ? s : min));
  return parseISO(earliest.startedAt);
}

export interface FocusTrendItem {
  label: string;
  [key: string]: number | string;
}

export interface FocusTrendMeta {
  data: FocusTrendItem[];
  categories: Array<{ name: string; color: string }>;
}

export interface CategoryFocusItem {
  name: string;
  minutes: number;
  percent: number;
  color: string;
}

function resolveCategory(
  session: Session,
  taskMap: Map<string, Task>,
  categoryMap: Map<string, Category>,
): { name: string; color: string } {
  if (session.taskId) {
    const task = taskMap.get(session.taskId);
    if (task) {
      const cat = categoryMap.get(task.categoryId);
      if (cat) return { name: cat.name, color: tailwindToHex(cat.color) };
    }
  }
  return { name: '미분류', color: '#6b7280' };
}

export function getFocusTrendData(
  sessions: Session[],
  tasks: Task[],
  categories: Category[],
  tab: TabType,
  today: Date = new Date(),
): FocusTrendMeta {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  let labels: string[];
  let getLabel: (session: Session) => string;

  if (tab === 'today') {
    labels = ['오늘'];
    getLabel = () => '오늘';
  } else if (tab === 'week') {
    labels = ['월', '화', '수', '목', '금', '토', '일'];
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    getLabel = (s) => {
      const d = parseISO(s.startedAt);
      const diff = Math.floor((d.getTime() - weekStart.getTime()) / 86400000);
      return labels[Math.max(0, Math.min(diff, 6))];
    };
  } else if (tab === 'month') {
    labels = ['1주차', '2주차', '3주차', '4주차'];
    const monthStart = startOfMonth(today);
    getLabel = (s) => {
      const d = parseISO(s.startedAt);
      const diffDays = Math.floor((d.getTime() - monthStart.getTime()) / 86400000);
      const weekIdx = Math.min(Math.floor(diffDays / 7), 3);
      return labels[weekIdx];
    };
  } else {
    if (sessions.length === 0) return { data: [], categories: [] };
    const yearSet = new Set(sessions.map((s) => format(parseISO(s.startedAt), 'yyyy')));
    labels = Array.from(yearSet).sort();
    getLabel = (s) => format(parseISO(s.startedAt), 'yyyy');
  }

  const dataMap = new Map<string, FocusTrendItem>(labels.map((l) => [l, { label: l }]));
  const catColorMap = new Map<string, string>();

  for (const session of sessions) {
    const label = getLabel(session);
    if (!dataMap.has(label)) continue;
    const item = dataMap.get(label)!;
    const { name, color } = resolveCategory(session, taskMap, categoryMap);
    const minutes = Math.round(session.focusSeconds / 60);
    item[name] = ((item[name] as number | undefined) ?? 0) + minutes;
    catColorMap.set(name, color);
  }

  const catTotals = new Map<string, number>();
  for (const item of dataMap.values()) {
    for (const [k, v] of Object.entries(item)) {
      if (k === 'label') continue;
      catTotals.set(k, (catTotals.get(k) ?? 0) + (v as number));
    }
  }
  const usedCategories = Array.from(catTotals.entries())
    .filter(([, total]) => total > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name]) => ({ name, color: catColorMap.get(name) ?? '#6b7280' }));

  return {
    data: labels.map((l) => dataMap.get(l)!),
    categories: usedCategories,
  };
}

export function getCategoryFocusData(
  sessions: Session[],
  tasks: Task[],
  categories: Category[],
): CategoryFocusItem[] {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const minuteMap = new Map<string, { minutes: number; color: string }>();

  for (const session of sessions) {
    const { name, color } = resolveCategory(session, taskMap, categoryMap);
    const minutes = Math.round(session.focusSeconds / 60);
    const existing = minuteMap.get(name);
    minuteMap.set(name, { minutes: (existing?.minutes ?? 0) + minutes, color });
  }

  const total = Array.from(minuteMap.values()).reduce((sum, { minutes }) => sum + minutes, 0);
  if (total === 0) return [];

  return Array.from(minuteMap.entries())
    .filter(([, { minutes }]) => minutes > 0)
    .sort(([, a], [, b]) => b.minutes - a.minutes)
    .map(([name, { minutes, color }]) => ({
      name,
      minutes,
      percent: Math.round((minutes / total) * 100),
      color,
    }));
}
