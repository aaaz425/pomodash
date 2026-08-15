import type { TimerMode, TimerPhase } from '../types/timer';
import { deriveElapsedMinutes } from './deriveElapsedMinutes';

export interface DeriveTimerDisplayInput {
  phase: TimerPhase;
  mode: TimerMode;
  remainingSeconds: number;
  startedAt: number | null;
  accFocusSeconds: number;
  cycleCount: number;
  focusMinutes: number;
  now: number; // 호출 측에서 Date.now()를 주입 — 순수 함수로 유지해 테스트 용이
}

export interface TimerDisplayState {
  displaySeconds: number;
  isRunning: boolean;
  justCompleted: boolean; // pomodoro 모드에서 remaining이 0에 도달한 tick 1회에서만 true
  elapsedMinutes: number;
}

export function deriveTimerDisplay(input: DeriveTimerDisplayInput): TimerDisplayState {
  const {
    phase,
    mode,
    remainingSeconds,
    startedAt,
    accFocusSeconds,
    cycleCount,
    focusMinutes,
    now,
  } = input;
  const isRunning = startedAt !== null;
  const elapsed = isRunning ? Math.floor((now - startedAt!) / 1000) : 0;

  let displaySeconds: number;
  let justCompleted = false;

  if (mode === 'free') {
    // free 모드: 카운트업, 자동 완료 없음
    displaySeconds = isRunning ? accFocusSeconds + elapsed : accFocusSeconds;
  } else {
    const runningRemaining = Math.max(0, remainingSeconds - elapsed);
    displaySeconds = isRunning ? runningRemaining : remainingSeconds;
    justCompleted = isRunning && runningRemaining === 0;
  }

  const elapsedMinutes = deriveElapsedMinutes({
    mode,
    displaySeconds,
    cycleCount,
    focusMinutes,
    phase,
  });

  return { displaySeconds, isRunning, justCompleted, elapsedMinutes };
}
