import { describe, expect, it } from 'vitest';

import { isSessionStale } from './sessionStale';

const NOW = new Date('2024-01-01T12:00:00.000Z').getTime();
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

describe('isSessionStale', () => {
  it('lastActiveAt이 3시간 이내면 false', () => {
    const lastActiveAt = NOW - THREE_HOURS_MS + 1;
    expect(isSessionStale({ lastActiveAt, sessionStartedAt: lastActiveAt }, NOW)).toBe(false);
  });

  it('lastActiveAt이 정확히 3시간이면 false (경계값 — 초과부터 stale)', () => {
    const lastActiveAt = NOW - THREE_HOURS_MS;
    expect(isSessionStale({ lastActiveAt, sessionStartedAt: lastActiveAt }, NOW)).toBe(false);
  });

  it('lastActiveAt이 3시간을 초과하면 true', () => {
    const lastActiveAt = NOW - THREE_HOURS_MS - 1;
    expect(isSessionStale({ lastActiveAt, sessionStartedAt: lastActiveAt }, NOW)).toBe(true);
  });

  it('lastActiveAt이 null이면 sessionStartedAt으로 폴백', () => {
    const sessionStartedAt = NOW - THREE_HOURS_MS - 1;
    expect(isSessionStale({ lastActiveAt: null, sessionStartedAt }, NOW)).toBe(true);
  });

  it('lastActiveAt과 sessionStartedAt이 모두 null이면 false', () => {
    expect(isSessionStale({ lastActiveAt: null, sessionStartedAt: null }, NOW)).toBe(false);
  });
});
