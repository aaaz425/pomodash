export function isSessionStale(
  params: { lastActiveAt: number | null; sessionStartedAt: number | null; thresholdMs: number },
  now = Date.now(),
): boolean {
  const reference = params.lastActiveAt ?? params.sessionStartedAt;
  if (reference === null) return false;
  return now - reference > params.thresholdMs;
}
