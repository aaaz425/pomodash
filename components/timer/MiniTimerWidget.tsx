'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pause, Play } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { useTimerStore, useHydrated } from '@/store/StoreProvider';
import { PHASE_HEX_COLORS } from '@/lib/timerColors';

function fmt(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function MiniTimerWidget() {
  const hydrated = useHydrated();
  const { displaySeconds, isRunning, phase, cycleCount } = useTimer();
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);
  const sessionStarted = useTimerStore((s) => s.sessionStarted);
  const pause = useTimerStore((s) => s.pause);
  const start = useTimerStore((s) => s.start);
  const pathname = usePathname();

  if (!hydrated || !sessionStarted || pathname === '/') return null;

  const color = PHASE_HEX_COLORS[phase];

  return (
    // 모바일: BottomNav 위 중앙 / 태블릿·데스크톱: 상단 중앙
    <div className="fixed bottom-18 left-1/2 -translate-x-1/2 sm:bottom-auto sm:top-4 z-40">
      <div className="flex items-center gap-2 rounded-full bg-card border border-border shadow-lg px-3 py-1.5 whitespace-nowrap">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="font-mono text-sm font-semibold tabular-nums">
            {fmt(displaySeconds)}
          </span>
          <span className="text-xs text-muted-foreground">
            {phase === 'focus' ? '집중' : '휴식'} · {cycleCount}/{totalCycles}
          </span>
        </Link>
        <button
          onClick={isRunning ? pause : start}
          aria-label={isRunning ? '타이머 일시정지' : '타이머 재생'}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors shrink-0"
        >
          {isRunning ? (
            <Pause className="w-3 h-3" style={{ color }} />
          ) : (
            <Play className="w-3 h-3" style={{ color }} />
          )}
        </button>
      </div>
    </div>
  );
}
