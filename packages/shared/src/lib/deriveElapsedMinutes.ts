import type { TimerMode, TimerPhase } from '../types/timer';

export interface DeriveElapsedMinutesInput {
  mode: TimerMode;
  displaySeconds: number;
  cycleCount: number;
  focusMinutes: number;
  phase: TimerPhase;
}

export function deriveElapsedMinutes(input: DeriveElapsedMinutesInput): number {
  const { mode, displaySeconds, cycleCount, focusMinutes, phase } = input;

  return mode === 'free'
    ? Math.floor(displaySeconds / 60)
    : cycleCount * focusMinutes +
        (phase === 'focus'
          ? Math.max(0, Math.floor((focusMinutes * 60 - displaySeconds) / 60))
          : 0);
}
