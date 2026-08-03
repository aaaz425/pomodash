import type { TimerPhase } from '@/types/models';

export const PHASE_HEX_COLORS: Record<TimerPhase, string> = {
  focus: '#10d9a0',
  'short-break': '#60a5fa',
};

export const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: '집중 중',
  'short-break': '휴식 중',
};

export const PHASE_BADGE_STYLES: Record<TimerPhase, { bg: string; dot: string; text: string }> = {
  focus: { bg: 'bg-[#10d9a01a]', dot: 'bg-[#10d9a0]', text: 'text-[#10d9a0]' },
  'short-break': { bg: 'bg-[#60a5fa1a]', dot: 'bg-[#60a5fa]', text: 'text-[#60a5fa]' },
};

export const PHASE_GLOW: Record<TimerPhase, string> = {
  focus: 'bg-[radial-gradient(circle,_#10d9a030_0%,_transparent_70%)]',
  'short-break': 'bg-[radial-gradient(circle,_#60a5fa30_0%,_transparent_70%)]',
};

// 대기/일시정지 상태 — CSS 변수라 다크/라이트 모드 자동 대응
export const NEUTRAL_HEX_COLOR = 'var(--muted-foreground)';
export const NEUTRAL_GLOW =
  'bg-[radial-gradient(circle,_var(--muted-foreground)_0%,_transparent_70%)] opacity-30';
