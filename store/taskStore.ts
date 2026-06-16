'use client'

import { createStore } from 'zustand'
import {
  type Task,
  type Category,
  TasksSchema,
  CategoriesSchema,
  DEFAULT_CATEGORIES,
  STORAGE_KEYS,
} from '@/types'

interface TaskStore {
  tasks: Task[]
  categories: Category[]
  isModalOpen: boolean

  addTask: (input: { title: string; categoryId: string; targetFocusMinutes?: number; targetCycles?: number; targetBreakMinutes?: number }) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  openModal: () => void
  closeModal: () => void
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

function saveTasks(tasks: Task[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks))
}

export const createTaskStore = () =>
  createStore<TaskStore>()((set, get) => ({
    tasks: loadTasks(),
    categories: loadCategories(),
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

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
  }))

export type TaskStoreApi = ReturnType<typeof createTaskStore>
export type { TaskStore }
