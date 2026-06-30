import { z } from 'zod';
import { STORAGE_KEYS } from '@/types';
import { STORAGE_VERSION } from '@/lib/constants/limits';

export function initStorage(): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(STORAGE_KEYS.version);
  if (Number(stored) !== STORAGE_VERSION) {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.version, String(STORAGE_VERSION));
  }
}

export function loadFromStorage<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return schema.parse(JSON.parse(raw));
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}
