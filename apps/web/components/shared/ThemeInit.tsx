'use client';

import { useTheme } from '@/hooks/useTheme';

// useTheme 모듈 최상단의 FOUC 방지 로직 + 시스템 테마 변경 리스너가
// 설정 페이지를 거치지 않아도 모든 라우트에서 실행되도록 전역에 마운트한다.
export function ThemeInit() {
  useTheme();
  return null;
}
