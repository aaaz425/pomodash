export { TIMER_LIMITS, FOCUS_PERIOD_LIMITS, INPUT_LIMITS, SOUND_LIMITS } from '@pomodash/shared';

export const SESSION_LIMITS = {
  ABANDONED_CHECK_INTERVAL_MS: 30 * 1000,
  JOURNAL_PAGE_SIZE: 30,
} as const;

export { AUTH_LIMITS } from '@pomodash/shared';

export const STORAGE_VERSION = 1;
