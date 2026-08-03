import { describe, it, expect } from 'vitest';
import { toCategory } from '@/lib/supabase/categories';

const validRow = { id: 'c1', name: '공부', color: 'bg-blue-500' };

describe('toCategory', () => {
  it('유효한 row를 Category로 변환함', () => {
    expect(toCategory(validRow)).toEqual({ id: 'c1', name: '공부', color: 'bg-blue-500' });
  });

  it('color가 bg- 접두사가 아니면 검증 실패로 null 반환', () => {
    expect(toCategory({ ...validRow, color: 'blue-500' })).toBeNull();
  });
});
