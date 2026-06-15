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

// SVG 좌표계 기준 크기 — CSS로 실제 표시 크기 제어
const BASE = 240
const SW = 18 // innerRadius 0.85 → 240 * 0.075
const R = BASE / 2 - SW / 2
const CIRC = 2 * Math.PI * R

export function TimerRing() {
  const { displaySeconds, phase } = useTimer()
  const totalSeconds = useTimerStore((s) =>
    ({
      focus: s.settings.focusMinutes * 60,
      'short-break': s.settings.shortBreakMinutes * 60,
      'long-break': s.settings.longBreakMinutes * 60,
    })[s.phase]
  )

  // 경과 시간 비율 → 시계방향으로 차오르는 애니메이션
  const elapsedFraction = totalSeconds > 0 ? (totalSeconds - displaySeconds) / totalSeconds : 0
  const dashOffset = CIRC * (1 - elapsedFraction)
  const color = PHASE_COLORS[phase]

  const mm = String(Math.floor(displaySeconds / 60)).padStart(2, '0')
  const ss = String(displaySeconds % 60).padStart(2, '0')

  return (
    // 반응형 크기: 모바일 180px / 태블릿 220px / 데스크탑 240px
    <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[240px] lg:h-[240px]">
      <svg
        viewBox={`0 0 ${BASE} ${BASE}`}
        className="w-full h-full -rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={BASE / 2} cy={BASE / 2} r={R}
          fill="none" stroke={color} strokeOpacity={0.1} strokeWidth={SW}
        />
        {/* Progress */}
        <circle
          cx={BASE / 2} cy={BASE / 2} r={R}
          fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={dashOffset}
          className="timer-progress-circle"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <time
          className="font-mono font-bold tabular-nums text-foreground leading-none tracking-[-2px] text-[1.75rem] sm:text-[2.5rem] lg:text-[3rem]"
          dateTime={`PT${Math.floor(displaySeconds / 60)}M${displaySeconds % 60}S`}
        >
          {mm}:{ss}
        </time>
        <span className={`text-[10px] sm:text-xs font-semibold tracking-[0.6px] ${PHASE_TEXT_CLASSES[phase]}`}>
          {PHASE_LABELS[phase]}
        </span>
      </div>
    </div>
  )
}
