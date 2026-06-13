'use client'

import { createStore } from 'zustand'
import type { TimerPhase } from '@/types'
import { DEFAULT_TIMER_SETTINGS } from '@/types'

interface TimerStore {
  phase: TimerPhase
  remainingSeconds: number
  startedAt: number | null // 절대 시간 기반 계산용
  cycleCount: number
  currentTaskId: string | null

  start: () => void
  pause: () => void
  reset: () => void
  setPhase: (phase: TimerPhase) => void
  setCurrentTask: (taskId: string | null) => void
  completeCycle: () => void
}

const PHASE_SECONDS: Record<TimerPhase, number> = {
  focus: DEFAULT_TIMER_SETTINGS.focusMinutes * 60,
  'short-break': DEFAULT_TIMER_SETTINGS.shortBreakMinutes * 60,
  'long-break': DEFAULT_TIMER_SETTINGS.longBreakMinutes * 60,
}

export const createTimerStore = () =>
  createStore<TimerStore>()((set, get) => ({
    phase: 'focus',
    remainingSeconds: PHASE_SECONDS.focus,
    startedAt: null,
    cycleCount: 0,
    currentTaskId: null,

    start: () => set({ startedAt: Date.now() }),
    pause: () => {
      const { startedAt, remainingSeconds } = get()
      if (!startedAt) return
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      set({ startedAt: null, remainingSeconds: Math.max(0, remainingSeconds - elapsed) })
    },
    reset: () => set({ remainingSeconds: PHASE_SECONDS[get().phase], startedAt: null }),
    setPhase: (phase) => set({ phase, remainingSeconds: PHASE_SECONDS[phase], startedAt: null }),
    setCurrentTask: (taskId) => set({ currentTaskId: taskId }),
    completeCycle: () => {
      const { cycleCount } = get()
      const next = cycleCount + 1
      const nextPhase: TimerPhase =
        next % DEFAULT_TIMER_SETTINGS.cyclesBeforeLongBreak === 0 ? 'long-break' : 'short-break'
      set({ cycleCount: next, phase: nextPhase, remainingSeconds: PHASE_SECONDS[nextPhase], startedAt: null })
    },
  }))

export type TimerStoreApi = ReturnType<typeof createTimerStore>
export type { TimerStore }
