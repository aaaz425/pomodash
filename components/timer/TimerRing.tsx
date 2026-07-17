'use client';

import { useTimerStore, useHydrated } from '@/store/StoreProvider';
import { useTimer } from '@/hooks/useTimer';
import {
  PHASE_HEX_COLORS,
  PHASE_LABELS,
  PHASE_BADGE_STYLES,
  NEUTRAL_HEX_COLOR,
} from '@/lib/constants/timerColors';
import { Badge } from '@/components/shared/Badge';
import { TimerGlow } from '@/components/timer/TimerGlow';
import { formatClock } from '@/lib/utils';

const BASE = 240;
const SW = 18;
const R = BASE / 2 - SW / 2;
const CIRC = 2 * Math.PI * R;

export function TimerRing() {
  const hydrated = useHydrated();
  const { displaySeconds, phase, mode } = useTimer();
  const totalSeconds = useTimerStore((s) =>
    s.phase === 'focus' ? s.settings.focusMinutes * 60 : s.settings.shortBreakMinutes * 60,
  );
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const sessionStarted = useTimerStore((s) => s.sessionStarted);
  const isPaused = sessionStarted && !isRunning;
  const isIdle = !sessionStarted && !isRunning;
  const isNeutral = isIdle || isPaused;
  const statusLabel = isIdle ? '대기 중' : isPaused ? '일시정지' : PHASE_LABELS[phase];

  // free 모드는 목표치가 없으므로 링을 가득 채운 채 옅게 표시해 "진행 중"만 알림
  const elapsedFraction =
    mode === 'free' ? 1 : totalSeconds > 0 ? (totalSeconds - displaySeconds) / totalSeconds : 0;
  const dashOffset = CIRC * (1 - elapsedFraction);
  const color = isNeutral ? NEUTRAL_HEX_COLOR : PHASE_HEX_COLORS[phase];
  const badge = PHASE_BADGE_STYLES[phase];

  const timeLabel = formatClock(displaySeconds);

  return (
    <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[240px] lg:h-[240px]">
      <TimerGlow phase={phase} isNeutral={isNeutral} />
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
          strokeOpacity={mode === 'free' ? 0.35 : undefined}
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
          {timeLabel}
        </time>
        {isNeutral ? (
          <Badge className="gap-1.5 px-2.5 bg-muted/60">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
            <span className="text-[10px] font-semibold tracking-[0.5px] text-muted-foreground">
              {statusLabel}
            </span>
          </Badge>
        ) : (
          <Badge className={`gap-1.5 px-2.5 ${badge.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            <span className={`text-[10px] font-semibold tracking-[0.5px] ${badge.text}`}>
              {statusLabel}
            </span>
          </Badge>
        )}
      </div>
    </div>
  );
}
