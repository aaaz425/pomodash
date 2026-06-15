'use client'

import { Pause, Play, RotateCcw } from 'lucide-react'
import { useTimerStore } from '@/store/StoreProvider'

export function TimerControls() {
  const isRunning = useTimerStore((s) => s.startedAt !== null)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const reset = useTimerStore((s) => s.reset)

  return (
    <div className="flex items-center gap-2.5">
      {/* Pause — ghost */}
      <button
        onClick={pause}
        disabled={!isRunning}
        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border text-muted-foreground text-sm font-medium transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Pause className="w-4 h-4" />
        일시정지
      </button>

      {/* Start — primary */}
      <button
        onClick={start}
        disabled={isRunning}
        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-[#34e8b3] active:bg-[#0fb88a] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Play className="w-4 h-4" />
        {isRunning ? '진행 중' : '시작'}
      </button>

      {/* Reset — ghost */}
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border text-muted-foreground text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
      >
        <RotateCcw className="w-4 h-4" />
        리셋
      </button>
    </div>
  )
}
