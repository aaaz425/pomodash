'use client';

import { createContext, startTransition, useContext, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { createTimerStore } from './timerStore';
import { createTaskStore } from './taskStore';
import { createSettingsStore } from './settingsStore';
import type { TimerStoreApi, TimerStore } from './timerStore';
import type { TaskStoreApi, TaskStore } from './taskStore';
import type { SettingsStoreApi, SettingsStore } from './settingsStore';

// ─── Timer Store ──────────────────────────────────────────────────────────────

const TimerStoreContext = createContext<TimerStoreApi | null>(null);

export function useTimerStore<T>(selector: (state: TimerStore) => T): T {
  const store = useContext(TimerStoreContext);
  if (!store) throw new Error('useTimerStore must be used within StoreProvider');
  return useStore(store, selector);
}

// ─── Task Store ───────────────────────────────────────────────────────────────

const TaskStoreContext = createContext<TaskStoreApi | null>(null);

export function useTaskStore<T>(selector: (state: TaskStore) => T): T {
  const store = useContext(TaskStoreContext);
  if (!store) throw new Error('useTaskStore must be used within StoreProvider');
  return useStore(store, selector);
}

// ─── Settings Store ───────────────────────────────────────────────────────────

const SettingsStoreContext = createContext<SettingsStoreApi | null>(null);

export function useSettingsStore<T>(selector: (state: SettingsStore) => T): T {
  const store = useContext(SettingsStoreContext);
  if (!store) throw new Error('useSettingsStore must be used within StoreProvider');
  return useStore(store, selector);
}

// ─── Hydration Context ────────────────────────────────────────────────────────
// localStorage 기반 상태는 useEffect에서 반영되므로, 그 전까지는 기본값으로 렌더된다.
// hydrated가 true가 되면 실제 저장된 값이 적용된다.

const HydrationContext = createContext(false);

export function useHydrated(): boolean {
  return useContext(HydrationContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

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
