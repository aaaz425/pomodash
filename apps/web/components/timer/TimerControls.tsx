'use client';

import { useState } from 'react';
import { Maximize2, Play, Pause, Square } from 'lucide-react';
import { useTimerStore } from '@/store/StoreProvider';
import { useTimer } from '@/hooks/useTimer';
import { useSessionEndFlow } from '@/hooks/useSessionEndFlow';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { StartSessionModal } from '@/components/timer/StartSessionModal';
import { Button } from '@/components/ui/button';
import { formatSessionEndSummary } from '@/lib/sessionUtils';

export function TimerControls() {
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const sessionStarted = useTimerStore((s) => s.sessionStarted);
  const settings = useTimerStore((s) => s.settings);
  const mode = useTimerStore((s) => s.mode);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const enterFocusMode = useTimerStore((s) => s.enterFocusMode);
  const { cycleCount, elapsedMinutes } = useTimer();
  const { showEndConfirm, requestEnd, confirmEnd, cancelEnd } = useSessionEndFlow();
  const [showStartModal, setShowStartModal] = useState(false);

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
        onClick={requestEnd}
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
        description={formatSessionEndSummary(
          mode,
          elapsedMinutes,
          cycleCount,
          settings.totalCycles,
        )}
        confirmLabel="세션 종료"
        onConfirm={confirmEnd}
        onCancel={cancelEnd}
      />
    </div>
  );
}
