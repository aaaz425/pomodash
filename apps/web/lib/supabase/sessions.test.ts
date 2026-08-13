import { describe, it, expect } from 'vitest';
import { toSession } from '@/lib/supabase/sessions';

const validRow = {
  id: 's1',
  task_id: 't1',
  title: null,
  mode: 'pomodoro',
  started_at: '2026-01-01T09:00:00.000Z',
  ended_at: '2026-01-01T09:30:00.000Z',
  completed_cycles: 1,
  total_cycles: 4,
  focus_seconds: 1500,
  paused_seconds: 0,
  focus_periods: [{ start: '2026-01-01T09:00:00.000Z', end: '2026-01-01T09:25:00.000Z' }],
  note: '집중 잘됨',
  focus_rating: 3,
  distraction_tags: ['phone'],
};

describe('toSession', () => {
  it('유효한 row를 camelCase Session으로 변환함', () => {
    expect(toSession(validRow)).toEqual({
      id: 's1',
      taskId: 't1',
      title: null,
      mode: 'pomodoro',
      startedAt: '2026-01-01T09:00:00.000Z',
      endedAt: '2026-01-01T09:30:00.000Z',
      completedCycles: 1,
      totalCycles: 4,
      focusSeconds: 1500,
      pausedSeconds: 0,
      focusPeriods: [{ start: '2026-01-01T09:00:00.000Z', end: '2026-01-01T09:25:00.000Z' }],
      note: '집중 잘됨',
      focusRating: 3,
      distractionTags: ['phone'],
    });
  });

  it('taskId가 null(미분류 세션)이어도 정상 변환됨', () => {
    expect(toSession({ ...validRow, task_id: null })?.taskId).toBeNull();
  });

  it('focus_rating이 허용 범위(1-3) 밖이면 검증 실패로 null 반환', () => {
    expect(toSession({ ...validRow, focus_rating: 5 })).toBeNull();
  });

  it('mode가 pomodoro/free가 아니면 검증 실패로 null 반환', () => {
    expect(toSession({ ...validRow, mode: 'invalid' })).toBeNull();
  });

  it('title이 설정돼 있으면 그대로 왕복됨', () => {
    expect(toSession({ ...validRow, title: '알고리즘 스터디' })?.title).toBe('알고리즘 스터디');
  });
});
