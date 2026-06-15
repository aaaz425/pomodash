'use client'

import { useTimer } from '@/hooks/useTimer'
import type { TimerPhase } from '@/types'

const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: '집중 중',
  'short-break': '휴식 중',
}

const PHASE_STYLES: Record<TimerPhase, { bg: string; dot: string; text: string }> = {
  focus: {
    bg: 'bg-[#10d9a01a]',
    dot: 'bg-[#10d9a0]',
    text: 'text-[#10d9a0]',
  },
  'short-break': {
    bg: 'bg-[#60a5fa1a]',
    dot: 'bg-[#60a5fa]',
    text: 'text-[#60a5fa]',
  },
}

export function SessionBadge() {
  const { phase } = useTimer()
  const s = PHASE_STYLES[phase]

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${s.bg}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <span className={`text-xs font-semibold ${s.text}`}>
        {PHASE_LABELS[phase]}
      </span>
    </div>
  )
}
