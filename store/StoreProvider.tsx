'use client';

import { createContext, startTransition, useContext, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { createTimerStore } from './timerStore';
import { createTaskStore } from './taskStore';
import { createSettingsStore } from './settingsStore';
import type { TimerStoreApi, TimerStore } from './timerStore';
import type { TaskStoreApi, TaskStore } from './taskStore';
import type { SettingsStoreApi, SettingsStore } from './settingsStore';

const TimerStoreContext = createContext<TimerStoreApi | null>(null);

export function useTimerStore<T>(selector: (state: TimerStore) => T): T {
  const store = useContext(TimerStoreContext);
  if (!store) throw new Error('useTimerStore must be used within StoreProvider');
  return useStore(store, selector);
}

const TaskStoreContext = createContext<TaskStoreApi | null>(null);

export function useTaskStore<T>(selector: (state: TaskStore) => T): T {
  const store = useContext(TaskStoreContext);
  if (!store) throw new Error('useTaskStore must be used within StoreProvider');
  return useStore(store, selector);
}

const SettingsStoreContext = createContext<SettingsStoreApi | null>(null);

export function useSettingsStore<T>(selector: (state: SettingsStore) => T): T {
  const store = useContext(SettingsStoreContext);
  if (!store) throw new Error('useSettingsStore must be used within StoreProvider');
  return useStore(store, selector);
}

// localStorage는 마운트 후 hydrate()로 반영 (SSR 기본값 → 실제 저장값)
const HydrationContext = createContext(false);

export function useHydrated(): boolean {
  return useContext(HydrationContext);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [timerStore] = useState<TimerStoreApi>(createTimerStore);
  const [taskStore] = useState<TaskStoreApi>(createTaskStore);
  const [settingsStore] = useState<SettingsStoreApi>(createSettingsStore);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    taskStore.getState().hydrate();
    settingsStore.getState().hydrate();
    timerStore.getState().hydrate();
    startTransition(() => setHydrated(true));
  }, [taskStore, settingsStore, timerStore]);

  return (
    <TimerStoreContext.Provider value={timerStore}>
      <TaskStoreContext.Provider value={taskStore}>
        <SettingsStoreContext.Provider value={settingsStore}>
          <HydrationContext.Provider value={hydrated}>{children}</HydrationContext.Provider>
        </SettingsStoreContext.Provider>
      </TaskStoreContext.Provider>
    </TimerStoreContext.Provider>
  );
}
