import { createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';
import { createTimerStore } from '@/store/timerStore';
import type { TimerStoreApi, TimerStore } from '@/store/timerStore';

const TimerStoreContext = createContext<TimerStoreApi | null>(null);

export function useTimerStore<T>(selector: (state: TimerStore) => T): T {
  const store = useContext(TimerStoreContext);
  if (!store) throw new Error('useTimerStore must be used within StoreProvider');
  return useStore(store, selector);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [timerStore] = useState<TimerStoreApi>(createTimerStore);

  return <TimerStoreContext.Provider value={timerStore}>{children}</TimerStoreContext.Provider>;
}
