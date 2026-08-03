export type TimerPhase = 'focus' | 'short-break';

export type TimerMode = 'pomodoro' | 'free';

export interface FocusPeriod {
  start: string; // ISO 8601
  end: string; // ISO 8601
}

export interface RawFocusPeriod {
  start: number; // ms epoch
  end: number; // ms epoch
}

export interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  totalCycles: number;
}
