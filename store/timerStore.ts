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

  start: () => void
  pause: () => void
  complete: () => void     // 타이머 0 도달 시 훅이 호출 — pause와 달리 remainingSeconds를 0으로 고정
  reset: () => void
  setPhase: (phase: TimerPhase) => void
  setCurrentTask: (taskId: string | null) => void
  completeCycle: () => void
  updateSettings: (patch: Partial<TimerSettings>) => void
  endSession: () => void
}

function phaseSeconds(settings: TimerSettings): Record<TimerPhase, number> {
  return {
    focus: settings.focusMinutes * 60,
    'short-break': settings.shortBreakMinutes * 60,
    'long-break': settings.longBreakMinutes * 60,
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

      start: () => set({ startedAt: Date.now() }),
      pause: () => {
        const { startedAt, remainingSeconds } = get()
        if (!startedAt) return
        const elapsed = Math.floor((Date.now() - startedAt) / 1000)
        set({ startedAt: null, remainingSeconds: Math.max(0, remainingSeconds - elapsed) })
      },
      complete: () => {
        const { startedAt } = get()
        if (!startedAt) return
        set({ startedAt: null, remainingSeconds: 0 })
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
        const nextPhase: TimerPhase =
          next % settings.cyclesBeforeLongBreak === 0 ? 'long-break' : 'short-break'
        const seconds = phaseSeconds(settings)
        set({ cycleCount: next, phase: nextPhase, remainingSeconds: seconds[nextPhase], startedAt: null })
      },
      endSession: () => {
        const seconds = phaseSeconds(get().settings)
        set({ phase: 'focus', remainingSeconds: seconds.focus, startedAt: null, cycleCount: 0, currentTaskId: null })
      },
      updateSettings: (patch) => {
        const next = { ...get().settings, ...patch }
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.timerSettings, JSON.stringify(next))
        }
        const seconds = phaseSeconds(next)
        set({ settings: next, remainingSeconds: seconds[get().phase] })
      },
    }
  })

export type TimerStoreApi = ReturnType<typeof createTimerStore>
export type { TimerStore }
