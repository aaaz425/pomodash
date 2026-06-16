'use client'

import { createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'
import { createTimerStore } from './timerStore'
import { createTaskStore } from './taskStore'
import type { TimerStoreApi, TimerStore } from './timerStore'
import type { TaskStoreApi, TaskStore } from './taskStore'

// ─── Timer Store ──────────────────────────────────────────────────────────────

const TimerStoreContext = createContext<TimerStoreApi | null>(null)

export function useTimerStore<T>(selector: (state: TimerStore) => T): T {
  const store = useContext(TimerStoreContext)
  if (!store) throw new Error('useTimerStore must be used within StoreProvider')
  return useStore(store, selector)
}

// ─── Task Store ───────────────────────────────────────────────────────────────

const TaskStoreContext = createContext<TaskStoreApi | null>(null)

export function useTaskStore<T>(selector: (state: TaskStore) => T): T {
  const store = useContext(TaskStoreContext)
  if (!store) throw new Error('useTaskStore must be used within StoreProvider')
  return useStore(store, selector)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [timerStore] = useState<TimerStoreApi>(createTimerStore)
  const [taskStore] = useState<TaskStoreApi>(createTaskStore)
  return (
    <TimerStoreContext.Provider value={timerStore}>
      <TaskStoreContext.Provider value={taskStore}>
        {children}
      </TaskStoreContext.Provider>
    </TimerStoreContext.Provider>
  )
}
