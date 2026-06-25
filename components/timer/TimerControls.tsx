'use client';

import { useState } from 'react';
import { Maximize2, Play, Pause, Square } from 'lucide-react';
import { useTimerStore } from '@/store/StoreProvider';
import { useTimer } from '@/hooks/useTimer';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { StartSessionModal } from '@/components/timer/StartSessionModal';
import { Button } from '@/components/ui/button';

export function TimerControls() {
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const sessionStarted = useTimerStore((s) => s.sessionStarted);
  const settings = useTimerStore((s) => s.settings);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const endSession = useTimerStore((s) => s.endSession);
  const enterFocusMode = useTimerStore((s) => s.enterFocusMode);
  const { displaySeconds, phase, cycleCount } = useTimer();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [wasRunning, setWasRunning] = useState(false);

  function handleStartClick() {
    if (isRunning) {
      pause();
      return;
    }
    if (!sessionStarted) {
      setShowStartModal(true);
      return;
    }
    start();
  }

  const elapsedMinutes =
    cycleCount * settings.focusMinutes +
    (phase === 'focus'
      ? Math.max(0, Math.floor((settings.focusMinutes * 60 - displaySeconds) / 60))
      : 0);

  return (
    <div className="flex items-center gap-1.5">
      <Button
        disabled={!isRunning}
        onClick={enterFocusMode}
        aria-label="집중 모드"
        variant="outline"
        size="lg"
        className="gap-1.5 px-3 py-2.5 text-muted-foreground whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        집중
      </Button>

      <button
        onClick={handleStartClick}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold whitespace-nowrap transition-colors hover:bg-primary/90 active:bg-primary/80"
      >
        {isRunning ? (
          <Pause className="w-3.5 h-3.5" fill="currentColor" />
        ) : (
          <Play className="w-3.5 h-3.5" fill="currentColor" />
        )}
        {isRunning ? '일시정지' : '시작'}
      </button>

      <Button
        disabled={!sessionStarted}
        onClick={() => {
          const running = isRunning;
          if (running) pause();
          setWasRunning(running);
          setShowEndConfirm(true);
        }}
        variant="outline"
        size="lg"
        className="gap-1.5 px-3 py-2.5 text-muted-foreground whitespace-nowrap hover:bg-transparent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-muted-foreground"
      >
        <Square className="w-3.5 h-3.5" fill="currentColor" />
        세션 종료
      </Button>

      {showStartModal && <StartSessionModal onClose={() => setShowStartModal(false)} />}

      <ConfirmDialog
        open={showEndConfirm}
        title="세션을 종료할까요?"
        description={
          <>
            지금까지 {elapsedMinutes}분 · {cycleCount} / {settings.totalCycles}사이클 진행했어요
          </>
        }
        confirmLabel="세션 종료"
        onConfirm={() => {
          endSession();
          setShowEndConfirm(false);
        }}
        onCancel={() => {
          if (wasRunning) start();
          setShowEndConfirm(false);
        }}
      />
    </div>
  );
}
