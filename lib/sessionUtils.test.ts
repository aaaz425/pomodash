import { describe, expect, it, vi } from 'vitest';

import type { Session } from '@/types';
import {
  formatDuration,
  formatFullDate,
  formatTimeRange,
  getSessionOrdinalTitle,
  groupSessionsByDate,
} from './sessionUtils';

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

describe('groupSessionsByDate', () => {
  it('세션이 없으면 빈 배열 반환', () => {
    expect(groupSessionsByDate([], TODAY)).toEqual([]);
  });

  it('같은 날짜의 세션은 하나의 그룹으로 묶임', () => {
    const sessions = [makeSession('2024-03-15T09:00:00'), makeSession('2024-03-15T14:00:00')];
    const groups = groupSessionsByDate(sessions, TODAY);
    expect(groups).toHaveLength(1);
    expect(groups[0].sessions).toHaveLength(2);
  });

  it('날짜 그룹은 최신 날짜부터 내림차순 정렬됨', () => {
    const sessions = [
      makeSession('2024-03-10T09:00:00'),
      makeSession('2024-03-15T09:00:00'),
      makeSession('2024-03-12T09:00:00'),
    ];
    const groups = groupSessionsByDate(sessions, TODAY);
    expect(groups.map((g) => g.dateKey)).toEqual(['2024-03-15', '2024-03-12', '2024-03-10']);
  });

  it('그룹 내 세션은 startedAt 기준 최신순으로 정렬됨', () => {
    const sessions = [makeSession('2024-03-15T09:00:00'), makeSession('2024-03-15T14:00:00')];
    const groups = groupSessionsByDate(sessions, TODAY);
    expect(groups[0].sessions.map((s) => s.startedAt)).toEqual([
      '2024-03-15T14:00:00',
      '2024-03-15T09:00:00',
    ]);
  });

  it('오늘 날짜 그룹의 displayLabel은 "오늘"', () => {
    const groups = groupSessionsByDate([makeSession('2024-03-15T09:00:00')], TODAY);
    expect(groups[0].displayLabel).toBe('오늘');
  });

  it('어제 날짜 그룹의 displayLabel은 "어제"', () => {
    const groups = groupSessionsByDate([makeSession('2024-03-14T09:00:00')], TODAY);
    expect(groups[0].displayLabel).toBe('어제');
  });

  it('오늘/어제가 아닌 날짜는 "M월 D일 (요일)" 형식으로 표시', () => {
    const groups = groupSessionsByDate([makeSession('2024-03-01T09:00:00')], TODAY);
    expect(groups[0].displayLabel).toBe('3월 1일 (금)');
  });

  it('각 그룹의 totalFocusSeconds는 해당 날짜 세션들의 focusSeconds 합', () => {
    const sessions = [
      makeSession('2024-03-15T09:00:00', 600),
      makeSession('2024-03-15T14:00:00', 900),
    ];
    const groups = groupSessionsByDate(sessions, TODAY);
    expect(groups[0].totalFocusSeconds).toBe(1500);
  });

  it('자정을 걸친 세션도 startedAt 기준 로컬 날짜로 그룹화됨', () => {
    const session = makeSession('2024-03-10T23:50:00', 1200); // endedAt은 다음날 00:10
    const groups = groupSessionsByDate([session], TODAY);
    expect(groups).toHaveLength(1);
    expect(groups[0].dateKey).toBe('2024-03-10');
  });

  it('ref를 생략하면 현재 시각 기준으로 오늘/어제를 판단', () => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY);
    const groups = groupSessionsByDate([makeSession('2024-03-15T09:00:00')]);
    expect(groups[0].displayLabel).toBe('오늘');
    vi.useRealTimers();
  });
});

describe('getSessionOrdinalTitle', () => {
  it('"M월 D일 N번째 세션" 형식으로 반환', () => {
    expect(getSessionOrdinalTitle('2024-03-15T09:00:00', 2)).toBe('3월 15일 3번째 세션');
  });

  it('chronologicalIndex는 0-based이므로 +1되어 표시됨', () => {
    expect(getSessionOrdinalTitle('2024-03-15T09:00:00', 0)).toBe('3월 15일 1번째 세션');
  });
});

describe('formatDuration', () => {
  it('60초 미만이면 "N초"로 표시', () => {
    expect(formatDuration(45)).toBe('45초');
  });

  it('정확히 0초면 "0초"로 표시', () => {
    expect(formatDuration(0)).toBe('0초');
  });

  it('정확히 60초면 "1분"으로 표시 (초 단위 아님)', () => {
    expect(formatDuration(60)).toBe('1분');
  });

  it('60분 미만이면 "N분"으로 표시', () => {
    expect(formatDuration(1500)).toBe('25분');
  });

  it('정확히 60분(3600초)이면 "1시간"으로 표시 (분 없이)', () => {
    expect(formatDuration(3600)).toBe('1시간');
  });

  it('시간과 분이 모두 있으면 "N시간 M분"으로 표시', () => {
    expect(formatDuration(5460)).toBe('1시간 31분');
  });

  it('여러 시간 단위도 정확히 표시 (예: 25시간)', () => {
    expect(formatDuration(25 * 3600)).toBe('25시간');
  });
});

describe('formatTimeRange', () => {
  it('"HH:mm — HH:mm" 형식(24시간제)으로 반환', () => {
    expect(formatTimeRange('2024-03-15T09:00:00', '2024-03-15T14:30:00')).toBe('09:00 — 14:30');
  });

  it('오전/오후 표시 없이 24시간제로 표시됨', () => {
    expect(formatTimeRange('2024-03-15T23:00:00', '2024-03-15T23:30:00')).toBe('23:00 — 23:30');
  });
});

describe('formatFullDate', () => {
  it('"YYYY년 M월 D일" 형식으로 반환', () => {
    expect(formatFullDate('2024-03-15T09:00:00')).toBe('2024년 3월 15일');
  });
});
