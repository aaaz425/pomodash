'use client';

import { useEffect, useRef } from 'react';
import { deriveTimerDisplay } from '@pomodash/shared';
import { useTimerStore, useSettingsStore, useHydrated } from '@/store/StoreProvider';
import { playAlarm, sendNotification } from '@/lib/notifications';

// 싱글턴 tick 소유자 — layout에 한 번만 마운트. 개별 컴포넌트는 useTimer()로 읽기만 한다.
export function TimerEngine() {
  const hydrated = useHydrated();
  const startedAt = useTimerStore((s) => s.startedAt);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const phase = useTimerStore((s) => s.phase);
  const mode = useTimerStore((s) => s.mode);
  const cycleCount = useTimerStore((s) => s.cycleCount);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);
  const focusMinutes = useTimerStore((s) => s.settings.focusMinutes);
  const accFocusSeconds = useTimerStore((s) => s.accFocusSeconds);
  const complete = useTimerStore((s) => s.complete);
  const setRunningDisplaySeconds = useTimerStore((s) => s.setRunningDisplaySeconds);

  const soundAlert = useSettingsStore((s) => s.soundAlert);
  const soundType = useSettingsStore((s) => s.soundType);
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const soundRepeatCount = useSettingsStore((s) => s.soundRepeatCount);
  const browserNotification = useSettingsStore((s) => s.browserNotification);

  // 같은 완료 이벤트에서 중복 알림 방지 — 싱글턴이라 인스턴스 간 경합 없음
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!hydrated || !startedAt) {
      setRunningDisplaySeconds(null);
      return;
    }

    notifiedRef.current = false;

    const tick = () => {
      const result = deriveTimerDisplay({
        phase,
        mode,
        remainingSeconds,
        startedAt,
        accFocusSeconds,
        cycleCount,
        focusMinutes,
        now: Date.now(),
      });

      setRunningDisplaySeconds(result.displaySeconds);

      if (result.justCompleted) {
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
    hydrated,
    startedAt,
    remainingSeconds,
    complete,
    phase,
    mode,
    accFocusSeconds,
    cycleCount,
    focusMinutes,
    totalCycles,
    soundAlert,
    soundType,
    soundVolume,
    soundRepeatCount,
    browserNotification,
    setRunningDisplaySeconds,
  ]);

  return null;
}
