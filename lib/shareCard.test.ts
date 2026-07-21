import { describe, expect, it } from 'vitest';

import type { Session } from '@/types';
import { buildHeadline, buildShareCardData } from './shareCard';

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

describe('buildHeadline', () => {
  it('집중 기록이 없으면 안내 문구', () => {
    expect(buildHeadline(0, 0)).toBe('아직 집중 기록이 없어요');
  });

  it('스트릭 0인데 이번 기간엔 집중했으면 시작 문구', () => {
    expect(buildHeadline(0, 1500)).toBe('집중을 시작했어요');
  });

  it('스트릭 1~2일이면 오늘도 집중 문구', () => {
    expect(buildHeadline(1, 1500)).toBe('오늘도 집중했어요');
    expect(buildHeadline(2, 1500)).toBe('오늘도 집중했어요');
  });

  it('스트릭 3~6일이면 꾸준함 문구', () => {
    expect(buildHeadline(3, 1500)).toBe('꾸준함이 쌓이고 있어요 ✨');
    expect(buildHeadline(6, 1500)).toBe('꾸준함이 쌓이고 있어요 ✨');
  });

  it('스트릭 7일 이상이면 불꽃 문구', () => {
    expect(buildHeadline(7, 1500)).toBe('일주일 넘게 이어가는 중이에요 🔥');
  });
});

describe('buildShareCardData', () => {
  it('세션이 없으면 0/기본값 반환', () => {
    const data = buildShareCardData([], [], 'today', TODAY);
    expect(data.totalFocusLabel).toBe('0분');
    expect(data.sessionCount).toBe(0);
    expect(data.streakDays).toBe(0);
    expect(data.headline).toBe('아직 집중 기록이 없어요');
  });

  it('탭별 periodLabel 매핑', () => {
    expect(buildShareCardData([], [], 'today', TODAY).periodLabel).toBe('오늘');
    expect(buildShareCardData([], [], 'week', TODAY).periodLabel).toBe('이번 주');
    expect(buildShareCardData([], [], 'month', TODAY).periodLabel).toBe('이번 달');
    expect(buildShareCardData([], [], 'all', TODAY).periodLabel).toBe('전체');
  });

  it('streakDays는 filteredSessions가 아닌 allSessions 기준', () => {
    const allSessions = [
      makeSession('2024-03-13T09:00:00'),
      makeSession('2024-03-14T09:00:00'),
      makeSession('2024-03-15T09:00:00'),
    ];
    const data = buildShareCardData([], allSessions, 'today', TODAY);
    expect(data.streakDays).toBe(3);
    expect(data.sessionCount).toBe(0); // filteredSessions는 빈 배열
  });

  it('generatedAtLabel은 yyyy.MM.dd 형식', () => {
    const data = buildShareCardData([], [], 'today', TODAY);
    expect(data.generatedAtLabel).toBe('2024.03.15');
  });
});
