'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { z } from 'zod';
import {
  COLOR_THEME_KEYS,
  COLOR_THEMES,
  DEFAULT_COLOR_THEME,
  type ColorThemeKey,
} from '@pomodash/shared';
import { STORAGE_KEYS } from '@/types';
import { getStoredMode, resolveIsDark, useTheme } from '@/hooks/useTheme';

const ColorThemeSchema = z.enum(COLOR_THEME_KEYS);

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((cb) => cb());
}

function getStoredColorTheme(): ColorThemeKey {
  if (typeof window === 'undefined') return DEFAULT_COLOR_THEME;
  const result = ColorThemeSchema.safeParse(localStorage.getItem(STORAGE_KEYS.colorTheme));
  return result.success ? result.data : DEFAULT_COLOR_THEME;
}

function applyAccent(key: ColorThemeKey, isDark: boolean): void {
  if (typeof window === 'undefined') return;
  const pair = isDark ? COLOR_THEMES[key].accent.dark : COLOR_THEMES[key].accent.light;
  const root = document.documentElement.style;
  root.setProperty('--primary', pair.color);
  root.setProperty('--primary-foreground', pair.foreground);
  root.setProperty('--ring', pair.color);
  root.setProperty('--sidebar-primary', pair.color);
  root.setProperty('--sidebar-primary-foreground', pair.foreground);
  root.setProperty('--sidebar-ring', pair.color);
}

// 다른 훅과 마찬가지로 모듈 로드 시 즉시 적용해 FOUC를 줄인다.
if (typeof window !== 'undefined') {
  applyAccent(getStoredColorTheme(), resolveIsDark(getStoredMode()));
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAccentTheme() {
  const colorTheme = useSyncExternalStore(
    subscribe,
    getStoredColorTheme,
    () => DEFAULT_COLOR_THEME,
  );
  const { isDark } = useTheme();

  // 다크/라이트 전환은 useTheme이 처리하지만, 그때도 accent를 다시 주입해야 한다
  // (인라인 스타일이 .dark 캐스케이드보다 우선순위가 높아 재적용 없이는 이전 모드 값이 남는다).
  useEffect(() => {
    applyAccent(colorTheme, isDark);
  }, [colorTheme, isDark]);

  function setColorTheme(next: ColorThemeKey): void {
    localStorage.setItem(STORAGE_KEYS.colorTheme, next);
    applyAccent(next, isDark);
    notify();
  }

  return { colorTheme, setColorTheme, isDark };
}
