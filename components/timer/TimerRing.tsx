'use client'

import { useTimerStore } from '@/store/StoreProvider'
import { useTimer } from '@/hooks/useTimer'
import type { TimerPhase } from '@/types'

const PHASE_COLORS: Record<TimerPhase, string> = {
  focus: '#10d9a0',
  'short-break': '#60a5fa',
  'long-break': '#a78bfa',
}

const PHASE_TEXT_CLASSES: Record<TimerPhase, string> = {
  focus: 'text-[#10d9a0]',
  'short-break': 'text-[#60a5fa]',
  'long-break': 'text-[#a78bfa]',
}

const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: '집중 중',
  'short-break': '짧은 휴식',
  'long-break': '긴 휴식',
}

interface Props {
  size?: number
}

export function TimerRing({ size = 240 }: Props) {
  const { displaySeconds, phase } = useTimer()
  const totalSeconds = useTimerStore((s) =>
    ({
      focus: s.settings.focusMinutes * 60,
      'short-break': s.settings.shortBreakMinutes * 60,
      'long-break': s.settings.longBreakMinutes * 60,
    })[s.phase]
  )

  // innerRadius 0.85 → ring thickness = size * 0.075
  const sw = Math.round(size * 0.075)
  const r = size / 2 - sw / 2
  const circ = 2 * Math.PI * r
  const progress = totalSeconds > 0 ? displaySeconds / totalSeconds : 1
  const dashOffset = circ * (1 - progress)
  const color = PHASE_COLORS[phase]

  const mm = String(Math.floor(displaySeconds / 60)).padStart(2, '0')
  const ss = String(displaySeconds % 60).padStart(2, '0')

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeOpacity={0.1} strokeWidth={sw}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={dashOffset}
          className="timer-progress-circle"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <time
          className="font-mono font-bold tabular-nums text-foreground leading-none text-[3rem] tracking-[-2px]"
          dateTime={`PT${Math.floor(displaySeconds / 60)}M${displaySeconds % 60}S`}
        >
          {mm}:{ss}
        </time>
        <span className={`text-xs font-semibold tracking-[0.6px] ${PHASE_TEXT_CLASSES[phase]}`}>
          {PHASE_LABELS[phase]}
        </span>
      </div>
    </div>
  )
}
