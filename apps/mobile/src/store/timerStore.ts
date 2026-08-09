import { createTimerStore as createSharedTimerStore } from '@pomodash/shared';
import type { TimerStorePorts } from '@pomodash/shared';
import { toast } from '@/lib/toast';

// persistSnapshot/loadSnapshot은 아직 없음 — AsyncStorage가 비동기라 공유 스토어의
// 동기 loadSnapshot 포트 시그니처에 그대로 못 꽂음(추후 별도 검토, feat/rn-session-record 계획 참고)
export const createTimerStore = () => {
  const ports: TimerStorePorts = {
    onSessionTooShort: () => toast('5초 미만 세션은 기록되지 않아요'),
  };
  return createSharedTimerStore(ports);
};

export type { TimerStore, TimerStoreApi } from '@pomodash/shared';
