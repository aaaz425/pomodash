import { createTimerStore as createSharedTimerStore } from '@pomodash/shared';
import type { TimerStorePorts } from '@pomodash/shared';

// persistSnapshot/loadSnapshot은 아직 없음 — AsyncStorage가 비동기라 공유 스토어의
// 동기 loadSnapshot 포트 시그니처에 그대로 못 꽂음(추후 별도 검토, feat/rn-session-record 계획 참고)
export const createTimerStore = () => {
  const ports: TimerStorePorts = {
    onSessionTooShort: () => console.warn('[timerStore] 5초 미만 세션은 기록되지 않음'),
  };
  return createSharedTimerStore(ports);
};

export type { TimerStore, TimerStoreApi } from '@pomodash/shared';
