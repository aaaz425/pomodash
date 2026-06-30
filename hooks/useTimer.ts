'use client';

import { useEffect, useRef, useState } from 'react';
import { useTimerStore, useSettingsStore } from '@/store/StoreProvider';
import { playAlarm, sendNotification } from '@/lib/notifications';

export function useTimer() {
  const startedAt = useTimerStore((s) => s.startedAt);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const phase = useTimerStore((s) => s.phase);
  const cycleCount = useTimerStore((s) => s.cycleCount);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);
  const focusMinutes = useTimerStore((s) => s.settings.focusMinutes);
  const complete = useTimerStore((s) => s.complete);

  const soundAlert = useSettingsStore((s) => s.soundAlert);
  const soundType = useSettingsStore((s) => s.soundType);
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const soundRepeatCount = useSettingsStore((s) => s.soundRepeatCount);
  const browserNotification = useSettingsStore((s) => s.browserNotification);

  // 같은 완료 이벤트에서 중복 알림 방지
  const notifiedRef = useRef(false);

  // tick에서만 업데이트하는 디스플레이 값
  const [runningDisplay, setRunningDisplay] = useState(remainingSeconds);

  useEffect(() => {
    notifiedRef.current = false;

    if (!startedAt) return;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, remainingSeconds - elapsed);
      setRunningDisplay(remaining);

      if (remaining === 0) {
        if (!notifiedRef.current) {
          notifiedRef.current = true;
          if (soundAlert)
            playAlarm({ type: soundType, volume: soundVolume, repeatCount: soundRepeatCount });
          if (browserNotification) {
            const isLastCycle = phase === 'focus' && cycleCount + 1 >= totalCycles;
            let title: string;
            let body: string;
            if (isLastCycle) {
              title = '세션 완료!';
              body = '모든 사이클을 마쳤어요. 수고했어요!';
            } else if (phase === 'focus') {
              title = '집중 시간 종료!';
              body = '잠깐 쉬어가세요.';
            } else {
              title = '휴식 종료!';
              body = '다시 집중할 시간이에요.';
            }
            sendNotification(title, body);
          }
        }
        complete();
      }
    };

    // 첫 tick 비동기화 — effect 내 동기 setState 방지
    const firstTick = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(firstTick);
      clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [
    startedAt,
    remainingSeconds,
    complete,
    phase,
    cycleCount,
    totalCycles,
    soundAlert,
    soundType,
    soundVolume,
    soundRepeatCount,
    browserNotification,
  ]);

  // 정지 중엔 store 값 직접 사용 (렌더 중 Date.now() 금지)
  const displaySeconds = startedAt !== null ? runningDisplay : remainingSeconds;

  const elapsedMinutes =
    cycleCount * focusMinutes +
    (phase === 'focus' ? Math.max(0, Math.floor((focusMinutes * 60 - displaySeconds) / 60)) : 0);

  return {
    displaySeconds,
    isRunning: startedAt !== null,
    phase,
    cycleCount,
    elapsedMinutes,
  };
}
