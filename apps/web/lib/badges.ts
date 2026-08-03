import { parseISO } from 'date-fns';

import type { Session, Task } from '@/types';
import { BADGE_DEFINITIONS, type SpecialEventId } from '@/lib/constants/badges';
import { getMaxStreakDays, getTotalFocusSeconds } from '@/lib/dashboard';

function countUniqueCategories(sessions: Session[], tasks: Task[]): number {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const categoryIds = new Set<string>();
  for (const session of sessions) {
    if (!session.taskId) continue;
    const task = taskMap.get(session.taskId);
    if (task) categoryIds.add(task.categoryId);
  }
  return categoryIds.size;
}

const SPECIAL_EVENT_CHECKS: Record<SpecialEventId, (sessions: Session[]) => boolean> = {
  'first-session': (sessions) => sessions.length > 0,
  'night-owl': (sessions) =>
    sessions.some((s) => {
      const hour = parseISO(s.startedAt).getHours();
      return hour >= 0 && hour < 5;
    }),
  'weekend-warrior': (sessions) =>
    sessions.some((s) => {
      const day = parseISO(s.startedAt).getDay();
      return day === 0 || day === 6;
    }),
  'perfect-session': (sessions) =>
    sessions.some(
      (s) => s.mode === 'pomodoro' && s.totalCycles > 0 && s.completedCycles >= s.totalCycles,
    ),
  marathon: (sessions) => sessions.some((s) => s.focusSeconds >= 2 * 60 * 60),
};

export function getEarnedBadgeIds(sessions: Session[], tasks: Task[]): Set<string> {
  const maxStreakDays = getMaxStreakDays(sessions);
  const totalHours = getTotalFocusSeconds(sessions) / 3600;
  const categoryCount = countUniqueCategories(sessions, tasks);

  const earned = new Set<string>();
  for (const badge of BADGE_DEFINITIONS) {
    let isEarned = false;
    switch (badge.category) {
      case 'streak':
        isEarned = maxStreakDays >= badge.days;
        break;
      case 'total-time':
        isEarned = totalHours >= badge.hours;
        break;
      case 'diversity':
        isEarned = categoryCount >= badge.categoryCount;
        break;
      case 'special':
        isEarned = SPECIAL_EVENT_CHECKS[badge.eventId](sessions);
        break;
    }
    if (isEarned) earned.add(badge.id);
  }
  return earned;
}
