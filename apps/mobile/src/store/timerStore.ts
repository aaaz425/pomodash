import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTimerStore as createSharedTimerStore } from '@pomodash/shared';
import type { TimerStorePorts, TimerSnapshot } from '@pomodash/shared';
import { ActiveTimerStateSchema } from '@/types/timer';
import { toast } from '@/lib/toast';

// 계정과 무관하게 저장되므로 로그아웃/탈퇴 시 AuthProvider에서 반드시 정리해야 함(다음 사용자에게 이전 세션이 새는 것 방지)
export const ACTIVE_TIMER_STORAGE_KEY = 'pomodash:active-timer';

// AsyncStorage는 비동기라 공유 스토어의 동기 loadSnapshot 포트 시그니처에 그대로 못 꽂는다.
// StoreProvider가 hydrate() 호출 전에 preloadTimerSnapshot()으로 먼저 읽어 동기 캐시를 채워둔다.
let cachedSnapshot: TimerSnapshot | null = null;

export async function preloadTimerSnapshot(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_TIMER_STORAGE_KEY);
    if (!raw) return;
    const parsed = ActiveTimerStateSchema.safeParse(JSON.parse(raw));
    if (parsed.success) cachedSnapshot = parsed.data;
  } catch {
    // 파싱 실패 시 캐시 없음 — hydrate()가 fallback(현재 상태)을 그대로 사용
  }
}

export const createTimerStore = () => {
  const ports: TimerStorePorts = {
    persistSnapshot: (snapshot) => {
      void AsyncStorage.setItem(ACTIVE_TIMER_STORAGE_KEY, JSON.stringify(snapshot));
    },
    loadSnapshot: (fallback) => cachedSnapshot ?? fallback,
    onSessionTooShort: () => toast('5초 미만 세션은 기록되지 않아요'),
  };
  return createSharedTimerStore(ports);
};

export type { TimerStore, TimerStoreApi } from '@pomodash/shared';
