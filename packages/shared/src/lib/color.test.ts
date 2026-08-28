import { describe, expect, it } from 'vitest';

import { hexToHsv, hsvToHex } from './color';

describe('hexToHsv / hsvToHex', () => {
  it('원색 hex를 정확한 hsv로 변환한다', () => {
    expect(hexToHsv('#ff0000')).toEqual({ h: 0, s: 1, v: 1 });
    expect(hexToHsv('#00ff00')).toEqual({ h: 120, s: 1, v: 1 });
    expect(hexToHsv('#0000ff')).toEqual({ h: 240, s: 1, v: 1 });
  });

  it('무채색은 s=0', () => {
    expect(hexToHsv('#ffffff')).toEqual({ h: 0, s: 0, v: 1 });
    expect(hexToHsv('#000000')).toEqual({ h: 0, s: 0, v: 0 });
  });

  it('hsv를 hex로 되돌린다', () => {
    expect(hsvToHex(0, 1, 1)).toBe('#ff0000');
    expect(hsvToHex(120, 1, 1)).toBe('#00ff00');
    expect(hsvToHex(240, 1, 1)).toBe('#0000ff');
  });

  it('hex → hsv → hex 왕복이 원래 값과 같다', () => {
    for (const hex of ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#6b7280']) {
      const { h, s, v } = hexToHsv(hex);
      expect(hsvToHex(h, s, v)).toBe(hex);
    }
  });
});
