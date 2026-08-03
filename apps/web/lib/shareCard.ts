import { format } from 'date-fns';

import type { Session, ShareCardData, TabType } from '@/types';
import { getSessionCount, getStreakDays, getTotalFocusSeconds } from '@/lib/dashboard';
import { formatDuration } from '@/lib/sessionUtils';

const PERIOD_LABELS: Record<TabType, string> = {
  today: '오늘',
  week: '이번 주',
  month: '이번 달',
  all: '전체',
};

export function buildHeadline(streakDays: number, totalFocusSeconds: number): string {
  if (totalFocusSeconds === 0) return '아직 집중 기록이 없어요';
  if (streakDays >= 7) return '일주일 넘게 이어가는 중이에요 🔥';
  if (streakDays >= 3) return '꾸준함이 쌓이고 있어요 ✨';
  if (streakDays >= 1) return '오늘도 집중했어요';
  return '집중을 시작했어요';
}

export function buildShareCardData(
  filteredSessions: Session[],
  allSessions: Session[],
  tab: TabType,
  today: Date = new Date(),
): ShareCardData {
  const totalFocusSeconds = getTotalFocusSeconds(filteredSessions);
  const streakDays = getStreakDays(allSessions, today);

  return {
    periodLabel: PERIOD_LABELS[tab],
    headline: buildHeadline(streakDays, totalFocusSeconds),
    totalFocusLabel: totalFocusSeconds === 0 ? '0분' : formatDuration(totalFocusSeconds),
    sessionCount: getSessionCount(filteredSessions),
    streakDays,
    generatedAtLabel: format(today, 'yyyy.MM.dd'),
  };
}
