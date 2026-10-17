import { describe, expect, it, beforeEach } from 'vitest';

import { TaskSchema } from '@/types';
import { loadFromStorage, saveToStorage } from './storage';

// vitest.config.ts가 environment: 'jsdom' 고정이라 SSR guard는 이 파일에서 검증하지 않는다

beforeEach(() => {
  localStorage.clear();
});

describe('saveToStorage', () => {
  it('값을 JSON 문자열로 직렬화하여 저장', () => {
    saveToStorage('k', { a: 1 });
    expect(localStorage.getItem('k')).toBe(JSON.stringify({ a: 1 }));
  });

  it('배열도 정상적으로 저장됨', () => {
    saveToStorage('k', [1, 2, 3]);
    expect(localStorage.getItem('k')).toBe(JSON.stringify([1, 2, 3]));
  });
});

describe('loadFromStorage', () => {
  const schema = TaskSchema;
  const fallback = {
    id: 'fallback',
    title: 'fallback',
    categoryId: 'c1',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  it('저장된 값이 없으면 fallback 반환', () => {
    expect(loadFromStorage('missing', schema, fallback)).toBe(fallback);
  });

  it('저장된 값이 스키마와 일치하면 파싱된 값 반환', () => {
    const task = {
      id: '1',
      title: 'A',
      categoryId: 'c1',
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    localStorage.setItem('k', JSON.stringify(task));
    expect(loadFromStorage('k', schema, fallback)).toEqual(task);
  });

  it('저장된 값이 빈 문자열이면 fallback 반환', () => {
    localStorage.setItem('k', '');
    expect(loadFromStorage('k', schema, fallback)).toBe(fallback);
  });

  it('JSON 파싱에 실패하면 fallback 반환', () => {
    localStorage.setItem('k', 'not json{');
    expect(loadFromStorage('k', schema, fallback)).toBe(fallback);
  });

  it('JSON은 유효하지만 스키마 검증에 실패하면 fallback 반환', () => {
    localStorage.setItem('k', JSON.stringify({ wrong: 'shape' }));
    expect(loadFromStorage('k', schema, fallback)).toBe(fallback);
  });
});
