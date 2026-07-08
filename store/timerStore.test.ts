import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTimerStore } from '@/store/timerStore';
import { STORAGE_KEYS } from '@/types';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
});

describe('timerStore', () => {
  it('start() — startedAt이 숫자로 설정됨', () => {
    const store = createTimerStore();
    store.getState().start();
    expect(typeof store.getState().startedAt).toBe('number');
  });

  it('pause() — startedAt이 null, remainingSeconds가 elapsed만큼 감소', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const store = createTimerStore();
    store.getState().start();

    vi.setSystemTime(new Date('2024-01-01T00:00:10.000Z'));
    store.getState().pause();

    expect(store.getState().startedAt).toBe(null);
    expect(store.getState().remainingSeconds).toBe(25 * 60 - 10);
  });

  it('reset() — remainingSeconds가 현재 phase 기본값으로 복원', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const store = createTimerStore();
    store.getState().start();
    vi.setSystemTime(new Date('2024-01-01T00:00:10.000Z'));
    store.getState().pause();
    store.getState().reset();

    expect(store.getState().remainingSeconds).toBe(25 * 60);
    expect(store.getState().startedAt).toBe(null);
  });

  it('completeCycle() — cycleCount +1, short-break로 전환', () => {
    const store = createTimerStore();
    store.getState().completeCycle();

    expect(store.getState().cycleCount).toBe(1);
    expect(store.getState().phase).toBe('short-break');
    // 자동 연속 전환 — short-break가 멈춰있지 않고 바로 시작됨
    expect(typeof store.getState().startedAt).toBe('number');
  });

  it('completeCycle() — totalCycles(4)회 완료 후 sessionEnded가 true로 설정', () => {
    const store = createTimerStore();
    for (let i = 0; i < 4; i++) store.getState().completeCycle();

    expect(store.getState().cycleCount).toBe(4);
    expect(store.getState().sessionEnded).toBe(true);
  });

  it('complete() — focus 종료 시 completeCycle로 위임되어 short-break로 전환', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const store = createTimerStore();
    store.getState().start();

    vi.setSystemTime(new Date('2024-01-01T00:25:00.000Z'));
    store.getState().complete();

    // 자동 연속 전환 — short-break가 멈춰있지 않고 현재 시각으로 바로 시작됨
    expect(store.getState().startedAt).toBe(new Date('2024-01-01T00:25:00.000Z').getTime());
    expect(store.getState().phase).toBe('short-break');
    expect(store.getState().cycleCount).toBe(1);
    expect(store.getState().remainingSeconds).toBe(5 * 60);
  });

  it('complete() — short-break 종료 시 focus로 전환되고 cycleCount는 유지', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const store = createTimerStore();
    store.getState().completeCycle(); // focus 1회 완료 → short-break 진입
    store.getState().start();

    vi.setSystemTime(new Date('2024-01-01T00:05:00.000Z'));
    store.getState().complete();

    // 자동 연속 전환 — focus가 멈춰있지 않고 현재 시각으로 바로 시작됨
    expect(store.getState().startedAt).toBe(new Date('2024-01-01T00:05:00.000Z').getTime());
    expect(store.getState().phase).toBe('focus');
    expect(store.getState().cycleCount).toBe(1);
    expect(store.getState().remainingSeconds).toBe(25 * 60);
  });

  it('complete() — startedAt이 null(정지 상태)이면 아무 동작도 하지 않음', () => {
    const store = createTimerStore();
    const before = store.getState();

    store.getState().complete();

    expect(store.getState().phase).toBe(before.phase);
    expect(store.getState().cycleCount).toBe(before.cycleCount);
  });

  it('complete() — 마지막 사이클의 focus 종료 시 sessionEnded가 true로 설정', () => {
    const store = createTimerStore();
    for (let i = 0; i < 3; i++) store.getState().completeCycle();
    store.getState().setPhase('focus'); // 3번째 short-break 종료 → 4번째 focus 진입

    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    store.getState().start();
    vi.setSystemTime(new Date('2024-01-01T00:25:00.000Z'));
    store.getState().complete();

    expect(store.getState().cycleCount).toBe(4);
    expect(store.getState().sessionEnded).toBe(true);
  });

  it('updateSettings() — settings 반영 및 현재 phase remainingSeconds 재계산', () => {
    const store = createTimerStore();
    store.getState().updateSettings({ focusMinutes: 30 });

    expect(store.getState().settings.focusMinutes).toBe(30);
    expect(store.getState().remainingSeconds).toBe(30 * 60);
  });

  describe('applyActiveTaskTimeUpdate()', () => {
    it('일시정지 중 focusMinutes 증가 시 remainingSeconds가 증가분만큼 늘어남 (경과 시간 보존)', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      vi.setSystemTime(new Date('2024-01-01T00:10:00.000Z')); // 10분 경과
      store.getState().pause();
      expect(store.getState().remainingSeconds).toBe(25 * 60 - 10 * 60);

      store.getState().applyActiveTaskTimeUpdate({ focusMinutes: 30 }); // 25 → 30분

      expect(store.getState().settings.focusMinutes).toBe(30);
      expect(store.getState().remainingSeconds).toBe(30 * 60 - 10 * 60);
    });

    it('focusMinutes 감소로 남은 시간이 음수가 되면 0으로 clamp', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      vi.setSystemTime(new Date('2024-01-01T00:20:00.000Z')); // 20분 경과
      store.getState().pause();

      store.getState().applyActiveTaskTimeUpdate({ focusMinutes: 10 }); // 이미 20분 지남

      expect(store.getState().remainingSeconds).toBe(0);
    });

    it('현재 phase(focus)와 무관한 필드(shortBreakMinutes) 변경은 remainingSeconds에 영향 없음', () => {
      const store = createTimerStore();
      store.getState().pause(); // 시작도 안 했지만 remainingSeconds는 기본값 유지

      store.getState().applyActiveTaskTimeUpdate({ shortBreakMinutes: 20 });

      expect(store.getState().settings.shortBreakMinutes).toBe(20);
      expect(store.getState().remainingSeconds).toBe(25 * 60);
    });

    it('totalCycles 변경은 settings에만 반영되고 remainingSeconds는 변하지 않음', () => {
      const store = createTimerStore();

      store.getState().applyActiveTaskTimeUpdate({ totalCycles: 2 });

      expect(store.getState().settings.totalCycles).toBe(2);
      expect(store.getState().remainingSeconds).toBe(25 * 60);
    });

    it('실행 중(startedAt이 null이 아님)이면 아무 동작도 하지 않음', () => {
      const store = createTimerStore();
      store.getState().start();

      store.getState().applyActiveTaskTimeUpdate({ focusMinutes: 50 });

      expect(store.getState().settings.focusMinutes).toBe(25);
      expect(store.getState().remainingSeconds).toBe(25 * 60);
    });

    it('short-break phase 중에는 focusMinutes 변경이 remainingSeconds에 영향 없고 shortBreakMinutes만 영향', () => {
      const store = createTimerStore();
      store.getState().completeCycle(); // focus 완료 → short-break, remainingSeconds = 5*60
      store.getState().pause();

      store.getState().applyActiveTaskTimeUpdate({ focusMinutes: 50, shortBreakMinutes: 8 });

      expect(store.getState().remainingSeconds).toBe(8 * 60);
    });
  });

  describe('focus mode', () => {
    it('enterFocusMode() — isFocusMode가 true로 설정됨', () => {
      const store = createTimerStore();
      store.getState().enterFocusMode();
      expect(store.getState().isFocusMode).toBe(true);
    });

    it('exitFocusMode() — isFocusMode만 false로 설정되고 타이머 상태는 유지됨', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      store.getState().enterFocusMode();

      store.getState().exitFocusMode();

      expect(store.getState().isFocusMode).toBe(false);
      expect(store.getState().startedAt).not.toBe(null);
    });

    it('endSession() — isFocusMode도 함께 false로 닫힘', () => {
      const store = createTimerStore();
      store.getState().enterFocusMode();

      store.getState().endSession();

      expect(store.getState().isFocusMode).toBe(false);
      expect(store.getState().sessionEnded).toBe(true);
    });

    it('completeCycle() — 마지막 사이클 완료 시 isFocusMode도 함께 false로 닫힘', () => {
      const store = createTimerStore();
      store.getState().enterFocusMode();
      for (let i = 0; i < 4; i++) store.getState().completeCycle();

      expect(store.getState().isFocusMode).toBe(false);
      expect(store.getState().sessionEnded).toBe(true);
    });
  });

  describe('sessionStarted', () => {
    it('start() — sessionStarted가 true로 설정됨', () => {
      const store = createTimerStore();
      store.getState().start();
      expect(store.getState().sessionStarted).toBe(true);
    });

    it('dismissSessionRecord() — sessionStarted가 false로 초기화됨', () => {
      const store = createTimerStore();
      store.getState().start();
      store.getState().endSession();

      store.getState().dismissSessionRecord();

      expect(store.getState().sessionStarted).toBe(false);
    });
  });

  describe('시간 추적 (sessionStartedAt / accFocusSeconds)', () => {
    it('start() — sessionStartedAt이 첫 호출 시각으로 설정됨', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      expect(store.getState().sessionStartedAt).toBe(
        new Date('2024-01-01T00:00:00.000Z').getTime(),
      );
    });

    it('start() — 재개 시 sessionStartedAt을 덮어쓰지 않음', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      const first = store.getState().sessionStartedAt;

      vi.setSystemTime(new Date('2024-01-01T00:05:00.000Z'));
      store.getState().pause();
      store.getState().start();

      expect(store.getState().sessionStartedAt).toBe(first);
    });

    it('pause() — focus 중 accFocusSeconds에 경과 시간 누적', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();

      vi.setSystemTime(new Date('2024-01-01T00:05:00.000Z'));
      store.getState().pause();

      expect(store.getState().accFocusSeconds).toBe(300);
    });

    it('pause() — short-break 중에는 accFocusSeconds 변경 없음', () => {
      const store = createTimerStore();
      store.getState().completeCycle(); // → short-break

      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      store.getState().start();
      vi.setSystemTime(new Date('2024-01-01T00:05:00.000Z'));
      store.getState().pause();

      expect(store.getState().accFocusSeconds).toBe(0);
    });

    it('completeCycle() — focus 경과 시간이 accFocusSeconds에 누적됨', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      vi.setSystemTime(new Date('2024-01-01T00:25:00.000Z'));
      store.getState().completeCycle();

      expect(store.getState().accFocusSeconds).toBe(1500);
    });

    it('completeCycle() — 탭 방치로 목표 시간을 초과해도 accFocusSeconds는 목표 시간만큼만 증가', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      vi.setSystemTime(new Date('2024-01-01T03:00:00.000Z')); // 3시간 방치 (목표는 25분)
      store.getState().completeCycle();

      expect(store.getState().accFocusSeconds).toBe(25 * 60);
    });

    it('completeCycle() — 방치 시 rawFocusPeriods의 end도 목표 시간만큼만 캡됨', () => {
      const startedAt = new Date('2024-01-01T00:00:00.000Z').getTime();
      vi.setSystemTime(startedAt);
      const store = createTimerStore();
      store.getState().start();
      vi.setSystemTime(new Date('2024-01-01T03:00:00.000Z'));
      store.getState().completeCycle();

      expect(store.getState().rawFocusPeriods).toEqual([
        { start: startedAt, end: startedAt + 25 * 60 * 1000 },
      ]);
    });

    it('completeCycle() — 마지막 사이클 완료 시 sessionEndedAt 기록', () => {
      vi.setSystemTime(new Date('2024-01-01T01:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      for (let i = 0; i < 4; i++) store.getState().completeCycle();

      expect(store.getState().sessionEndedAt).toBe(new Date('2024-01-01T01:00:00.000Z').getTime());
    });

    it('endSession() — focus 진행 중 종료 시 경과 시간 accFocusSeconds에 추가', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      vi.setSystemTime(new Date('2024-01-01T00:10:00.000Z'));
      store.getState().endSession();

      expect(store.getState().accFocusSeconds).toBe(600);
      expect(store.getState().sessionEndedAt).toBe(new Date('2024-01-01T00:10:00.000Z').getTime());
    });

    it('endSession() — 탭 방치로 목표 시간을 초과해도 accFocusSeconds는 목표 시간만큼만 증가', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      vi.setSystemTime(new Date('2024-01-01T03:00:00.000Z')); // 3시간 방치 (목표는 25분)
      store.getState().endSession();

      expect(store.getState().accFocusSeconds).toBe(25 * 60);
    });

    it('dismissSessionRecord() — 시간 추적 필드 초기화', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const store = createTimerStore();
      store.getState().start();
      vi.setSystemTime(new Date('2024-01-01T00:10:00.000Z'));
      store.getState().endSession();
      store.getState().dismissSessionRecord();

      expect(store.getState().sessionStartedAt).toBe(null);
      expect(store.getState().sessionEndedAt).toBe(null);
      expect(store.getState().accFocusSeconds).toBe(0);
    });
  });

  describe('초기값 및 설정 복원', () => {
    it('생성 시점에는 localStorage 값과 무관하게 항상 기본값으로 시작함', () => {
      localStorage.setItem(
        'pomodash:timer-settings',
        JSON.stringify({ focusMinutes: 5, shortBreakMinutes: 1, totalCycles: 2 }),
      );

      const store = createTimerStore();

      expect(store.getState().settings.focusMinutes).toBe(25);
      expect(store.getState().remainingSeconds).toBe(25 * 60);
    });

    it('setCurrentTask(null) — 설정이 기본값으로 복원되고 remainingSeconds도 재계산됨', () => {
      const store = createTimerStore();
      store.getState().updateSettings({ focusMinutes: 45, shortBreakMinutes: 10, totalCycles: 2 });

      store.getState().setCurrentTask(null);

      expect(store.getState().settings.focusMinutes).toBe(25);
      expect(store.getState().settings.shortBreakMinutes).toBe(5);
      expect(store.getState().settings.totalCycles).toBe(4);
      expect(store.getState().remainingSeconds).toBe(25 * 60);
    });

    it('dismissSessionRecord() — 설정이 기본값으로 복원됨', () => {
      const store = createTimerStore();
      store.getState().updateSettings({ focusMinutes: 45, totalCycles: 2 });
      store.getState().start();
      store.getState().endSession();

      store.getState().dismissSessionRecord();

      expect(store.getState().settings.focusMinutes).toBe(25);
      expect(store.getState().remainingSeconds).toBe(25 * 60);
      expect(store.getState().currentTaskId).toBe(null);
    });
  });

  describe('hydrate() — 방치된 세션 감지', () => {
    function savedActiveTimer(overrides: Record<string, unknown>) {
      return {
        phase: 'focus',
        remainingSeconds: 25 * 60,
        startedAt: null,
        cycleCount: 0,
        currentTaskId: null,
        settings: { focusMinutes: 25, shortBreakMinutes: 5, totalCycles: 4 },
        sessionEnded: false,
        sessionStarted: true,
        sessionStartedAt: new Date('2024-01-01T00:00:00.000Z').getTime(),
        sessionEndedAt: null,
        accFocusSeconds: 0,
        rawFocusPeriods: [],
        ...overrides,
      };
    }

    it('lastActiveAt이 3시간을 초과하면 showAbandonedPrompt가 true로 설정됨', () => {
      const lastActiveAt = new Date('2024-01-01T00:00:00.000Z').getTime();
      localStorage.setItem(
        STORAGE_KEYS.activeTimer,
        JSON.stringify(savedActiveTimer({ lastActiveAt })),
      );
      vi.setSystemTime(new Date('2024-01-01T03:00:01.000Z')); // 3시간 1초 경과

      const store = createTimerStore();
      store.getState().hydrate();

      expect(store.getState().showAbandonedPrompt).toBe(true);
    });

    it('lastActiveAt이 3시간 이내면 showAbandonedPrompt는 false', () => {
      const lastActiveAt = new Date('2024-01-01T00:00:00.000Z').getTime();
      localStorage.setItem(
        STORAGE_KEYS.activeTimer,
        JSON.stringify(savedActiveTimer({ lastActiveAt })),
      );
      vi.setSystemTime(new Date('2024-01-01T02:00:00.000Z')); // 2시간 경과

      const store = createTimerStore();
      store.getState().hydrate();

      expect(store.getState().showAbandonedPrompt).toBe(false);
    });

    it('진행 중인 세션이 없으면(sessionStarted: false) 오래됐어도 showAbandonedPrompt는 false', () => {
      const lastActiveAt = new Date('2024-01-01T00:00:00.000Z').getTime();
      localStorage.setItem(
        STORAGE_KEYS.activeTimer,
        JSON.stringify(savedActiveTimer({ lastActiveAt, sessionStarted: false })),
      );
      vi.setSystemTime(new Date('2024-01-02T00:00:00.000Z')); // 하루 경과

      const store = createTimerStore();
      store.getState().hydrate();

      expect(store.getState().showAbandonedPrompt).toBe(false);
    });

    it('lastActiveAt이 없는(마이그레이션 이전) 데이터는 sessionStartedAt으로 폴백해 판단', () => {
      const sessionStartedAt = new Date('2024-01-01T00:00:00.000Z').getTime();
      const raw = savedActiveTimer({ sessionStartedAt });
      delete (raw as { lastActiveAt?: unknown }).lastActiveAt;
      localStorage.setItem(STORAGE_KEYS.activeTimer, JSON.stringify(raw));
      vi.setSystemTime(new Date('2024-01-01T04:00:00.000Z')); // 4시간 경과

      const store = createTimerStore();
      store.getState().hydrate();

      expect(store.getState().showAbandonedPrompt).toBe(true);
    });

    it('dismissAbandonedPrompt() — showAbandonedPrompt를 false로 되돌림', () => {
      const lastActiveAt = new Date('2024-01-01T00:00:00.000Z').getTime();
      localStorage.setItem(
        STORAGE_KEYS.activeTimer,
        JSON.stringify(savedActiveTimer({ lastActiveAt })),
      );
      vi.setSystemTime(new Date('2024-01-01T03:00:01.000Z'));
      const store = createTimerStore();
      store.getState().hydrate();

      store.getState().dismissAbandonedPrompt();

      expect(store.getState().showAbandonedPrompt).toBe(false);
    });
  });
});
