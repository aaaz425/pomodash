import type { TimerPhase } from '@/types';

// TimerRing(메인 타이머 링)과 MiniTimerWidget(미니 타이머)이 공유하는 phase별 색상.
export const PHASE_HEX_COLORS: Record<TimerPhase, string> = {
  focus: '#10d9a0',
  'short-break': '#60a5fa',
};
