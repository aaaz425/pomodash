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

  it('completeCycle() — totalCycles(4)회 완료 후 sessionEnded가 true로 설정', () => {
    const store = createTimerStore()
    for (let i = 0; i < 4; i++) store.getState().completeCycle()

    expect(store.getState().cycleCount).toBe(4)
    expect(store.getState().sessionEnded).toBe(true)
  })

  it('complete() — focus 종료 시 completeCycle로 위임되어 short-break로 전환', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    const store = createTimerStore()
    store.getState().start()

    vi.setSystemTime(new Date('2024-01-01T00:25:00.000Z'))
    store.getState().complete()

    expect(store.getState().startedAt).toBe(null)
    expect(store.getState().phase).toBe('short-break')
    expect(store.getState().cycleCount).toBe(1)
    expect(store.getState().remainingSeconds).toBe(5 * 60)
  })

  it('complete() — short-break 종료 시 focus로 전환되고 cycleCount는 유지', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    const store = createTimerStore()
    store.getState().completeCycle() // focus 1회 완료 → short-break 진입
    store.getState().start()

    vi.setSystemTime(new Date('2024-01-01T00:05:00.000Z'))
    store.getState().complete()

    expect(store.getState().startedAt).toBe(null)
    expect(store.getState().phase).toBe('focus')
    expect(store.getState().cycleCount).toBe(1)
    expect(store.getState().remainingSeconds).toBe(25 * 60)
  })

  it('complete() — startedAt이 null(정지 상태)이면 아무 동작도 하지 않음', () => {
    const store = createTimerStore()
    const before = store.getState()

    store.getState().complete()

    expect(store.getState().phase).toBe(before.phase)
    expect(store.getState().cycleCount).toBe(before.cycleCount)
  })

  it('complete() — 마지막 사이클의 focus 종료 시 sessionEnded가 true로 설정', () => {
    const store = createTimerStore()
    for (let i = 0; i < 3; i++) store.getState().completeCycle()
    store.getState().setPhase('focus') // 3번째 short-break 종료 → 4번째 focus 진입

    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    store.getState().start()
    vi.setSystemTime(new Date('2024-01-01T00:25:00.000Z'))
    store.getState().complete()

    expect(store.getState().cycleCount).toBe(4)
    expect(store.getState().sessionEnded).toBe(true)
  })

  it('updateSettings() — settings 반영 및 현재 phase remainingSeconds 재계산', () => {
    const store = createTimerStore()
    store.getState().updateSettings({ focusMinutes: 30 })

    expect(store.getState().settings.focusMinutes).toBe(30)
    expect(store.getState().remainingSeconds).toBe(30 * 60)
  })

  describe('focus mode', () => {
    it('enterFocusMode() — isFocusMode가 true로 설정됨', () => {
      const store = createTimerStore()
      store.getState().enterFocusMode()
      expect(store.getState().isFocusMode).toBe(true)
    })

    it('exitFocusMode() — isFocusMode만 false로 설정되고 타이머 상태는 유지됨', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
      const store = createTimerStore()
      store.getState().start()
      store.getState().enterFocusMode()

      store.getState().exitFocusMode()

      expect(store.getState().isFocusMode).toBe(false)
      expect(store.getState().startedAt).not.toBe(null)
    })

    it('endSession() — isFocusMode도 함께 false로 닫힘', () => {
      const store = createTimerStore()
      store.getState().enterFocusMode()

      store.getState().endSession()

      expect(store.getState().isFocusMode).toBe(false)
      expect(store.getState().sessionEnded).toBe(true)
    })

    it('completeCycle() — 마지막 사이클 완료 시 isFocusMode도 함께 false로 닫힘', () => {
      const store = createTimerStore()
      store.getState().enterFocusMode()
      for (let i = 0; i < 4; i++) store.getState().completeCycle()

      expect(store.getState().isFocusMode).toBe(false)
      expect(store.getState().sessionEnded).toBe(true)
    })
  })

  describe('sessionStarted', () => {
    it('start() — sessionStarted가 true로 설정됨', () => {
      const store = createTimerStore()
      store.getState().start()
      expect(store.getState().sessionStarted).toBe(true)
    })

    it('dismissSessionRecord() — sessionStarted가 false로 초기화됨', () => {
      const store = createTimerStore()
      store.getState().start()
      store.getState().endSession()

      store.getState().dismissSessionRecord()

      expect(store.getState().sessionStarted).toBe(false)
    })
  })

  describe('hydrateSettings', () => {
    it('생성 시점에는 localStorage 값과 무관하게 항상 기본값(SSR과 동일)으로 시작함', () => {
      localStorage.setItem('pomodash:timer-settings', JSON.stringify({ focusMinutes: 5, shortBreakMinutes: 1, totalCycles: 2 }))

      const store = createTimerStore()

      expect(store.getState().settings.focusMinutes).toBe(25)
      expect(store.getState().remainingSeconds).toBe(25 * 60)
    })

    it('hydrateSettings() — localStorage 값을 읽어 settings와 remainingSeconds에 반영함', () => {
      localStorage.setItem('pomodash:timer-settings', JSON.stringify({ focusMinutes: 5, shortBreakMinutes: 1, totalCycles: 2 }))

      const store = createTimerStore()
      store.getState().hydrateSettings()

      expect(store.getState().settings.focusMinutes).toBe(5)
      expect(store.getState().remainingSeconds).toBe(5 * 60)
    })
  })
})
