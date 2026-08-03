import { describe, expect, it } from 'vitest';

import type { Session, Task } from '@/types';
import { getEarnedBadgeIds } from './badges';

function makeSession(overrides: Partial<Session> & { startedAt: string }): Session {
  const focusSeconds = overrides.focusSeconds ?? 1500;
  return {
    id: overrides.startedAt,
    taskId: null,
    mode: 'pomodoro',
    endedAt: new Date(new Date(overrides.startedAt).getTime() + focusSeconds * 1000).toISOString(),
    completedCycles: 1,
    totalCycles: 4,
    focusSeconds,
    pausedSeconds: 0,
    focusPeriods: [],
    note: null,
    focusRating: null,
    distractionTags: [],
    ...overrides,
  };
}

function makeTask(id: string, categoryId: string): Task {
  return {
    id,
    title: id,
    categoryId,
    targetFocusMinutes: 25,
    targetCycles: 4,
    targetBreakMinutes: 5,
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
  };
}

describe('getEarnedBadgeIds', () => {
  it('세션이 없으면 아무 뱃지도 없음', () => {
    expect(getEarnedBadgeIds([], [])).toEqual(new Set());
  });

  it('세션이 하나라도 있으면 첫 발걸음 뱃지 획득', () => {
    const sessions = [makeSession({ startedAt: '2024-03-15T09:00:00' })];
    expect(getEarnedBadgeIds(sessions, []).has('first-session')).toBe(true);
  });

  it('최장 연속 기록 기준으로 스트릭 뱃지 판정', () => {
    const sessions = [
      makeSession({ startedAt: '2024-03-13T09:00:00' }),
      makeSession({ startedAt: '2024-03-14T09:00:00' }),
      makeSession({ startedAt: '2024-03-15T09:00:00' }),
    ];
    const earned = getEarnedBadgeIds(sessions, []);
    expect(earned.has('streak-3')).toBe(true);
    expect(earned.has('streak-7')).toBe(false);
  });

  it('누적 집중 시간 기준으로 total-time 뱃지 판정', () => {
    const sessions = [makeSession({ startedAt: '2024-03-15T09:00:00', focusSeconds: 3600 })];
    const earned = getEarnedBadgeIds(sessions, []);
    expect(earned.has('total-time-1h')).toBe(true);
    expect(earned.has('total-time-10h')).toBe(false);
  });

  it('세션에서 실제 사용된 카테고리 수만 다양성으로 집계', () => {
    const tasks = [makeTask('t1', 'study'), makeTask('t2', 'work'), makeTask('t3', 'study')];
    const sessions = [
      makeSession({ startedAt: '2024-03-15T09:00:00', taskId: 't1' }),
      makeSession({ startedAt: '2024-03-15T10:00:00', taskId: 't2' }),
      makeSession({ startedAt: '2024-03-15T11:00:00', taskId: 't3' }), // t3도 study라 다양성엔 미포함
    ];
    const earned = getEarnedBadgeIds(sessions, tasks);
    expect(earned.has('diversity-2')).toBe(true);
    expect(earned.has('diversity-3')).toBe(false);
  });

  it('새벽 시간대 세션이 있으면 올빼미 뱃지 획득', () => {
    const sessions = [makeSession({ startedAt: '2024-03-15T03:00:00' })];
    expect(getEarnedBadgeIds(sessions, []).has('night-owl')).toBe(true);
  });

  it('주말 세션이 있으면 주말 전사 뱃지 획득', () => {
    const sessions = [makeSession({ startedAt: '2024-03-16T10:00:00' })]; // 토요일
    expect(getEarnedBadgeIds(sessions, []).has('weekend-warrior')).toBe(true);
  });

  it('사이클을 모두 완료한 세션이 있으면 완주 뱃지 획득', () => {
    const sessions = [
      makeSession({
        startedAt: '2024-03-15T09:00:00',
        completedCycles: 4,
        totalCycles: 4,
      }),
    ];
    expect(getEarnedBadgeIds(sessions, []).has('perfect-session')).toBe(true);
  });

  it('free 모드 세션은 완주 뱃지 대상에서 제외', () => {
    const sessions = [
      makeSession({
        startedAt: '2024-03-15T09:00:00',
        mode: 'free',
        completedCycles: 0,
        totalCycles: 0,
      }),
    ];
    expect(getEarnedBadgeIds(sessions, []).has('perfect-session')).toBe(false);
  });

  it('한 세션에서 2시간 이상 집중하면 마라토너 뱃지 획득', () => {
    const sessions = [makeSession({ startedAt: '2024-03-15T09:00:00', focusSeconds: 7200 })];
    expect(getEarnedBadgeIds(sessions, []).has('marathon')).toBe(true);
  });
});
