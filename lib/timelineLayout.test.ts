import { describe, expect, it } from 'vitest';

import type { FocusPeriod, Session } from '@/types';
import { getDayTimelineBlocks } from './timelineLayout';

function makeSession(startedAt: string, focusPeriods: FocusPeriod[]): Session {
  return {
    id: startedAt,
    taskId: null,
    mode: 'pomodoro',
    startedAt,
    endedAt: startedAt,
    completedCycles: 1,
    totalCycles: 4,
    focusSeconds: 0,
    pausedSeconds: 0,
    focusPeriods,
    note: null,
    focusRating: null,
    distractionTags: [],
  };
}

const TARGET_DATE = new Date('2024-03-15T00:00:00');

describe('getDayTimelineBlocks', () => {
  it('세션이 없으면 빈 배열 반환', () => {
    expect(getDayTimelineBlocks([], TARGET_DATE)).toEqual([]);
  });

  it('특정 날짜의 focusPeriods만 블록으로 변환', () => {
    const session = makeSession('2024-03-15T09:00:00', [
      { start: '2024-03-15T09:00:00', end: '2024-03-15T09:30:00' },
    ]);
    const blocks = getDayTimelineBlocks([session], TARGET_DATE);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].sessionId).toBe(session.id);
    expect(blocks[0].startLabel).toBe('09:00');
    expect(blocks[0].endLabel).toBe('09:30');
    // 09:00 = 540분 / 1440분 * 100 = 37.5%
    expect(blocks[0].top).toBeCloseTo(37.5, 5);
  });

  it('다른 날짜 세션은 제외됨', () => {
    const session = makeSession('2024-03-16T09:00:00', [
      { start: '2024-03-16T09:00:00', end: '2024-03-16T09:30:00' },
    ]);
    expect(getDayTimelineBlocks([session], TARGET_DATE)).toEqual([]);
  });

  it('한 세션의 focusPeriods가 여러 개면 블록도 여러 개, 동일 sessionId를 가짐', () => {
    const session = makeSession('2024-03-15T09:00:00', [
      { start: '2024-03-15T09:00:00', end: '2024-03-15T09:20:00' },
      { start: '2024-03-15T10:00:00', end: '2024-03-15T10:20:00' },
    ]);
    const blocks = getDayTimelineBlocks([session], TARGET_DATE);
    expect(blocks).toHaveLength(2);
    expect(blocks.every((b) => b.sessionId === session.id)).toBe(true);
  });

  it('아주 짧은 구간도 최소 높이(2%) 이상으로 보장됨', () => {
    const session = makeSession('2024-03-15T09:00:00', [
      { start: '2024-03-15T09:00:00', end: '2024-03-15T09:01:00' },
    ]);
    const blocks = getDayTimelineBlocks([session], TARGET_DATE);
    expect(blocks[0].height).toBeGreaterThanOrEqual(2);
  });

  it('자정을 넘나드는 구간은 해당 날짜 범위로 잘려서 배치되지만 라벨은 실제 시각을 표시', () => {
    const session = makeSession('2024-03-15T23:50:00', [
      { start: '2024-03-15T23:50:00', end: '2024-03-16T00:15:00' },
    ]);
    const blocks = getDayTimelineBlocks([session], TARGET_DATE);
    expect(blocks).toHaveLength(1);
    // top + height가 100(자정)을 넘지 않아야 함
    expect(blocks[0].top + blocks[0].height).toBeLessThanOrEqual(100);
    expect(blocks[0].startLabel).toBe('23:50');
    expect(blocks[0].endLabel).toBe('00:15');
  });
});
