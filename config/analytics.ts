import posthog from 'posthog-js';

let initialized = false;

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key) return;
  posthog.init(key, { api_host: host ?? 'https://app.posthog.com', capture_pageview: false });
  initialized = true;
}

export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== 'production') return;
  posthog.capture(event, properties);
}

export const EVENTS = {
  TIMER_STARTED: 'timer_started',
  TIMER_COMPLETED: 'timer_completed',
  FOCUS_MODE_ENTERED: 'focus_mode_entered',
  TASK_CREATED: 'task_created',
  SESSION_NOTE_WRITTEN: 'session_note_written',
  DASHBOARD_VIEWED: 'dashboard_viewed',
  SHARE_CARD_OPENED: 'share_card_opened',
  SHARE_CARD_DOWNLOADED: 'share_card_downloaded',
  SHARE_CARD_SHARED: 'share_card_shared',
} as const;
