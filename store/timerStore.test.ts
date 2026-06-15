import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTimerStore } from './timerStore'

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
})

describe('timerStore', () => {
  it('start() — startedAt이 숫자로 설정됨', () => {
    const store = createTimerStore()
    store.getState().start()
    expect(typeof store.getState().startedAt).toBe('number')
  })

  it('pause() — startedAt이 null, remainingSeconds가 elapsed만큼 감소', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    const store = createTimerStore()
    store.getState().start()

    vi.setSystemTime(new Date('2024-01-01T00:00:10.000Z'))
    store.getState().pause()

    expect(store.getState().startedAt).toBe(null)
    expect(store.getState().remainingSeconds).toBe(25 * 60 - 10)
  })

  it('reset() — remainingSeconds가 현재 phase 기본값으로 복원', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    const store = createTimerStore()
    store.getState().start()
    vi.setSystemTime(new Date('2024-01-01T00:00:10.000Z'))
    store.getState().pause()
    store.getState().reset()

    expect(store.getState().remainingSeconds).toBe(25 * 60)
    expect(store.getState().startedAt).toBe(null)
  })

  it('completeCycle() — cycleCount +1, short-break로 전환', () => {
    const store = createTimerStore()
    store.getState().completeCycle()

    expect(store.getState().cycleCount).toBe(1)
    expect(store.getState().phase).toBe('short-break')
    expect(store.getState().startedAt).toBe(null)
  })

  it('completeCycle() — cyclesBeforeLongBreak(4)회 후 long-break로 전환', () => {
    const store = createTimerStore()
    for (let i = 0; i < 4; i++) store.getState().completeCycle()

    expect(store.getState().cycleCount).toBe(4)
    expect(store.getState().phase).toBe('long-break')
  })

  it('complete() — startedAt null, remainingSeconds 0으로 고정', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    const store = createTimerStore()
    store.getState().start()

    vi.setSystemTime(new Date('2024-01-01T00:25:00.000Z'))
    store.getState().complete()

    expect(store.getState().startedAt).toBe(null)
    expect(store.getState().remainingSeconds).toBe(0)
  })

  it('updateSettings() — settings 반영 및 현재 phase remainingSeconds 재계산', () => {
    const store = createTimerStore()
    store.getState().updateSettings({ focusMinutes: 30 })

    expect(store.getState().settings.focusMinutes).toBe(30)
    expect(store.getState().remainingSeconds).toBe(30 * 60)
  })
})
