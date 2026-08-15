import { describe, expect, it } from 'vitest';
import { deriveElapsedMinutes } from './deriveElapsedMinutes';

describe('deriveElapsedMinutes', () => {
  it('focus phase에서 완료된 사이클 + 현재 phase 경과 분을 합산', () => {
    const result = deriveElapsedMinutes({
      mode: 'pomodoro',
      displaySeconds: 20 * 60, // 5분 경과
      cycleCount: 2,
      focusMinutes: 25,
      phase: 'focus',
    });

    expect(result).toBe(2 * 25 + 5);
  });

  it('short-break phase에서는 현재 phase 경과를 더하지 않음', () => {
    const result = deriveElapsedMinutes({
      mode: 'pomodoro',
      displaySeconds: 60,
      cycleCount: 1,
      focusMinutes: 25,
      phase: 'short-break',
    });

    expect(result).toBe(25);
  });

  it('free 모드는 displaySeconds를 분으로 환산', () => {
    const result = deriveElapsedMinutes({
      mode: 'free',
      displaySeconds: 185,
      cycleCount: 0,
      focusMinutes: 25,
      phase: 'focus',
    });

    expect(result).toBe(3);
  });
});
