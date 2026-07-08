import { SESSION_LIMITS } from '@/lib/constants/limits';

export function isSessionStale(
  params: { lastActiveAt: number | null; sessionStartedAt: number | null },
  now = Date.now(),
): boolean {
  const reference = params.lastActiveAt ?? params.sessionStartedAt;
  if (reference === null) return false;
  return now - reference > SESSION_LIMITS.STALE_THRESHOLD_MS;
}
