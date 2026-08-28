import { describe, it, expect } from 'vitest';
import { toCategory } from '@/lib/supabase/categories';

const validRow = { id: 'c1', name: '공부', color: '#3b82f6' };

describe('toCategory', () => {
  it('유효한 row를 Category로 변환함', () => {
    expect(toCategory(validRow)).toEqual(validRow);
  });

  it('color가 hex 형식이 아니면 검증 실패로 null 반환', () => {
    expect(toCategory({ ...validRow, color: 'bg-blue-500' })).toBeNull();
  });
});
