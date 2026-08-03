import { describe, it, expect } from 'vitest';
import { toTask } from '@/lib/supabase/tasks';

const validRow = {
  id: 't1',
  title: '알고리즘 문제 풀기',
  category_id: 'c1',
  target_focus_minutes: 25,
  target_cycles: 4,
  target_break_minutes: 5,
  completed: false,
  created_at: '2026-01-01T00:00:00.000Z',
};

describe('toTask', () => {
  it('유효한 row를 camelCase Task로 변환함', () => {
    expect(toTask(validRow)).toEqual({
      id: 't1',
      title: '알고리즘 문제 풀기',
      categoryId: 'c1',
      targetFocusMinutes: 25,
      targetCycles: 4,
      targetBreakMinutes: 5,
      completed: false,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('targetFocusMinutes가 범위(5-120)를 벗어나면 검증 실패로 null 반환', () => {
    expect(toTask({ ...validRow, target_focus_minutes: 200 })).toBeNull();
  });

  it('targetCycles가 범위(1-10)를 벗어나면 검증 실패로 null 반환', () => {
    expect(toTask({ ...validRow, target_cycles: 0 })).toBeNull();
  });
});
