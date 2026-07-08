import { describe, expect, it } from 'vitest';

import { isSessionStale } from './sessionStale';

const NOW = new Date('2024-01-01T12:00:00.000Z').getTime();
const THRESHOLD_MS = 25 * 60 * 1000;

describe('isSessionStale', () => {
  it('lastActiveAt이 임계값 이내면 false', () => {
    const lastActiveAt = NOW - THRESHOLD_MS + 1;
    expect(
      isSessionStale(
        { lastActiveAt, sessionStartedAt: lastActiveAt, thresholdMs: THRESHOLD_MS },
        NOW,
      ),
    ).toBe(false);
  });

  it('lastActiveAt이 정확히 임계값이면 false (경계값 — 초과부터 stale)', () => {
    const lastActiveAt = NOW - THRESHOLD_MS;
    expect(
      isSessionStale(
        { lastActiveAt, sessionStartedAt: lastActiveAt, thresholdMs: THRESHOLD_MS },
        NOW,
      ),
    ).toBe(false);
  });

  it('lastActiveAt이 임계값을 초과하면 true', () => {
    const lastActiveAt = NOW - THRESHOLD_MS - 1;
    expect(
      isSessionStale(
        { lastActiveAt, sessionStartedAt: lastActiveAt, thresholdMs: THRESHOLD_MS },
        NOW,
      ),
    ).toBe(true);
  });

  it('lastActiveAt이 null이면 sessionStartedAt으로 폴백', () => {
    const sessionStartedAt = NOW - THRESHOLD_MS - 1;
    expect(
      isSessionStale({ lastActiveAt: null, sessionStartedAt, thresholdMs: THRESHOLD_MS }, NOW),
    ).toBe(true);
  });

  it('lastActiveAt과 sessionStartedAt이 모두 null이면 false', () => {
    expect(
      isSessionStale(
        { lastActiveAt: null, sessionStartedAt: null, thresholdMs: THRESHOLD_MS },
        NOW,
      ),
    ).toBe(false);
  });

  it('임계값이 작을수록 더 짧은 방치도 stale로 판단', () => {
    const lastActiveAt = NOW - 6 * 60 * 1000; // 6분 전
    expect(
      isSessionStale(
        { lastActiveAt, sessionStartedAt: lastActiveAt, thresholdMs: 5 * 60 * 1000 },
        NOW,
      ),
    ).toBe(true);
  });
});
