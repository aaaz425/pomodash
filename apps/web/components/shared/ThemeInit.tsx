'use client';

import { useTheme } from '@/hooks/useTheme';
import { useAccentTheme } from '@/hooks/useAccentTheme';

// FOUC 방지 로직 + 시스템 테마 변경 리스너가 모든 라우트에서 실행되도록 전역에 마운트
export function ThemeInit() {
  useTheme();
  useAccentTheme();
  return null;
}
