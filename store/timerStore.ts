'use client'

import { createStore } from 'zustand'
import type { TimerPhase, TimerSettings } from '@/types'
import { DEFAULT_TIMER_SETTINGS } from '@/types'

interface RawFocusPeriod {
  start: number  // ms timestamp
  end: number    // ms timestamp
}

interface TimerStore {
  phase: TimerPhase
  remainingSeconds: number
  startedAt: number | null      // 현재 실행 구간 시작 시각 (절대 시간 기반 계산용)
  cycleCount: number            // 현재 세션 내 완료된 focus 수
  currentTaskId: string | null
  settings: TimerSettings
  sessionEnded: boolean         // true일 때 세션 기록 모달 표시
  isFocusMode: boolean          // true일 때 집중 모드 오버레이 표시
  sessionStarted: boolean       // true일 때 작업 전환 불가(작업 관리 버튼 숨김)
  sessionStartedAt: number | null  // 세션 첫 start() 시각
  sessionEndedAt: number | null    // 세션 종료 시각 (모달 노출 시점)
  accFocusSeconds: number          // 일시정지 제외 누적 집중 초
  rawFocusPeriods: RawFocusPeriod[] // 집중 구간 기록 (저장 전 normalizeFocusPeriods 통과 필요)

  start: () => void
  pause: () => void
  complete: () => void          // 타이머 0 도달 시 훅이 호출
  reset: () => void
  setPhase: (phase: TimerPhase) => void
  setCurrentTask: (taskId: string | null) => void
  completeCycle: () => void
  updateSettings: (patch: Partial<TimerSettings>) => void
  endSession: () => void
  dismissSessionRecord: () => void
  enterFocusMode: () => void
  exitFocusMode: () => void
}

function phaseSeconds(settings: TimerSettings): Record<TimerPhase, number> {
  return {
    focus: settings.focusMinutes * 60,
    'short-break': settings.shortBreakMinutes * 60,
  }
}

export const createTimerStore = () =>
  createStore<TimerStore>()((set, get) => {
    const settings = DEFAULT_TIMER_SETTINGS
    const seconds = phaseSeconds(settings)
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

      start: () => set((state) => ({
        startedAt: Date.now(),
        sessionStarted: true,
        sessionStartedAt: state.sessionStartedAt ?? Date.now(),
      })),

      pause: () => {
        const { startedAt, remainingSeconds, phase, accFocusSeconds, rawFocusPeriods } = get()
        if (!startedAt) return
        const now = Date.now()
        const elapsed = Math.floor((now - startedAt) / 1000)
        set({
          startedAt: null,
          remainingSeconds: Math.max(0, remainingSeconds - elapsed),
          accFocusSeconds: phase === 'focus' ? accFocusSeconds + elapsed : accFocusSeconds,
          rawFocusPeriods: phase === 'focus'
            ? [...rawFocusPeriods, { start: startedAt, end: now }]
            : rawFocusPeriods,
        })
      },

      complete: () => {
        const { startedAt, phase } = get()
        if (!startedAt) return
        if (phase === 'focus') {
          get().completeCycle()
        } else {
          get().setPhase('focus')
        }
      },

      reset: () => {
        const seconds = phaseSeconds(get().settings)
        set({ remainingSeconds: seconds[get().phase], startedAt: null })
      },

      setPhase: (phase) => {
        const seconds = phaseSeconds(get().settings)
        set({ phase, remainingSeconds: seconds[phase], startedAt: null })
      },

      // 작업 선택 시 해당 작업의 설정 적용, 해제 시 기본값으로 복원
      setCurrentTask: (taskId) => {
        if (taskId === null) {
          const seconds = phaseSeconds(DEFAULT_TIMER_SETTINGS)
          set({ currentTaskId: null, settings: DEFAULT_TIMER_SETTINGS, remainingSeconds: seconds.focus })
        } else {
          set({ currentTaskId: taskId })
        }
      },

      completeCycle: () => {
        const { cycleCount, settings, startedAt, accFocusSeconds, rawFocusPeriods } = get()
        const now = Date.now()
        const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0
        const totalFocus = accFocusSeconds + elapsed
        const closedPeriods = startedAt
          ? [...rawFocusPeriods, { start: startedAt, end: now }]
          : rawFocusPeriods
        const next = cycleCount + 1
        if (next >= settings.totalCycles) {
          set({ cycleCount: next, startedAt: null, sessionEnded: true, isFocusMode: false,
                accFocusSeconds: totalFocus, sessionEndedAt: now, rawFocusPeriods: closedPeriods })
        } else {
          const seconds = phaseSeconds(settings)
          set({ cycleCount: next, phase: 'short-break', remainingSeconds: seconds['short-break'],
                startedAt: null, accFocusSeconds: totalFocus, rawFocusPeriods: closedPeriods })
        }
      },

      // localStorage에 저장하지 않음 — 설정은 작업 선택 시에만 적용, 세션 간 유지하지 않음
      updateSettings: (patch) => {
        const next = { ...get().settings, ...patch }
        const seconds = phaseSeconds(next)
        set({ settings: next, remainingSeconds: seconds[get().phase] })
      },

      endSession: () => {
        const { startedAt, phase, accFocusSeconds, rawFocusPeriods } = get()
        const now = Date.now()
        const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0
        const closedPeriods = startedAt && phase === 'focus'
          ? [...rawFocusPeriods, { start: startedAt, end: now }]
          : rawFocusPeriods
        set({
          startedAt: null,
          sessionEnded: true,
          isFocusMode: false,
          accFocusSeconds: phase === 'focus' ? accFocusSeconds + elapsed : accFocusSeconds,
          sessionEndedAt: now,
          rawFocusPeriods: closedPeriods,
        })
      },

      dismissSessionRecord: () => {
        const seconds = phaseSeconds(DEFAULT_TIMER_SETTINGS)
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
        })
      },

      enterFocusMode: () => set({ isFocusMode: true }),
      exitFocusMode: () => set({ isFocusMode: false }),
    }
  })

export type TimerStoreApi = ReturnType<typeof createTimerStore>
export type { TimerStore }
