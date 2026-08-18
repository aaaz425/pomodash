export { TIMER_LIMITS, FOCUS_PERIOD_LIMITS, INPUT_LIMITS, SOUND_LIMITS } from '@pomodash/shared';

export const SESSION_LIMITS = {
  ABANDONED_CHECK_INTERVAL_MS: 30 * 1000,
  // 명시적 상한 없이 조회하면 Supabase 기본 행 상한(~1000)에서 조용히 잘릴 수 있음 —
  // 페이지네이션 UI가 없는 현재 구조에서 안전장치로 넉넉하게 설정 (하루 5세션 기준 약 2.7년치)
  FETCH_LIMIT: 5000,
} as const;

export { AUTH_LIMITS } from '@pomodash/shared';

export const STORAGE_VERSION = 1;
