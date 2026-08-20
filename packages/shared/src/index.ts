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
  SOUND_LIMITS,
} from './constants/limits';
export { DEFAULT_TIMER_SETTINGS } from './constants/defaults';
export { MOTIVATIONAL_MESSAGES } from './constants/messages';
export type { SoundType, AppSettings } from './types/settings';
export { FOCUS_RATING_OPTIONS, FOCUS_RATING_LABELS } from './constants/focusRating';
export { DISTRACTION_TAGS } from './constants/distractionTags';
export type { DistractionTag } from './constants/distractionTags';
export { normalizeFocusPeriods, clampPeriodDuration } from './lib/focusPeriods';
export { isSessionStale } from './lib/sessionStale';
export { deriveTimerDisplay } from './lib/deriveTimerDisplay';
export type { DeriveTimerDisplayInput, TimerDisplayState } from './lib/deriveTimerDisplay';
export { deriveElapsedMinutes } from './lib/deriveElapsedMinutes';
export type { DeriveElapsedMinutesInput } from './lib/deriveElapsedMinutes';
export {
  formatDuration,
  formatSessionProgressLabel,
  toLocalDateKey,
  groupSessionsByDate,
  getSessionsForDate,
  getSessionOrdinalTitle,
  formatTimeRange,
  formatFullDate,
  formatFocusPeriodRanges,
  hasAbnormalFocusGap,
  formatSessionTimeSummary,
} from './lib/sessionFormat';
export type { SessionGroup } from './lib/sessionFormat';
export {
  getMonthlyActivityData,
  filterSessionsByTab,
  getTotalFocusSeconds,
  getHourlyFocusSeconds,
  getSessionCount,
  getAvgSessionSeconds,
  getStreakDays,
  getPrevDayStats,
  getPrevWeekStats,
  getPrevMonthStats,
  getMaxStreakDays,
  getBusiestDayOfWeek,
  getFirstSessionDate,
} from './lib/dashboard';
export type { DayActivity, TabType, PeriodStats } from './lib/dashboard';
export { BADGE_CATEGORY_LABELS, BADGE_DEFINITIONS, getEarnedBadgeIds } from './lib/badges';
export type {
  BadgeTier,
  BadgeIconKey,
  BadgeCategory,
  BadgeDefinition,
  SpecialEventId,
} from './lib/badges';
export { buildHeadline, buildShareCardData } from './lib/shareCard';
export type { ShareCardData } from './lib/shareCard';
export { createTimerStore } from './store/timerStore';
export type { TimerStore, TimerStoreApi, TimerSnapshot, TimerStorePorts } from './store/timerStore';
