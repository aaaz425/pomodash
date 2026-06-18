'use client';

import { useSyncExternalStore } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'theme';
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((cb) => cb());
}

function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'dark' || v === 'light' || v === 'system') return v;
  return 'system';
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (typeof window === 'undefined') return true;
  if (mode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches;
  return mode === 'dark';
}

function applyTheme(dark: boolean): void {
  if (typeof window === 'undefined') return;
  if (dark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

// 모듈 로드 시 초기 테마 적용 (FOUC 방지) + 시스템 설정 변경 감지
if (typeof window !== 'undefined') {
  applyTheme(resolveIsDark(getStoredMode()));

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (getStoredMode() === 'system') {
      applyTheme(e.matches);
      notify();
    }
  });
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTheme() {
  const mode = useSyncExternalStore(subscribe, getStoredMode, () => 'dark' as ThemeMode);

  const isDark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains('dark'),
    () => true,
  );

  function setTheme(newMode: ThemeMode): void {
    localStorage.setItem(STORAGE_KEY, newMode);
    applyTheme(resolveIsDark(newMode));
    notify();
  }

  function toggle(): void {
    setTheme(isDark ? 'light' : 'dark');
  }

  return { isDark, mode, setTheme, toggle };
}
