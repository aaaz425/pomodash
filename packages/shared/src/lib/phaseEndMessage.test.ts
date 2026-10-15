import { describe, expect, it } from 'vitest';
import { getPhaseEndMessage } from './phaseEndMessage';

const base = { cycleCount: 0, totalCycles: 4, shortBreakMinutes: 5 };

describe('getPhaseEndMessage', () => {
  it('마지막 사이클의 집중이 끝나면 타이머 완료', () => {
    expect(getPhaseEndMessage({ ...base, phase: 'focus', cycleCount: 3 }).title).toBe(
      '타이머 완료!',
    );
  });

  it('휴식이 있으면 집중 시간 종료', () => {
    expect(getPhaseEndMessage({ ...base, phase: 'focus' }).title).toBe('집중 시간 종료!');
  });

  it('휴식이 0분이면 사이클 완료', () => {
    expect(getPhaseEndMessage({ ...base, phase: 'focus', shortBreakMinutes: 0 }).title).toBe(
      '사이클 완료!',
    );
  });

  it('휴식이 0분이어도 마지막 사이클이면 타이머 완료', () => {
    expect(
      getPhaseEndMessage({ ...base, phase: 'focus', cycleCount: 3, shortBreakMinutes: 0 }).title,
    ).toBe('타이머 완료!');
  });

  it('휴식이 끝나면 휴식 종료', () => {
    expect(getPhaseEndMessage({ ...base, phase: 'short-break' }).title).toBe('휴식 종료!');
  });
});
