import type { TimerPhase } from '@/types/models';

// focus는 선택된 컬러 테마의 accent를 따라가도록 CSS 변수 참조 (NEUTRAL_HEX_COLOR와 동일 패턴)
export const PHASE_HEX_COLORS: Record<TimerPhase, string> = {
  focus: 'var(--primary)',
  'short-break': '#60a5fa',
};

export const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: '집중 중',
  'short-break': '휴식 중',
};

export const PHASE_BADGE_STYLES: Record<TimerPhase, { bg: string; dot: string; text: string }> = {
  focus: { bg: 'bg-primary/10', dot: 'bg-primary', text: 'text-primary' },
  'short-break': { bg: 'bg-[#60a5fa1a]', dot: 'bg-[#60a5fa]', text: 'text-[#60a5fa]' },
};

export const PHASE_GLOW: Record<TimerPhase, string> = {
  focus: 'bg-[radial-gradient(circle,_var(--primary-glow)_0%,_transparent_70%)]',
  'short-break': 'bg-[radial-gradient(circle,_#60a5fa30_0%,_transparent_70%)]',
};

// 대기/일시정지 상태 — CSS 변수라 다크/라이트 모드 자동 대응
export const NEUTRAL_HEX_COLOR = 'var(--muted-foreground)';
export const NEUTRAL_GLOW =
  'bg-[radial-gradient(circle,_var(--muted-foreground)_0%,_transparent_70%)] opacity-30';
