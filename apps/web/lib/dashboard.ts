import { format, parseISO, startOfMonth, startOfWeek } from 'date-fns';

import type {
  Category,
  Session,
  Task,
  TabType,
  FocusTrendItem,
  FocusTrendMeta,
  CategoryFocusItem,
} from '@/types';
import { CATEGORY_HEX_COLORS } from '@/lib/constants/categoryColors';
import {
  getMonthlyActivityData,
  filterSessionsByTab,
  getTotalFocusSeconds,
  getHourlyFocusSeconds,
  getSessionCount,
  getAvgSessionSeconds,
  getStreakDays,
  getPrevDayFocusSeconds,
  getPrevDaySessionCount,
  getPrevWeekFocusSeconds,
  getPrevWeekSessionCount,
  getPrevMonthFocusSeconds,
  getPrevMonthSessionCount,
  getMaxStreakDays,
  getBusiestDayOfWeek,
  getFirstSessionDate,
} from '@pomodash/shared';

export {
  getMonthlyActivityData,
  filterSessionsByTab,
  getTotalFocusSeconds,
  getHourlyFocusSeconds,
  getSessionCount,
  getAvgSessionSeconds,
  getStreakDays,
  getPrevDayFocusSeconds,
  getPrevDaySessionCount,
  getPrevWeekFocusSeconds,
  getPrevWeekSessionCount,
  getPrevMonthFocusSeconds,
  getPrevMonthSessionCount,
  getMaxStreakDays,
  getBusiestDayOfWeek,
  getFirstSessionDate,
};

function tailwindToHex(colorClass: string): string {
  return CATEGORY_HEX_COLORS[colorClass as keyof typeof CATEGORY_HEX_COLORS] ?? '#6b7280';
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
