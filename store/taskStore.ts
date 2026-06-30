'use client';

import { createStore } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { trackEvent, EVENTS } from '@/config/analytics';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import {
  type Task,
  type Category,
  type Session,
  TasksSchema,
  CategoriesSchema,
  SessionsSchema,
  DEFAULT_CATEGORIES,
  STORAGE_KEYS,
} from '@/types';

interface TaskStore {
  tasks: Task[];
  categories: Category[];
  sessions: Session[];

  addTask: (input: {
    title: string;
    categoryId: string;
    targetFocusMinutes?: number;
    targetCycles?: number;
    targetBreakMinutes?: number;
  }) => string;
  toggleTask: (id: string) => void;
  updateTask: (
    id: string,
    patch: Partial<
      Pick<
        Task,
        'title' | 'categoryId' | 'targetFocusMinutes' | 'targetCycles' | 'targetBreakMinutes'
      >
    >,
  ) => void;
  deleteTask: (id: string) => void;
  addSession: (input: Omit<Session, 'id'>) => void;
  updateSessionNote: (id: string, note: string | null) => void;
  deleteSession: (id: string) => void;
  reorderTasks: (activeId: string, overId: string) => void;
  addCategory: (input: { name: string; color: string }) => void;
  updateCategory: (id: string, input: { name: string; color: string }) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (activeId: string, overId: string) => void;
  hydrate: () => void;
}

const saveTasks = (tasks: Task[]) => saveToStorage(STORAGE_KEYS.tasks, tasks);
const saveSessions = (sessions: Session[]) => saveToStorage(STORAGE_KEYS.sessions, sessions);
const saveCategories = (categories: Category[]) =>
  saveToStorage(STORAGE_KEYS.categories, categories);

export const createTaskStore = () =>
  createStore<TaskStore>()((set, get) => ({
    // SSR hydration mismatch 방지 — localStorage는 hydrate()로 반영
    tasks: [],
    categories: DEFAULT_CATEGORIES,
    sessions: [],

    addTask: ({ title, categoryId, targetFocusMinutes, targetCycles, targetBreakMinutes }) => {
      const newTask: Task = {
        id: generateId(),
        title: title.trim(),
        categoryId,
        targetFocusMinutes: targetFocusMinutes ?? 25,
        targetCycles: targetCycles ?? 4,
        targetBreakMinutes: targetBreakMinutes ?? 5,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      const tasks = [newTask, ...get().tasks];
      saveTasks(tasks);
      set({ tasks });
      trackEvent(EVENTS.TASK_CREATED);
      return newTask.id;
    },

    toggleTask: (id) => {
      const tasks = get().tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      saveTasks(tasks);
      set({ tasks });
    },

    updateTask: (id, patch) => {
      const tasks = get().tasks.map((t) =>
        t.id === id ? { ...t, ...patch, title: patch.title?.trim() ?? t.title } : t,
      );
      saveTasks(tasks);
      set({ tasks });
    },

    deleteTask: (id) => {
      const tasks = get().tasks.filter((t) => t.id !== id);
      saveTasks(tasks);
      set({ tasks });
    },

    addSession: (input) => {
      const session: Session = { id: generateId(), ...input };
      const sessions = [session, ...get().sessions];
      saveSessions(sessions);
      set({ sessions });
    },

    updateSessionNote: (id, note) => {
      const sessions = get().sessions.map((s) =>
        s.id === id ? { ...s, note: note?.trim() || null } : s,
      );
      saveSessions(sessions);
      set({ sessions });
      if (note?.trim()) trackEvent(EVENTS.SESSION_NOTE_WRITTEN);
    },

    deleteSession: (id) => {
      const sessions = get().sessions.filter((s) => s.id !== id);
      saveSessions(sessions);
      set({ sessions });
    },

    reorderTasks: (activeId, overId) => {
      const { tasks } = get();
      const from = tasks.findIndex((t) => t.id === activeId);
      const to = tasks.findIndex((t) => t.id === overId);
      if (from === -1 || to === -1) return;
      const next = arrayMove(tasks, from, to);
      saveTasks(next);
      set({ tasks: next });
    },

    addCategory: ({ name, color }) => {
      if (get().categories.length >= 10) return;
      const categories = [...get().categories, { id: generateId(), name: name.trim(), color }];
      saveCategories(categories);
      set({ categories });
    },

    updateCategory: (id, { name, color }) => {
      const categories = get().categories.map((c) =>
        c.id === id ? { ...c, name: name.trim(), color } : c,
      );
      saveCategories(categories);
      set({ categories });
    },

    deleteCategory: (id) => {
      const categories = get().categories.filter((c) => c.id !== id);
      saveCategories(categories);
      set({ categories });
    },

    reorderCategories: (activeId, overId) => {
      const { categories } = get();
      const from = categories.findIndex((c) => c.id === activeId);
      const to = categories.findIndex((c) => c.id === overId);
      if (from === -1 || to === -1) return;
      const next = arrayMove(categories, from, to);
      saveCategories(next);
      set({ categories: next });
    },

    hydrate: () =>
      set({
        tasks: loadFromStorage(STORAGE_KEYS.tasks, TasksSchema, []),
        categories: loadFromStorage(STORAGE_KEYS.categories, CategoriesSchema, DEFAULT_CATEGORIES),
        sessions: loadFromStorage(STORAGE_KEYS.sessions, SessionsSchema, []),
      }),
  }));

export type TaskStoreApi = ReturnType<typeof createTaskStore>;
export type { TaskStore };
