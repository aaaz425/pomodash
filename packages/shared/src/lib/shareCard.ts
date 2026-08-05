import { format } from 'date-fns';
import type { TabType } from './dashboard';
import { getSessionCount, getStreakDays, getTotalFocusSeconds } from './dashboard';
import { formatDuration } from './sessionFormat';
import type { FocusPeriod } from '../types/timer';

export interface ShareCardData {
  periodLabel: string;
  headline: string;
  totalFocusLabel: string; // formatDuration() 결과, 0이면 '0분'
  sessionCount: number;
  streakDays: number; // allSessions 기준 — 탭 필터와 무관
  generatedAtLabel: string; // 'yyyy.MM.dd'
}

type ShareCardSessionLike = {
  startedAt: string;
  focusSeconds: number;
  focusPeriods: FocusPeriod[];
};

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

export function buildShareCardData<T extends ShareCardSessionLike>(
  filteredSessions: T[],
  allSessions: T[],
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
