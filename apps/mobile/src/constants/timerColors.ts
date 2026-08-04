import type { TimerPhase } from '@pomodash/shared';

// 웹 apps/web/lib/constants/timerColors.ts + globals.css 테마 토큰과 값을 맞춘 것 —
// 웹은 Tailwind 클래스 기반이라 그대로 재사용 불가능해 hex로 하드코딩한다 (공유하지 않음).
export const PHASE_HEX: Record<TimerPhase, string> = {
  focus: '#10D9A0',
  'short-break': '#60A5FA',
};

export const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: '집중 중',
  'short-break': '휴식 중',
};

export const PHASE_BADGE: Record<TimerPhase, { bg: string; dot: string; text: string }> = {
  focus: { bg: 'rgba(16,217,160,0.102)', dot: '#10D9A0', text: '#10D9A0' },
  'short-break': { bg: 'rgba(96,165,250,0.102)', dot: '#60A5FA', text: '#60A5FA' },
};

// 글로우 중심 색상(각 phase 색의 alpha 18.8%) — 바깥으로 갈수록 transparent
export const PHASE_GLOW_RGBA: Record<TimerPhase, string> = {
  focus: 'rgba(16,217,160,0.188)',
  'short-break': 'rgba(96,165,250,0.188)',
};

export interface ThemeTokens {
  background: string;
  foreground: string;
  card: string;
  primary: string;
  primaryForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

// 웹의 Tailwind 알파 표기(예: bg-muted/60)에 대응 — hex를 rgba 문자열로 변환
export function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export const THEME: Record<'light' | 'dark', ThemeTokens> = {
  light: {
    background: '#FFFFFF',
    foreground: '#111111',
    card: '#F8F9FA',
    primary: '#10D9A0',
    primaryForeground: '#07090F',
    muted: '#EFEFEF',
    mutedForeground: '#374151',
    border: '#E5E7EB',
  },
  dark: {
    background: '#07090F',
    foreground: '#F0F4F8',
    card: '#0D1117',
    primary: '#10D9A0',
    primaryForeground: '#07090F',
    muted: '#1A2332',
    mutedForeground: '#94A3B8',
    border: '#1E2D3D',
  },
};
