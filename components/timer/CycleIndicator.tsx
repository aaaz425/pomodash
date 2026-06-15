'use client'

import { useTimerStore } from '@/store/StoreProvider'
import { useTimer } from '@/hooks/useTimer'
import type { TimerPhase } from '@/types'

const PHASE_DOT_CLASSES: Record<TimerPhase, string> = {
  focus: 'bg-[#10d9a0]',
  'short-break': 'bg-[#60a5fa]',
  'long-break': 'bg-[#a78bfa]',
}

export function CycleIndicator() {
  const { phase } = useTimer()
  const cycleCount = useTimerStore((s) => s.cycleCount)
  const cyclesBeforeLongBreak = useTimerStore((s) => s.settings.cyclesBeforeLongBreak)

  const pos = cycleCount % cyclesBeforeLongBreak
  const isLongBreak = phase === 'long-break' && pos === 0 && cycleCount > 0
  const dotClass = PHASE_DOT_CLASSES[phase]

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: cyclesBeforeLongBreak }).map((_, i) => {
        const isCompleted = isLongBreak || i < pos
        const isCurrent = !isCompleted && i === pos && phase === 'focus'
        const isEmpty = !isCompleted && !isCurrent

        return (
          <div
            key={i}
            className={[
              'w-2 h-2 rounded-full transition-all duration-300',
              isCompleted ? dotClass : '',
              isCurrent ? `${dotClass} animate-pulse` : '',
              isEmpty ? 'border-[1.5px] border-[#1e2d3d]' : '',
            ].filter(Boolean).join(' ')}
          />
        )
      })}
    </div>
  )
}
