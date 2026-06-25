import { describe, it, expect, beforeEach } from 'vitest';

import { createSettingsStore } from './settingsStore';
import { DEFAULT_TIMER_SETTINGS, STORAGE_KEYS } from '@/types';
import type { AppSettings } from '@/types';

beforeEach(() => {
  localStorage.clear();
});

function setMessages(store: ReturnType<typeof createSettingsStore>, messages: string[]) {
  store.setState({ motivationalMessages: messages });
}

describe('단순 setter (persist 포함)', () => {
  it('setNickname — nickname이 변경되고 localStorage에 저장됨', () => {
    const store = createSettingsStore();
    store.getState().setNickname('유진');
    expect(store.getState().nickname).toBe('유진');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) ?? '{}');
    expect(stored.nickname).toBe('유진');
  });

  it('setTimerDefaults — defaultTimerSettings가 변경되고 저장됨', () => {
    const store = createSettingsStore();
    const next = { focusMinutes: 50, shortBreakMinutes: 10, totalCycles: 3 };
    store.getState().setTimerDefaults(next);
    expect(store.getState().defaultTimerSettings).toEqual(next);
  });

  it('setBrowserNotification — 값이 변경되고 저장됨', () => {
    const store = createSettingsStore();
    store.getState().setBrowserNotification(true);
    expect(store.getState().browserNotification).toBe(true);
  });

  it('setSoundAlert — 값이 변경되고 저장됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundAlert(false);
    expect(store.getState().soundAlert).toBe(false);
  });

  it('setSoundType — 값이 변경되고 저장됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundType('bell');
    expect(store.getState().soundType).toBe('bell');
  });
});

describe('setSoundVolume', () => {
  it('0~100 사이 값은 그대로 반영됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundVolume(42);
    expect(store.getState().soundVolume).toBe(42);
  });

  it('100을 초과하면 100으로 clamp됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundVolume(150);
    expect(store.getState().soundVolume).toBe(100);
  });

  it('0 미만이면 0으로 clamp됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundVolume(-10);
    expect(store.getState().soundVolume).toBe(0);
  });

  it('정확히 0과 100은 clamp되지 않고 그대로 유지됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundVolume(0);
    expect(store.getState().soundVolume).toBe(0);
    store.getState().setSoundVolume(100);
    expect(store.getState().soundVolume).toBe(100);
  });

  it('소수는 정수로 반올림됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundVolume(50.6);
    expect(store.getState().soundVolume).toBe(51);
    store.getState().setSoundVolume(50.4);
    expect(store.getState().soundVolume).toBe(50);
  });

  it('반올림 후 clamp가 적용된 값이 저장됨', () => {
    const store = createSettingsStore();
    // 105.7 → round(105.7)=106 → clamp(106)=100
    store.getState().setSoundVolume(105.7);
    expect(store.getState().soundVolume).toBe(100);
  });
});

describe('setSoundRepeatCount', () => {
  it('1~5 사이 값은 그대로 반영됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundRepeatCount(3);
    expect(store.getState().soundRepeatCount).toBe(3);
  });

  it('5를 초과하면 5로 clamp됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundRepeatCount(9);
    expect(store.getState().soundRepeatCount).toBe(5);
  });

  it('1 미만(0 이하)이면 1로 clamp됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundRepeatCount(0);
    expect(store.getState().soundRepeatCount).toBe(1);
    store.getState().setSoundRepeatCount(-3);
    expect(store.getState().soundRepeatCount).toBe(1);
  });

  it('소수는 정수로 반올림됨', () => {
    const store = createSettingsStore();
    store.getState().setSoundRepeatCount(2.6);
    expect(store.getState().soundRepeatCount).toBe(3);
  });
});

describe('addMessage', () => {
  it('새 메시지가 목록 끝에 추가됨', () => {
    const store = createSettingsStore();
    setMessages(store, ['a', 'b']);
    store.getState().addMessage('c');
    expect(store.getState().motivationalMessages).toEqual(['a', 'b', 'c']);
  });

  it('메시지가 정확히 20개면 추가 시 아무 동작도 하지 않음 (상한)', () => {
    const store = createSettingsStore();
    setMessages(
      store,
      Array.from({ length: 20 }, (_, i) => `m${i}`),
    );
    store.getState().addMessage('m20');
    expect(store.getState().motivationalMessages).toHaveLength(20);
  });

  it('메시지가 19개일 때는 정상적으로 20개까지 추가 가능', () => {
    const store = createSettingsStore();
    setMessages(
      store,
      Array.from({ length: 19 }, (_, i) => `m${i}`),
    );
    store.getState().addMessage('m19');
    expect(store.getState().motivationalMessages).toHaveLength(20);
  });
});

describe('updateMessage', () => {
  it('해당 index의 메시지가 변경됨', () => {
    const store = createSettingsStore();
    setMessages(store, ['a', 'b', 'c']);
    store.getState().updateMessage(1, '바뀐 메시지');
    expect(store.getState().motivationalMessages[1]).toBe('바뀐 메시지');
  });

  it('변경할 메시지의 양 끝 공백이 trim됨', () => {
    const store = createSettingsStore();
    setMessages(store, ['a']);
    store.getState().updateMessage(0, '  공백 메시지  ');
    expect(store.getState().motivationalMessages[0]).toBe('공백 메시지');
  });

  it('빈 문자열로 변경 시도하면 아무 동작도 하지 않음', () => {
    const store = createSettingsStore();
    setMessages(store, ['a']);
    store.getState().updateMessage(0, '');
    expect(store.getState().motivationalMessages[0]).toBe('a');
  });

  it('공백만 있는 문자열로 변경 시도하면 아무 동작도 하지 않음', () => {
    const store = createSettingsStore();
    setMessages(store, ['a']);
    store.getState().updateMessage(0, '   ');
    expect(store.getState().motivationalMessages[0]).toBe('a');
  });

  it('index가 음수면 아무 동작도 하지 않음', () => {
    const store = createSettingsStore();
    setMessages(store, ['a', 'b']);
    store.getState().updateMessage(-1, '변경');
    expect(store.getState().motivationalMessages).toEqual(['a', 'b']);
  });

  it('index가 배열 길이 이상이면 아무 동작도 하지 않음', () => {
    const store = createSettingsStore();
    setMessages(store, ['a', 'b']);
    store.getState().updateMessage(2, '변경'); // length === 2, 범위 밖
    expect(store.getState().motivationalMessages).toEqual(['a', 'b']);
  });

  it('index가 배열의 마지막 유효 인덱스(length-1)면 정상적으로 변경됨', () => {
    const store = createSettingsStore();
    setMessages(store, ['a', 'b']);
    store.getState().updateMessage(1, '변경');
    expect(store.getState().motivationalMessages).toEqual(['a', '변경']);
  });
});

