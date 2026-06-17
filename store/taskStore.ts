'use client'

import { createStore } from 'zustand'
import {
  type Task,
  type Category,
  type Session,
  TasksSchema,
  CategoriesSchema,
  SessionsSchema,
  DEFAULT_CATEGORIES,
  STORAGE_KEYS,
} from '@/types'

interface TaskStore {
  tasks: Task[]
  categories: Category[]
  sessions: Session[]
  isModalOpen: boolean

  addTask: (input: { title: string; categoryId: string; targetFocusMinutes?: number; targetCycles?: number; targetBreakMinutes?: number }) => string
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  addSession: (input: Omit<Session, 'id'>) => void
  openModal: () => void
  closeModal: () => void
  hydrate: () => void
}

function loadTasks(): Task[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tasks)
    if (!raw) return []
    return TasksSchema.parse(JSON.parse(raw))
  } catch {
    return []
  }
}

function loadCategories(): Category[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.categories)
    if (!raw) return DEFAULT_CATEGORIES
    return CategoriesSchema.parse(JSON.parse(raw))
  } catch {
    return DEFAULT_CATEGORIES
  }
}

function loadSessions(): Session[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.sessions)
    if (!raw) return []
    return SessionsSchema.parse(JSON.parse(raw))
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks))
}

function saveSessions(sessions: Session[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions))
}

export const createTaskStore = () =>
  createStore<TaskStore>()((set, get) => ({
    // SSR과 클라이언트 첫 렌더가 항상 같도록 생성 시점엔 빈 기본값만 사용하고,
    // localStorage 값은 마운트 후 hydrate()로 반영한다 (hydration mismatch 방지)
    tasks: [],
    categories: DEFAULT_CATEGORIES,
    sessions: [],
    isModalOpen: false,

    addTask: ({ title, categoryId, targetFocusMinutes, targetCycles, targetBreakMinutes }) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        categoryId,
        targetFocusMinutes: targetFocusMinutes ?? 25,
        targetCycles: targetCycles ?? 4,
        targetBreakMinutes: targetBreakMinutes ?? 5,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      const tasks = [newTask, ...get().tasks]
      saveTasks(tasks)
      set({ tasks })
      return newTask.id
    },

    toggleTask: (id) => {
      const tasks = get().tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
      saveTasks(tasks)
      set({ tasks })
    },

    deleteTask: (id) => {
      const tasks = get().tasks.filter((t) => t.id !== id)
      saveTasks(tasks)
      set({ tasks })
    },

    addSession: (input) => {
      const session: Session = { id: crypto.randomUUID(), ...input }
      const sessions = [session, ...get().sessions]
      saveSessions(sessions)
      set({ sessions })
    },

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    hydrate: () => set({ tasks: loadTasks(), categories: loadCategories(), sessions: loadSessions() }),
  }))

export type TaskStoreApi = ReturnType<typeof createTaskStore>
export type { TaskStore }
