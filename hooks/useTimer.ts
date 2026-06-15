'use client'

import { useEffect, useState } from 'react'
import { useTimerStore } from '@/store/StoreProvider'

export function useTimer() {
  const startedAt = useTimerStore((s) => s.startedAt)
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds)
  const phase = useTimerStore((s) => s.phase)
  const cycleCount = useTimerStore((s) => s.cycleCount)
  const complete = useTimerStore((s) => s.complete)

  // 실행 중일 때만 사용하는 디스플레이 값 — 인터벌 콜백에서만 업데이트
  const [runningDisplay, setRunningDisplay] = useState(remainingSeconds)

  useEffect(() => {
    if (!startedAt) return

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const remaining = Math.max(0, remainingSeconds - elapsed)
      setRunningDisplay(remaining)
      if (remaining === 0) complete()
    }

    // setTimeout(0)으로 비동기 첫 tick — effect body 내 동기 setState 금지 회피
    const firstTick = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearTimeout(firstTick)
      clearInterval(id)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [startedAt, remainingSeconds, complete])

  // 실행 중이 아닐 때는 store 값을 그대로 사용 (Date.now() 렌더 중 호출 금지 회피)
  const displaySeconds = startedAt !== null ? runningDisplay : remainingSeconds

  return {
    displaySeconds,
    isRunning: startedAt !== null,
    phase,
    cycleCount,
  }
}
