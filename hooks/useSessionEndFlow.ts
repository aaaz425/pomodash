'use client';

import { useState } from 'react';
import { useTimerStore } from '@/store/StoreProvider';

interface Options {
  /** true(기본): 세션 종료 요청 시 실행 중이면 pause하고, 취소 시 다시 start */
  pauseOnRequest?: boolean;
}

export function useSessionEndFlow({ pauseOnRequest = true }: Options = {}) {
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const pause = useTimerStore((s) => s.pause);
  const start = useTimerStore((s) => s.start);
  const endSession = useTimerStore((s) => s.endSession);

  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [wasRunning, setWasRunning] = useState(false);

  function requestEnd() {
    if (pauseOnRequest && isRunning) {
      pause();
      setWasRunning(true);
    }
    setShowEndConfirm(true);
  }

  function confirmEnd() {
    endSession();
    setShowEndConfirm(false);
    setWasRunning(false);
  }

  function cancelEnd() {
    if (pauseOnRequest && wasRunning) start();
    setShowEndConfirm(false);
    setWasRunning(false);
  }

  return { showEndConfirm, requestEnd, confirmEnd, cancelEnd };
}
