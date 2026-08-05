export type {
  TimerPhase,
  TimerMode,
  TimerSettings,
  FocusPeriod,
  RawFocusPeriod,
} from './types/timer';
export type { FocusRating } from './types/session';
export {
  TIMER_LIMITS,
  FOCUS_PERIOD_LIMITS,
  CATEGORY_LIMITS,
  AUTH_LIMITS,
  INPUT_LIMITS,
} from './constants/limits';
export { DEFAULT_TIMER_SETTINGS } from './constants/defaults';
export { FOCUS_RATING_OPTIONS, FOCUS_RATING_LABELS } from './constants/focusRating';
export { DISTRACTION_TAGS } from './constants/distractionTags';
export type { DistractionTag } from './constants/distractionTags';
export { normalizeFocusPeriods, clampPeriodDuration } from './lib/focusPeriods';
export { isSessionStale } from './lib/sessionStale';
export { deriveTimerDisplay } from './lib/deriveTimerDisplay';
export type { DeriveTimerDisplayInput, TimerDisplayState } from './lib/deriveTimerDisplay';
export { formatDuration, formatSessionProgressLabel } from './lib/sessionFormat';
export { createTimerStore } from './store/timerStore';
export type { TimerStore, TimerStoreApi, TimerSnapshot, TimerStorePorts } from './store/timerStore';
