import { describe, expect, it, beforeEach } from 'vitest';

import { TaskSchema, STORAGE_KEYS } from '@/types';
import { initStorage, loadFromStorage, saveToStorage } from './storage';

// SSR guard(typeof window === 'undefined')는 vitest.config.ts가 environment: 'jsdom'으로
// 고정되어 있어 window가 항상 정의된 상태이므로 이 파일에서는 검증하지 않는다.

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
    targetFocusMinutes: 25,
    targetCycles: 4,
    targetBreakMinutes: 5,
    completed: false,
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
      targetFocusMinutes: 25,
      targetCycles: 4,
      targetBreakMinutes: 5,
      completed: false,
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

  it('스키마가 default 값을 채워주는 필드는 누락되어도 파싱 성공', () => {
    // TaskSchema의 targetFocusMinutes/targetCycles/targetBreakMinutes는 .default()가 있음
    const partial = {
      id: '1',
      title: 'A',
      categoryId: 'c1',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    localStorage.setItem('k', JSON.stringify(partial));
    const result = loadFromStorage('k', schema, fallback);
    expect(result).not.toBe(fallback);
    expect(result).toMatchObject({
      targetFocusMinutes: 25,
      targetCycles: 4,
      targetBreakMinutes: 5,
    });
  });
});

describe('initStorage', () => {
  it('버전이 일치하면 localStorage를 비우지 않음', () => {
    localStorage.setItem(STORAGE_KEYS.version, '1');
    localStorage.setItem('other', 'kept');
    initStorage();
    expect(localStorage.getItem('other')).toBe('kept');
  });

  it('버전이 다르면 localStorage 전체를 비우고 새 버전을 기록', () => {
    localStorage.setItem(STORAGE_KEYS.version, '0');
    localStorage.setItem('other', 'should-be-cleared');
    initStorage();
    expect(localStorage.getItem('other')).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.version)).toBe('1');
  });

  it('버전 키가 아예 없으면(첫 실행) localStorage를 비우고 버전을 기록', () => {
    localStorage.setItem('other', 'should-be-cleared');
    initStorage();
    expect(localStorage.getItem('other')).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.version)).toBe('1');
  });
});
