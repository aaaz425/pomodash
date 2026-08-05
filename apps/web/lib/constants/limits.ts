export { TIMER_LIMITS, FOCUS_PERIOD_LIMITS, INPUT_LIMITS } from '@pomodash/shared';

export const SOUND_LIMITS = {
  VOLUME_MIN: 0,
  VOLUME_MAX: 100,
  REPEAT_MIN: 1,
  REPEAT_MAX: 5,
} as const;

export const SESSION_LIMITS = {
  ABANDONED_CHECK_INTERVAL_MS: 30 * 1000,
} as const;

export { AUTH_LIMITS } from '@pomodash/shared';

export const STORAGE_VERSION = 1;