describe('deleteMessage', () => {
  it('해당 index의 메시지가 목록에서 제거됨', () => {
    const store = createSettingsStore();
    setMessages(store, ['a', 'b', 'c']);
    store.getState().deleteMessage(1);
    expect(store.getState().motivationalMessages).toEqual(['a', 'c']);
  });

  it('메시지가 1개만 남았으면 삭제 시도해도 아무 동작도 하지 않음 (최소 1개 유지)', () => {
    const store = createSettingsStore();
    setMessages(store, ['혼자 남은 메시지']);
    store.getState().deleteMessage(0);
    expect(store.getState().motivationalMessages).toEqual(['혼자 남은 메시지']);
  });

  it('메시지가 2개일 때는 정상적으로 1개로 삭제 가능', () => {
    const store = createSettingsStore();
    setMessages(store, ['a', 'b']);
    store.getState().deleteMessage(0);
    expect(store.getState().motivationalMessages).toEqual(['b']);
  });
});

describe('reorderMessages', () => {
  it('fromId/toId(문자열 인덱스)로 메시지 순서가 변경됨', () => {
    const store = createSettingsStore();
    setMessages(store, ['a', 'b', 'c']);
    store.getState().reorderMessages('0', '2');
    expect(store.getState().motivationalMessages).toEqual(['b', 'c', 'a']);
  });

  it('파싱 불가능한 id를 전달하면 arrayMove의 NaN 처리 동작을 따름 (현재 별도 가드 없음)', () => {
    const store = createSettingsStore();
    setMessages(store, ['a', 'b', 'c']);
    // parseInt('x') === NaN — reorderTasks/reorderCategories와 달리 이 함수는
    // invalid id에 대한 no-op 가드가 없어 arrayMove의 NaN 처리 결과를 그대로 반영한다.
    store.getState().reorderMessages('x', '1');
    expect(store.getState().motivationalMessages).toHaveLength(3);
  });
});

describe('hydrate', () => {
  it('localStorage에 유효한 설정이 있으면 그 값으로 복원됨', () => {
    const saved: AppSettings = {
      nickname: '저장된 이름',
      browserNotification: true,
      soundAlert: false,
      soundType: 'chime',
      soundVolume: 33,
      soundRepeatCount: 4,
      motivationalMessages: ['저장된 메시지'],
      defaultTimerSettings: DEFAULT_TIMER_SETTINGS,
    };
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(saved));

    const store = createSettingsStore();
    store.getState().hydrate();
    expect(store.getState().nickname).toBe('저장된 이름');
    expect(store.getState().soundType).toBe('chime');
    expect(store.getState().motivationalMessages).toEqual(['저장된 메시지']);
  });

  it('localStorage가 비어 있으면 기본 설정으로 복원됨', () => {
    const defaults = createSettingsStore().getState();
    const store = createSettingsStore();
    store.getState().hydrate();
    expect(store.getState().nickname).toBe(defaults.nickname);
    expect(store.getState().soundType).toBe(defaults.soundType);
    expect(store.getState().soundVolume).toBe(defaults.soundVolume);
    expect(store.getState().motivationalMessages).toEqual(defaults.motivationalMessages);
  });

  it('localStorage 데이터에 soundType 같은 신규 필드가 없으면 스키마 default로 채워짐', () => {
    // 구버전 localStorage 데이터를 시뮬레이션 — soundType/soundVolume/soundRepeatCount 누락
    const legacy = {
      nickname: '레거시 사용자',
      browserNotification: false,
      soundAlert: true,
      motivationalMessages: ['레거시 메시지'],
      defaultTimerSettings: DEFAULT_TIMER_SETTINGS,
    };
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(legacy));

    const store = createSettingsStore();
    store.getState().hydrate();
    expect(store.getState().nickname).toBe('레거시 사용자');
    expect(store.getState().soundType).toBe('sine');
    expect(store.getState().soundVolume).toBe(70);
    expect(store.getState().soundRepeatCount).toBe(2);
  });

  it('motivationalMessages가 빈 배열이면 스키마 검증 실패로 전체 fallback 적용', () => {
    const invalid = {
      nickname: '이 값은 사라짐',
      browserNotification: true,
      soundAlert: true,
      soundType: 'bell',
      soundVolume: 80,
      soundRepeatCount: 3,
      motivationalMessages: [], // .min(1) 위반
      defaultTimerSettings: DEFAULT_TIMER_SETTINGS,
    };
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(invalid));

    const defaults = createSettingsStore().getState();
    const store = createSettingsStore();
    store.getState().hydrate();
    expect(store.getState().nickname).toBe(defaults.nickname);
    expect(store.getState().motivationalMessages).toEqual(defaults.motivationalMessages);
  });
});
