export type {
  TimerPhase,
  TimerMode,
  TimerSettings,
  FocusPeriod,
  RawFocusPeriod,
} from './types/timer';
export {
  TIMER_LIMITS,
  FOCUS_PERIOD_LIMITS,
  CATEGORY_LIMITS,
  AUTH_LIMITS,
} from './constants/limits';
export { DEFAULT_TIMER_SETTINGS } from './constants/defaults';
export { normalizeFocusPeriods, clampPeriodDuration } from './lib/focusPeriods';
export { isSessionStale } from './lib/sessionStale';
export { deriveTimerDisplay } from './lib/deriveTimerDisplay';
export type { DeriveTimerDisplayInput, TimerDisplayState } from './lib/deriveTimerDisplay';
export { createTimerStore } from './store/timerStore';
export type { TimerStore, TimerStoreApi, TimerSnapshot, TimerStorePorts } from './store/timerStore';
