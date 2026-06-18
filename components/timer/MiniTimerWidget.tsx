'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pause } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { useTimerStore, useHydrated } from '@/store/StoreProvider';
import type { TimerPhase } from '@/types';

interface Props {
  variant: 'bar' | 'icon' | 'card';
}

const PHASE_COLOR: Record<TimerPhase, string> = {
  focus: '#10d9a0',
  'short-break': '#60a5fa',
};

function fmt(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function MiniTimerWidget({ variant }: Props) {
  const hydrated = useHydrated();
  const { displaySeconds, isRunning, phase, cycleCount } = useTimer();
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);
  const pause = useTimerStore((s) => s.pause);
  const pathname = usePathname();

  if (!hydrated || !isRunning || pathname === '/') return null;

  const color = PHASE_COLOR[phase];
  const timeStr = fmt(displaySeconds);
  const cycleLabel = `${cycleCount}/${totalCycles}`;

  if (variant === 'bar') {
    return (
      <div className="fixed bottom-16 left-0 right-0 z-30 px-3 pb-2">
        <div className="flex items-center gap-2 rounded-xl bg-card border border-border shadow-lg px-3 py-2">
          <Link href="/" className="flex items-center gap-2 flex-1 min-w-0">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="font-mono text-sm font-semibold tabular-nums">{timeStr}</span>
            <span className="text-xs text-muted-foreground truncate">
              {phase === 'focus' ? '집중' : '휴식'} · {cycleLabel}
            </span>
          </Link>
          <button
            onClick={pause}
            aria-label="타이머 일시정지"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors shrink-0"
          >
            <Pause className="w-3.5 h-3.5" style={{ color }} />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className="flex flex-col items-center gap-0.5 my-1">
        <Link
          href="/"
          className="font-mono text-[11px] font-semibold tabular-nums leading-tight"
          style={{ color }}
        >
          {timeStr}
        </Link>
        <button
          onClick={pause}
          aria-label="타이머 일시정지"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
        >
          <Pause className="w-3 h-3" style={{ color }} />
        </button>
      </div>
    );
  }

  // variant === 'card'
  return (
    <div className="mx-2.5 mb-1 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-2">
      <Link href="/" className="flex items-center gap-2 flex-1 min-w-0">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="font-mono text-sm font-semibold tabular-nums">{timeStr}</span>
        <span className="text-[11px] text-muted-foreground shrink-0">{cycleLabel}</span>
      </Link>
      <button
        onClick={pause}
        aria-label="타이머 일시정지"
        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors shrink-0"
      >
        <Pause className="w-3 h-3" style={{ color }} />
      </button>
    </div>
  );
}
