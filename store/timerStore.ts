'use client';

import { createStore } from 'zustand';
import type { TimerPhase, TimerSettings } from '@/types';
import { DEFAULT_TIMER_SETTINGS, ActiveTimerStateSchema, STORAGE_KEYS } from '@/types';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

interface RawFocusPeriod {
  start: number; // ms timestamp
  end: number; // ms timestamp
}

interface TimerStore {
  phase: TimerPhase;
  remainingSeconds: number;
  startedAt: number | null; // 현재 실행 구간 시작 시각 (절대 시간 기반 계산용)
  cycleCount: number; // 현재 세션 내 완료된 focus 수
  currentTaskId: string | null;
  settings: TimerSettings;
  sessionEnded: boolean; // true일 때 세션 기록 모달 표시
  isFocusMode: boolean; // true일 때 집중 모드 오버레이 표시
  sessionStarted: boolean; // true일 때 작업 전환 불가(작업 관리 버튼 숨김)
  sessionStartedAt: number | null; // 세션 첫 start() 시각
  sessionEndedAt: number | null; // 세션 종료 시각 (모달 노출 시점)
  accFocusSeconds: number; // 일시정지 제외 누적 집중 초
  rawFocusPeriods: RawFocusPeriod[]; // 집중 구간 기록 (저장 전 normalizeFocusPeriods 통과 필요)

  start: () => void;
  pause: () => void;
  complete: () => void; // 타이머 0 도달 시 훅이 호출
  reset: () => void;
  setPhase: (phase: TimerPhase) => void;
  setCurrentTask: (taskId: string | null) => void;
  completeCycle: () => void;
  updateSettings: (patch: Partial<TimerSettings>) => void;
  applyActiveTaskTimeUpdate: (patch: Partial<TimerSettings>) => void;
  endSession: () => void;
  dismissSessionRecord: () => void;
  enterFocusMode: () => void;
  exitFocusMode: () => void;
  hydrate: () => void;
}

function phaseSeconds(settings: TimerSettings): Record<TimerPhase, number> {
  return {
    focus: settings.focusMinutes * 60,
    'short-break': settings.shortBreakMinutes * 60,
  };
}

// 새로고침 복구용 스냅샷 — isFocusMode(순수 UI 토글)는 제외
function toActiveTimerSnapshot(s: TimerStore) {
  return {
    phase: s.phase,
    remainingSeconds: s.remainingSeconds,
    startedAt: s.startedAt,
    cycleCount: s.cycleCount,
    currentTaskId: s.currentTaskId,
    settings: s.settings,
    sessionEnded: s.sessionEnded,
    sessionStarted: s.sessionStarted,
    sessionStartedAt: s.sessionStartedAt,
    sessionEndedAt: s.sessionEndedAt,
    accFocusSeconds: s.accFocusSeconds,
    rawFocusPeriods: s.rawFocusPeriods,
  };
}

