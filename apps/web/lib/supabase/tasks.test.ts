import { describe, it, expect } from 'vitest';
import { toTask } from '@/lib/supabase/tasks';
import { INPUT_LIMITS } from '@/lib/constants/limits';

const validRow = {
  id: 't1',
  title: '알고리즘 문제 풀기',
  category_id: 'c1',
  created_at: '2026-01-01T00:00:00.000Z',
};

describe('toTask', () => {
  it('유효한 row를 camelCase Task로 변환함', () => {
    expect(toTask(validRow)).toEqual({
      id: 't1',
      title: '알고리즘 문제 풀기',
      categoryId: 'c1',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('title이 최대 길이를 넘으면 검증 실패로 null 반환', () => {
    expect(
      toTask({ ...validRow, title: 'a'.repeat(INPUT_LIMITS.TITLE_MAX_LENGTH + 1) }),
    ).toBeNull();
  });
});
