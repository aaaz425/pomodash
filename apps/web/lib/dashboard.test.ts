import { describe, expect, it } from 'vitest';

import type { FocusPeriod, Session } from '@/types';
import {
  filterSessionsByTab,
  getAvgSessionSeconds,
  getBusiestDayOfWeek,
  getFirstSessionDate,
  getHourlyFocusSeconds,
  getMaxStreakDays,
  getMonthlyActivityData,
  getPrevDayFocusSeconds,
  getPrevDaySessionCount,
  getPrevMonthSessionCount,
  getSessionCount,
  getStreakDays,
  getTotalFocusSeconds,
} from './dashboard';

function makeSession(startedAt: string, focusSeconds = 1500): Session {
  return {
    id: startedAt,
    taskId: null,
    mode: 'pomodoro',
    startedAt,
    endedAt: new Date(new Date(startedAt).getTime() + focusSeconds * 1000).toISOString(),
    completedCycles: 1,
    totalCycles: 4,
    focusSeconds,
    pausedSeconds: 0,
    focusPeriods: [],
    note: null,
    focusRating: null,
    distractionTags: [],
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

describe('getMonthlyActivityData', () => {
  const TODAY = new Date('2024-03-15T12:00:00');

  it('이달 날짜 수만큼 배열 반환', () => {
    const result = getMonthlyActivityData([], TODAY);
    expect(result).toHaveLength(31); // 3월은 31일
    expect(result[0].date).toBe('2024-03-01');
    expect(result[30].date).toBe('2024-03-31');
  });

  it('세션 있는 날 focusMinutes 집계', () => {
    const sessions = [
      makeSession('2024-03-15T09:00:00', 1800), // 30분
      makeSession('2024-03-15T14:00:00', 900), // 15분
      makeSession('2024-03-10T10:00:00', 3600), // 60분
    ];
    const result = getMonthlyActivityData(sessions, TODAY);
    const march15 = result.find((d) => d.date === '2024-03-15');
    const march10 = result.find((d) => d.date === '2024-03-10');
    expect(march15?.focusMinutes).toBe(45);
    expect(march10?.focusMinutes).toBe(60);
  });

  it('세션 없는 날 focusMinutes는 0', () => {
    const sessions = [makeSession('2024-03-15T09:00:00', 1800)];
    const result = getMonthlyActivityData(sessions, TODAY);
    const march01 = result.find((d) => d.date === '2024-03-01');
    expect(march01?.focusMinutes).toBe(0);
  });

  it('다른 달 세션은 집계 제외', () => {
    const sessions = [makeSession('2024-02-20T09:00:00', 3600)];
    const result = getMonthlyActivityData(sessions, TODAY);
    expect(result.every((d) => d.focusMinutes === 0)).toBe(true);
  });
});

describe('getMaxStreakDays', () => {
  it('세션 없으면 0', () => {
    expect(getMaxStreakDays([])).toBe(0);
  });

  it('하루만 있으면 1', () => {
    expect(getMaxStreakDays([makeSession('2024-03-15T10:00:00')])).toBe(1);
  });

  it('연속 3일 + 끊김 + 연속 5일 → 5 반환', () => {
    const sessions = [
      makeSession('2024-03-01T10:00:00'),
      makeSession('2024-03-02T10:00:00'),
      makeSession('2024-03-03T10:00:00'),
      // 공백
      makeSession('2024-03-10T10:00:00'),
      makeSession('2024-03-11T10:00:00'),
      makeSession('2024-03-12T10:00:00'),
      makeSession('2024-03-13T10:00:00'),
      makeSession('2024-03-14T10:00:00'),
    ];
    expect(getMaxStreakDays(sessions)).toBe(5);
  });

  it('오늘 세션 없어도 과거 최장 streak 반환', () => {
    const sessions = [
      makeSession('2024-03-01T10:00:00'),
      makeSession('2024-03-02T10:00:00'),
      makeSession('2024-03-03T10:00:00'),
    ];
    // today(3/15)에 세션 없음 → getStreakDays는 0, getMaxStreakDays는 3
    expect(getMaxStreakDays(sessions)).toBe(3);
  });

  it('같은 날 여러 세션은 1일로 계산', () => {
    const sessions = [makeSession('2024-03-15T09:00:00'), makeSession('2024-03-15T14:00:00')];
    expect(getMaxStreakDays(sessions)).toBe(1);
  });
});

describe('getBusiestDayOfWeek', () => {
  const TODAY = new Date('2024-03-15T12:00:00');

  it('세션 없으면 null', () => {
    expect(getBusiestDayOfWeek([], TODAY)).toBeNull();
  });

  it('이달 세션 없으면 null', () => {
    const sessions = [makeSession('2024-02-10T10:00:00', 3600)];
    expect(getBusiestDayOfWeek(sessions, TODAY)).toBeNull();
  });

  it('가장 집중 시간이 많은 요일 반환', () => {
    const sessions = [
      makeSession('2024-03-11T10:00:00', 3600), // 월요일
      makeSession('2024-03-11T14:00:00', 1800), // 월요일
      makeSession('2024-03-12T10:00:00', 1200), // 화요일
    ];
    expect(getBusiestDayOfWeek(sessions, TODAY)).toBe('월요일');
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

describe('getHourlyFocusSeconds', () => {
  function period(start: string, end: string): FocusPeriod {
    return { start, end };
  }

  function makeSessionWithPeriods(
    startedAt: string,
    focusSeconds: number,
    focusPeriods: FocusPeriod[],
  ): Session {
    return {
      ...makeSession(startedAt, focusSeconds),
      focusPeriods,
    };
  }

  it('한 시간 안에 들어오는 단일 구간은 해당 시간대에 전부 반영됨', () => {
    const sessions = [
      makeSessionWithPeriods('2024-03-15T09:00:00', 1800, [
        period('2024-03-15T09:10:00', '2024-03-15T09:40:00'),
      ]),
    ];
    const result = getHourlyFocusSeconds(sessions);
    expect(result[9]).toBe(1800);
    expect(result.reduce((a, b) => a + b, 0)).toBe(1800);
  });

  it('정확히 시 경계에서 시작해 시 경계에서 끝나는 구간은 다음 시간대로 새지 않음', () => {
    const sessions = [
      makeSessionWithPeriods('2024-03-15T09:00:00', 3600, [
        period('2024-03-15T09:00:00', '2024-03-15T10:00:00'),
      ]),
    ];
    const result = getHourlyFocusSeconds(sessions);
    expect(result[9]).toBe(3600);
    expect(result[10]).toBe(0);
  });

  it('시 경계를 걸치는 구간은 두 시간대로 정확히 분배됨', () => {
    const sessions = [
      makeSessionWithPeriods('2024-03-15T09:00:00', 1200, [
        period('2024-03-15T09:50:00', '2024-03-15T10:10:00'),
      ]),
    ];
    const result = getHourlyFocusSeconds(sessions);
    expect(result[9]).toBe(600);
    expect(result[10]).toBe(600);
  });

  it('여러 시간대에 걸친 구간은 걸친 만큼 각 시간대로 분배됨', () => {
    // 09:30~11:15 (105분, 120분 상한 이내) — 9/10/11시 세 시간대에 걸침
    const sessions = [
      makeSessionWithPeriods('2024-03-15T09:00:00', 6300, [
        period('2024-03-15T09:30:00', '2024-03-15T11:15:00'),
      ]),
    ];
    const result = getHourlyFocusSeconds(sessions);
    expect(result[9]).toBe(30 * 60);
    expect(result[10]).toBe(60 * 60);
    expect(result[11]).toBe(15 * 60);
  });

  it('한 세션에 구간이 여러 개면 각각 반영됨', () => {
    const sessions = [
      makeSessionWithPeriods('2024-03-15T09:00:00', 1200, [
        period('2024-03-15T09:00:00', '2024-03-15T09:10:00'),
        period('2024-03-15T14:00:00', '2024-03-15T14:10:00'),
      ]),
    ];
    const result = getHourlyFocusSeconds(sessions);
    expect(result[9]).toBe(600);
    expect(result[14]).toBe(600);
  });

  it('focusPeriods가 비어있으면 startedAt의 시간대에 focusSeconds 전체가 반영됨', () => {
    const sessions = [makeSessionWithPeriods('2024-03-15T09:00:00', 1500, [])];
    const result = getHourlyFocusSeconds(sessions);
    expect(result[9]).toBe(1500);
  });

  it('120분을 초과하는(오염된) 구간은 120분으로 잘려서 반영됨', () => {
    const sessions = [
      makeSessionWithPeriods('2024-03-15T09:00:00', 21600, [
        period('2024-03-15T09:00:00', '2024-03-15T15:00:00'),
      ]),
    ];
    const result = getHourlyFocusSeconds(sessions);
    const total = result.reduce((a, b) => a + b, 0);
    expect(total).toBe(120 * 60);
  });
});
