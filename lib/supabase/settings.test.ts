import { describe, it, expect } from 'vitest';
import { toAppSettings } from '@/lib/supabase/settings';

const validRow = {
  nickname: '유진',
  browser_notification: true,
  sound_alert: false,
  sound_type: 'chime',
  sound_volume: 33,
  sound_repeat_count: 4,
  motivational_messages: ['메시지1'],
  default_focus_minutes: 50,
  default_short_break_minutes: 10,
  default_total_cycles: 3,
};

describe('toAppSettings', () => {
  it('유효한 row를 camelCase AppSettings로 변환함', () => {
    expect(toAppSettings(validRow)).toEqual({
      nickname: '유진',
      browserNotification: true,
      soundAlert: false,
      soundType: 'chime',
      soundVolume: 33,
      soundRepeatCount: 4,
      motivationalMessages: ['메시지1'],
      defaultTimerSettings: { focusMinutes: 50, shortBreakMinutes: 10, totalCycles: 3 },
    });
  });

  it('motivational_messages가 빈 배열이면(.min(1) 위반) 검증 실패로 null 반환', () => {
    expect(toAppSettings({ ...validRow, motivational_messages: [] })).toBeNull();
  });

  it('sound_type이 허용되지 않은 값이면 검증 실패로 null 반환', () => {
    expect(toAppSettings({ ...validRow, sound_type: 'invalid-type' })).toBeNull();
  });

  it('sound_volume이 범위(0-100)를 벗어나면 검증 실패로 null 반환', () => {
    expect(toAppSettings({ ...validRow, sound_volume: 150 })).toBeNull();
  });
});
