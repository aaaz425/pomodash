import { createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';
import { createTimerStore } from '@/store/timerStore';
import { createTaskStore } from '@/store/taskStore';
import type { TimerStoreApi, TimerStore } from '@/store/timerStore';
import type { TaskStoreApi, TaskStore } from '@/store/taskStore';

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

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [timerStore] = useState<TimerStoreApi>(createTimerStore);
  const [taskStore] = useState<TaskStoreApi>(createTaskStore);

  return (
    <TimerStoreContext.Provider value={timerStore}>
      <TaskStoreContext.Provider value={taskStore}>{children}</TaskStoreContext.Provider>
    </TimerStoreContext.Provider>
  );
}
