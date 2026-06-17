import { describe, expect, it } from 'vitest';

import type { Session } from '@/types';
import {
  filterSessionsByTab,
  getAvgSessionSeconds,
  getFirstSessionDate,
  getPrevDayFocusSeconds,
  getPrevDaySessionCount,
  getPrevMonthSessionCount,
  getRecentSessions,
  getSessionCount,
  getStreakDays,
  getTotalFocusSeconds,
} from './dashboard';

function makeSession(startedAt: string, focusSeconds = 1500): Session {
  return {
    id: startedAt,
    taskId: null,
    startedAt,
    endedAt: new Date(new Date(startedAt).getTime() + focusSeconds * 1000).toISOString(),
    completedCycles: 1,
    totalCycles: 4,
    focusSeconds,
    pausedSeconds: 0,
    focusPeriods: [],
    note: null,
  };
}

const TODAY = new Date('2024-03-15T12:00:00');

describe('filterSessionsByTab', () => {
  const sessions = [
    makeSession('2024-03-15T09:00:00'), // today (Fri)
    makeSession('2024-03-15T14:00:00'), // today (Fri)
    makeSession('2024-03-12T10:00:00'), // this week (Tue)
    makeSession('2024-03-10T10:00:00'), // last Sun — 이번 주 월요일(11일) 이전이므로 제외
    makeSession('2024-03-01T10:00:00'), // this month
    makeSession('2024-02-20T10:00:00'), // last month
  ];

  it('오늘 세션만 반환', () => {
    const result = filterSessionsByTab(sessions, 'today', TODAY);
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.startedAt.startsWith('2024-03-15'))).toBe(true);
  });

  it('이번 주 세션 반환 (월요일 시작)', () => {
    const result = filterSessionsByTab(sessions, 'week', TODAY);
    // 2024-03-11(Mon)~2024-03-17(Sun) → 15일 2개 + 12일 1개
    expect(result).toHaveLength(3);
  });

  it('이번 달 세션 반환', () => {
    const result = filterSessionsByTab(sessions, 'month', TODAY);
    // 3월 세션: 15일 2개 + 12일 1개 + 10일 1개 + 1일 1개
    expect(result).toHaveLength(5);
  });

  it('세션 없을 때 빈 배열 반환', () => {
    expect(filterSessionsByTab([], 'today', TODAY)).toHaveLength(0);
  });

  it('all 탭은 전체 반환', () => {
    expect(filterSessionsByTab(sessions, 'all', TODAY)).toHaveLength(sessions.length);
  });
});

describe('getStreakDays', () => {
  it('연속 3일', () => {
    const sessions = [
      makeSession('2024-03-15T10:00:00'),
      makeSession('2024-03-14T10:00:00'),
      makeSession('2024-03-13T10:00:00'),
      makeSession('2024-03-10T10:00:00'), // 3일 공백 — streak 끊김
    ];
    expect(getStreakDays(sessions, TODAY)).toBe(3);
  });

  it('오늘 세션 없으면 streak 0', () => {
    const sessions = [makeSession('2024-03-14T10:00:00'), makeSession('2024-03-13T10:00:00')];
    expect(getStreakDays(sessions, TODAY)).toBe(0);
  });

  it('세션 없으면 0', () => {
    expect(getStreakDays([], TODAY)).toBe(0);
  });

  it('오늘만 있으면 streak 1', () => {
    expect(getStreakDays([makeSession('2024-03-15T10:00:00')], TODAY)).toBe(1);
  });
});

describe('집계 함수', () => {
  const sessions = [
    makeSession('2024-03-15T09:00:00', 1800),
    makeSession('2024-03-15T14:00:00', 900),
  ];

  it('getTotalFocusSeconds', () => {
    expect(getTotalFocusSeconds(sessions)).toBe(2700);
  });

  it('getSessionCount', () => {
    expect(getSessionCount(sessions)).toBe(2);
  });

  it('getAvgSessionSeconds', () => {
    expect(getAvgSessionSeconds(sessions)).toBe(1350);
  });

  it('getAvgSessionSeconds — 빈 배열이면 0', () => {
    expect(getAvgSessionSeconds([])).toBe(0);
  });
});

describe('getRecentSessions', () => {
  const sessions = [
    makeSession('2024-03-13T10:00:00'),
    makeSession('2024-03-15T10:00:00'),
    makeSession('2024-03-14T10:00:00'),
    makeSession('2024-03-12T10:00:00'),
  ];

  it('최신순 N개 반환', () => {
    const result = getRecentSessions(sessions, 3);
    expect(result).toHaveLength(3);
    expect(result[0].startedAt).toBe('2024-03-15T10:00:00');
    expect(result[1].startedAt).toBe('2024-03-14T10:00:00');
  });
});

describe('이전 기간 비교 함수', () => {
  const sessions = [
    makeSession('2024-03-15T10:00:00', 1800), // 오늘
    makeSession('2024-03-14T10:00:00', 900), // 어제
    makeSession('2024-03-14T15:00:00', 600), // 어제
    makeSession('2024-02-10T10:00:00', 1500), // 전월
  ];

  it('getPrevDayFocusSeconds — 어제 집중 초 합산', () => {
    expect(getPrevDayFocusSeconds(sessions, TODAY)).toBe(1500); // 900 + 600
  });

  it('getPrevDaySessionCount — 어제 세션 수', () => {
    expect(getPrevDaySessionCount(sessions, TODAY)).toBe(2);
  });

  it('getPrevMonthSessionCount — 전월 세션 수', () => {
    expect(getPrevMonthSessionCount(sessions, TODAY)).toBe(1);
  });

  it('getPrevDayFocusSeconds — 어제 세션 없으면 0', () => {
    expect(getPrevDayFocusSeconds([], TODAY)).toBe(0);
  });
});

describe('getFirstSessionDate', () => {
  it('가장 오래된 세션 날짜 반환', () => {
    const sessions = [
      makeSession('2024-03-15T10:00:00'),
      makeSession('2024-01-05T10:00:00'),
      makeSession('2024-03-01T10:00:00'),
    ];
    const result = getFirstSessionDate(sessions);
    expect(result?.toISOString().startsWith('2024-01-05')).toBe(true);
  });

  it('세션 없으면 null', () => {
    expect(getFirstSessionDate([])).toBeNull();
  });
});
