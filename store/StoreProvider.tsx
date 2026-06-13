'use client'

import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'
import { createTimerStore } from './timerStore'
import type { TimerStoreApi, TimerStore } from './timerStore'

const TimerStoreContext = createContext<TimerStoreApi | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<TimerStoreApi | null>(null)
  if (!storeRef.current) storeRef.current = createTimerStore()
  return (
    <TimerStoreContext.Provider value={storeRef.current}>
      {children}
    </TimerStoreContext.Provider>
  )
}

export function useTimerStore<T>(selector: (state: TimerStore) => T): T {
  const store = useContext(TimerStoreContext)
  if (!store) throw new Error('useTimerStore must be used within StoreProvider')
  return useStore(store, selector)
}