export const createTimerStore = () => {
  const store = createStore<TimerStore>()((set, get) => {
    const settings = DEFAULT_TIMER_SETTINGS;
    const seconds = phaseSeconds(settings);
    return {
      phase: 'focus',
      remainingSeconds: seconds.focus,
      startedAt: null,
      cycleCount: 0,
      currentTaskId: null,
      settings,
      sessionEnded: false,
      isFocusMode: false,
      sessionStarted: false,
      sessionStartedAt: null,
      sessionEndedAt: null,
      accFocusSeconds: 0,
      rawFocusPeriods: [],

      start: () =>
        set((state) => {
          if (!state.sessionStarted) trackEvent(EVENTS.TIMER_STARTED);
          return {
            startedAt: Date.now(),
            sessionStarted: true,
            sessionStartedAt: state.sessionStartedAt ?? Date.now(),
          };
        }),

      pause: () => {
        const { startedAt, remainingSeconds, phase, accFocusSeconds, rawFocusPeriods } = get();
        if (!startedAt) return;
        const now = Date.now();
        const elapsed = Math.floor((now - startedAt) / 1000);
        set({
          startedAt: null,
          remainingSeconds: Math.max(0, remainingSeconds - elapsed),
          accFocusSeconds: phase === 'focus' ? accFocusSeconds + elapsed : accFocusSeconds,
          rawFocusPeriods:
            phase === 'focus'
              ? [...rawFocusPeriods, { start: startedAt, end: now }]
              : rawFocusPeriods,
        });
      },

      complete: () => {
        const { startedAt, phase, settings } = get();
        if (!startedAt) return;
        if (phase === 'focus') {
          get().completeCycle();
        } else {
          const seconds = phaseSeconds(settings);
          set({ phase: 'focus', remainingSeconds: seconds.focus, startedAt: Date.now() });
        }
      },

      reset: () => {
        const seconds = phaseSeconds(get().settings);
        set({ remainingSeconds: seconds[get().phase], startedAt: null });
      },

      setPhase: (phase) => {
        const seconds = phaseSeconds(get().settings);
        set({ phase, remainingSeconds: seconds[phase], startedAt: null });
      },

      // 작업 선택 시 해당 작업의 설정 적용, 해제 시 기본값으로 복원
      setCurrentTask: (taskId) => {
        if (taskId === null) {
          const seconds = phaseSeconds(DEFAULT_TIMER_SETTINGS);
          set({
            currentTaskId: null,
            settings: DEFAULT_TIMER_SETTINGS,
            remainingSeconds: seconds.focus,
          });
        } else {
          set({ currentTaskId: taskId });
        }
      },

      completeCycle: () => {
        const { cycleCount, settings, startedAt, accFocusSeconds, rawFocusPeriods } = get();
        const now = Date.now();
        const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0;
        const totalFocus = accFocusSeconds + elapsed;
        const closedPeriods = startedAt
          ? [...rawFocusPeriods, { start: startedAt, end: now }]
          : rawFocusPeriods;
        const next = cycleCount + 1;
        if (next >= settings.totalCycles) {
          trackEvent(EVENTS.TIMER_COMPLETED, { cycles: next });
          set({
            cycleCount: next,
            startedAt: null,
            sessionEnded: true,
            isFocusMode: false,
            accFocusSeconds: totalFocus,
            sessionEndedAt: now,
            rawFocusPeriods: closedPeriods,
          });
        } else {
          const seconds = phaseSeconds(settings);
          set({
            cycleCount: next,
            phase: 'short-break',
            remainingSeconds: seconds['short-break'],
            startedAt: Date.now(),
            accFocusSeconds: totalFocus,
            rawFocusPeriods: closedPeriods,
          });
        }
      },

      // localStorage에 저장하지 않음 — 설정은 작업 선택 시에만 적용, 세션 간 유지하지 않음
      updateSettings: (patch) => {
        const next = { ...get().settings, ...patch };
        const seconds = phaseSeconds(next);
        set({ settings: next, remainingSeconds: seconds[get().phase] });
      },

      // 일시정지 중인 활성 작업의 목표 시간을 수정했을 때 호출 — 이미 진행한 시간은
      // 보존하고 현재 phase의 남은 시간만 새 목표와의 차이만큼 보정한다.
      // (예: 25분 집중 중 10분 경과 후 목표를 30분으로 늘리면 남은 시간도 5분 늘어남)
      applyActiveTaskTimeUpdate: (patch) => {
        const { settings, phase, remainingSeconds, startedAt } = get();
        if (startedAt !== null) return; // 실행 중에는 무시 — 호출 측에서 막아야 하는 안전망
        const next = { ...settings, ...patch };
        const delta = phaseSeconds(next)[phase] - phaseSeconds(settings)[phase];
        set({ settings: next, remainingSeconds: Math.max(0, remainingSeconds + delta) });
      },

      endSession: () => {
        const { startedAt, phase, accFocusSeconds, rawFocusPeriods } = get();
        const now = Date.now();
        const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0;
        const closedPeriods =
          startedAt && phase === 'focus'
            ? [...rawFocusPeriods, { start: startedAt, end: now }]
            : rawFocusPeriods;
        set({
          startedAt: null,
          sessionEnded: true,
          isFocusMode: false,
          accFocusSeconds: phase === 'focus' ? accFocusSeconds + elapsed : accFocusSeconds,
          sessionEndedAt: now,
          rawFocusPeriods: closedPeriods,
        });
      },

      dismissSessionRecord: () => {
        const seconds = phaseSeconds(DEFAULT_TIMER_SETTINGS);
        set({
          phase: 'focus',
          remainingSeconds: seconds.focus,
          startedAt: null,
          cycleCount: 0,
          currentTaskId: null,
          sessionEnded: false,
          sessionStarted: false,
          settings: DEFAULT_TIMER_SETTINGS,
          sessionStartedAt: null,
          sessionEndedAt: null,
          accFocusSeconds: 0,
          rawFocusPeriods: [],
        });
      },

      enterFocusMode: () => {
        trackEvent(EVENTS.FOCUS_MODE_ENTERED);
        set({ isFocusMode: true });
      },
      exitFocusMode: () => set({ isFocusMode: false }),

      hydrate: () => {
        const fallback = toActiveTimerSnapshot(get());
        set(loadFromStorage(STORAGE_KEYS.activeTimer, ActiveTimerStateSchema, fallback));
      },
    };
  });

  // 활성 타이머 스냅샷을 상태 변경마다 자동 저장 — 액션별로 직접 호출하지 않아도
  // 누락 없이 항상 최신 상태가 반영된다 (complete()→completeCycle() 같은 위임 구조 때문에
  // 액션마다 수동 호출하면 빠뜨리기 쉬움)
  store.subscribe((state) => {
    saveToStorage(STORAGE_KEYS.activeTimer, toActiveTimerSnapshot(state));
  });

  return store;
};

export type TimerStoreApi = ReturnType<typeof createTimerStore>;
export type { TimerStore };
