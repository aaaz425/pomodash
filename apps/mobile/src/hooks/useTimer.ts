import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { deriveTimerDisplay } from '@pomodash/shared';
import { useTimerStore, useSettingsStore } from '@/store/StoreProvider';
import {
  scheduleTimerCompleteNotification,
  cancelScheduledNotification,
} from '@/lib/notifications';
import { playAlarm } from '@/lib/sound';

export function useTimer() {
  const startedAt = useTimerStore((s) => s.startedAt);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const phase = useTimerStore((s) => s.phase);
  const mode = useTimerStore((s) => s.mode);
  const cycleCount = useTimerStore((s) => s.cycleCount);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);
  const focusMinutes = useTimerStore((s) => s.settings.focusMinutes);
  const accFocusSeconds = useTimerStore((s) => s.accFocusSeconds);
  const complete = useTimerStore((s) => s.complete);
  const soundAlert = useSettingsStore((s) => s.soundAlert);
  const soundType = useSettingsStore((s) => s.soundType);
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const soundRepeatCount = useSettingsStore((s) => s.soundRepeatCount);

  // 같은 완료 이벤트에서 complete()가 중복 호출되지 않도록 방지
  const notifiedRef = useRef(false);

  // tick에서만 업데이트하는 디스플레이 값
  const [runningDisplay, setRunningDisplay] = useState(remainingSeconds);

  useEffect(() => {
    if (!startedAt) return;

    notifiedRef.current = false;
    let scheduledId: string | null = null;

    // 앱이 백그라운드에 있어도 phase 종료를 알 수 있도록 시작 시점에 미리 예약
    // free 모드는 자동 완료가 없으므로(사용자가 직접 종료) 예약하지 않음
    if (mode === 'pomodoro') {
      const isLastCycle = phase === 'focus' && cycleCount + 1 >= totalCycles;
      const title = isLastCycle
        ? '세션 완료!'
        : phase === 'focus'
          ? '집중 시간 종료!'
          : '휴식 종료!';
      const body = isLastCycle
        ? '모든 사이클을 마쳤어요. 수고했어요!'
        : phase === 'focus'
          ? '잠깐 쉬어가세요.'
          : '다시 집중할 시간이에요.';
      scheduleTimerCompleteNotification({
        title,
        body,
        secondsFromNow: remainingSeconds,
        sound: soundAlert,
      }).then((id) => {
        scheduledId = id;
      });
    }

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

      setRunningDisplay(result.displaySeconds);

      if (result.justCompleted && !notifiedRef.current) {
        notifiedRef.current = true;
        complete();
        if (soundAlert) {
          void playAlarm({
            type: soundType,
            volume: soundVolume,
            repeatCount: soundRepeatCount,
          });
        }
      }
    };

    // 첫 tick 비동기화 — effect 내 동기 setState 방지
    const firstTick = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);

    // 앱이 포그라운드로 복귀하면 즉시 재계산 (웹의 visibilitychange에 대응)
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') tick();
    });

    return () => {
      clearTimeout(firstTick);
      clearInterval(id);
      subscription.remove();
      cancelScheduledNotification(scheduledId);
    };
  }, [
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
  ]);

  // 정지 중엔 store 값 직접 사용
  const displaySeconds =
    mode === 'free'
      ? startedAt !== null
        ? runningDisplay
        : accFocusSeconds
      : startedAt !== null
        ? runningDisplay
        : remainingSeconds;

  const elapsedMinutes =
    mode === 'free'
      ? Math.floor(displaySeconds / 60)
      : cycleCount * focusMinutes +
        (phase === 'focus'
          ? Math.max(0, Math.floor((focusMinutes * 60 - displaySeconds) / 60))
          : 0);

  return {
    displaySeconds,
    isRunning: startedAt !== null,
    phase,
    mode,
    cycleCount,
    elapsedMinutes,
  };
}
