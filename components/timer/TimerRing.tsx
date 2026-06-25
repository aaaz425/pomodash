'use client';

import { useTimerStore, useHydrated } from '@/store/StoreProvider';
import { useTimer } from '@/hooks/useTimer';
import { PHASE_HEX_COLORS } from '@/lib/timerColors';
import type { TimerPhase } from '@/types';

const PHASE_BADGE: Record<TimerPhase, { bg: string; dot: string; text: string }> = {
  focus: { bg: 'bg-[#10d9a01a]', dot: 'bg-[#10d9a0]', text: 'text-[#10d9a0]' },
  'short-break': { bg: 'bg-[#60a5fa1a]', dot: 'bg-[#60a5fa]', text: 'text-[#60a5fa]' },
};

const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: '집중 중',
  'short-break': '휴식 중',
};

const PHASE_GLOW: Record<TimerPhase, string> = {
  focus: 'bg-[radial-gradient(circle,_#10d9a030_0%,_transparent_70%)]',
  'short-break': 'bg-[radial-gradient(circle,_#60a5fa30_0%,_transparent_70%)]',
};

const BASE = 240;
const SW = 18;
const R = BASE / 2 - SW / 2;
const CIRC = 2 * Math.PI * R;

export function TimerRing() {
  const hydrated = useHydrated();
  const { displaySeconds, phase } = useTimer();
  const totalSeconds = useTimerStore(
    (s) =>
      ({
        focus: s.settings.focusMinutes * 60,
        'short-break': s.settings.shortBreakMinutes * 60,
      })[s.phase],
  );
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const sessionStarted = useTimerStore((s) => s.sessionStarted);
  const isPaused = sessionStarted && !isRunning;
  const isIdle = !sessionStarted && !isRunning;
  const isNeutral = isIdle || isPaused;
  const statusLabel = isIdle ? '대기 중' : isPaused ? '일시정지' : PHASE_LABELS[phase];

  const elapsedFraction = totalSeconds > 0 ? (totalSeconds - displaySeconds) / totalSeconds : 0;
  const dashOffset = CIRC * (1 - elapsedFraction);
  const color = PHASE_HEX_COLORS[phase];
  const badge = PHASE_BADGE[phase];

  const mm = String(Math.floor(displaySeconds / 60)).padStart(2, '0');
  const ss = String(displaySeconds % 60).padStart(2, '0');

  const glow = PHASE_GLOW[phase];

  return (
    <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[240px] lg:h-[240px]">
      <div
        className={`absolute pointer-events-none rounded-full w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${glow}`}
      />
      <svg viewBox={`0 0 ${BASE} ${BASE}`} className="w-full h-full -rotate-90" aria-hidden="true">
        <circle
          cx={BASE / 2}
          cy={BASE / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeOpacity={0.1}
          strokeWidth={SW}
        />
        <circle
          cx={BASE / 2}
          cy={BASE / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          className="timer-progress-circle"
        />
      </svg>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300 ${hydrated ? 'opacity-100' : 'opacity-0'}`}
      >
        <time
          className="font-mono font-bold tabular-nums text-foreground leading-none tracking-[-2px] text-[1.75rem] sm:text-[2.5rem] lg:text-[3rem]"
          dateTime={`PT${Math.floor(displaySeconds / 60)}M${displaySeconds % 60}S`}
        >
          {mm}:{ss}
        </time>
        {isNeutral ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted/60">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
            <span className="text-[10px] font-semibold tracking-[0.5px] text-muted-foreground">
              {statusLabel}
            </span>
          </div>
        ) : (
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${badge.bg}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            <span className={`text-[10px] font-semibold tracking-[0.5px] ${badge.text}`}>
              {statusLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
