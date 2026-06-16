'use client'

import { Maximize2 } from 'lucide-react'
import { useTimerStore } from '@/store/StoreProvider'

export function TimerControls() {
  const isRunning = useTimerStore((s) => s.startedAt !== null)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const endSession = useTimerStore((s) => s.endSession)
  const enterFocusMode = useTimerStore((s) => s.enterFocusMode)

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={!isRunning}
        onClick={enterFocusMode}
        aria-label="집중 모드"
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        집중
      </button>

      <button
        onClick={isRunning ? pause : start}
        className="px-7 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:bg-primary/90 active:bg-primary/80"
      >
        {isRunning ? '일시정지' : '시작'}
      </button>

      <button
        onClick={endSession}
        className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        세션 종료
      </button>
    </div>
  )
}
