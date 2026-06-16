'use client'

import { createStore } from 'zustand'
import type { TimerPhase, TimerSettings } from '@/types'
import { DEFAULT_TIMER_SETTINGS, TimerSettingsSchema, STORAGE_KEYS } from '@/types'

interface TimerStore {
  phase: TimerPhase
  remainingSeconds: number
  startedAt: number | null // 절대 시간 기반 계산용
  cycleCount: number       // 현재 세션 내 완료된 focus 수
  currentTaskId: string | null
  settings: TimerSettings
  sessionEnded: boolean    // true일 때 세션 기록 모달 표시
  isFocusMode: boolean     // true일 때 집중 모드 오버레이 표시
  sessionStarted: boolean  // true일 때 작업 전환 불가(작업 관리 버튼 숨김)

  start: () => void
  pause: () => void
  complete: () => void     // 타이머 0 도달 시 훅이 호출
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

function loadSettings(): TimerSettings {
  if (typeof window === 'undefined') return DEFAULT_TIMER_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.timerSettings)
    if (!raw) return DEFAULT_TIMER_SETTINGS
    return TimerSettingsSchema.parse(JSON.parse(raw))
  } catch {
    return DEFAULT_TIMER_SETTINGS
  }
}

export const createTimerStore = () =>
  createStore<TimerStore>()((set, get) => {
    const settings = loadSettings()
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

      start: () => set({ startedAt: Date.now(), sessionStarted: true }),
      pause: () => {
        const { startedAt, remainingSeconds } = get()
        if (!startedAt) return
        const elapsed = Math.floor((Date.now() - startedAt) / 1000)
        set({ startedAt: null, remainingSeconds: Math.max(0, remainingSeconds - elapsed) })
      },
      complete: () => {
        const { startedAt, phase } = get()
        if (!startedAt) return
        // focus 종료 → 사이클 진행(휴식 전환 또는 세션 종료) / 휴식 종료 → 다음 focus로 전환
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
      setCurrentTask: (taskId) => set({ currentTaskId: taskId }),
      completeCycle: () => {
        const { cycleCount, settings } = get()
        const next = cycleCount + 1
        if (next >= settings.totalCycles) {
          // 마지막 사이클 완료 → 세션 종료
          set({ cycleCount: next, startedAt: null, sessionEnded: true, isFocusMode: false })
        } else {
          const seconds = phaseSeconds(settings)
          set({ cycleCount: next, phase: 'short-break', remainingSeconds: seconds['short-break'], startedAt: null })
        }
      },
      updateSettings: (patch) => {
        const next = { ...get().settings, ...patch }
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.timerSettings, JSON.stringify(next))
        }
        const seconds = phaseSeconds(next)
        set({ settings: next, remainingSeconds: seconds[get().phase] })
      },
      endSession: () => {
        set({ startedAt: null, sessionEnded: true, isFocusMode: false })
      },
      dismissSessionRecord: () => {
        const seconds = phaseSeconds(get().settings)
        set({ phase: 'focus', remainingSeconds: seconds.focus, startedAt: null, cycleCount: 0, currentTaskId: null, sessionEnded: false, sessionStarted: false })
      },
      enterFocusMode: () => set({ isFocusMode: true }),
      exitFocusMode: () => set({ isFocusMode: false }),
    }
  })

export type TimerStoreApi = ReturnType<typeof createTimerStore>
export type { TimerStore }
