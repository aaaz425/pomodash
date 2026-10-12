'use client';

import { createTimerStore as createSharedTimerStore } from '@pomoroutine/shared';
import type { TimerStorePorts, TimerSnapshot } from '@pomoroutine/shared';
import { ActiveTimerStateSchema, STORAGE_KEYS } from '@/types';
import { toast } from 'sonner';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

export const createTimerStore = () => {
  const ports: TimerStorePorts = {
    persistSnapshot: (snapshot) => saveToStorage(STORAGE_KEYS.activeTimer, snapshot),
    loadSnapshot: (fallback: TimerSnapshot) =>
      loadFromStorage(STORAGE_KEYS.activeTimer, ActiveTimerStateSchema, fallback),
    onSessionTooShort: () => toast('30초 미만은 기록되지 않아요'),
  };
  return createSharedTimerStore(ports);
};

export type { TimerStore, TimerStoreApi } from '@pomoroutine/shared';
