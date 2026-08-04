import { createContext, useContext, useEffect, useState } from 'react';
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

  // StoreProvider는 인증된 상태에서만 마운트되므로(app 그룹 레이아웃의 게이트) 여기선 바로 조회해도 안전.
  // 로그아웃 시엔 이 컴포넌트 자체가 언마운트되며 스토어도 함께 버려지므로 별도 reset은 불필요.
  useEffect(() => {
    taskStore.getState().hydrate();
  }, [taskStore]);

  return (
    <TimerStoreContext.Provider value={timerStore}>
      <TaskStoreContext.Provider value={taskStore}>{children}</TaskStoreContext.Provider>
    </TimerStoreContext.Provider>
  );
}
