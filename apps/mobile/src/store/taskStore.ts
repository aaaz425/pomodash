import { createStore } from 'zustand';
import { CATEGORY_LIMITS } from '@pomodash/shared';
import { generateId } from '@/lib/generateId';
import type { Task, Category } from '@/types/tasks';

// 이번 브랜치는 로컬 상태만 다룸 — Supabase 연동은 rn-sync에서 추가(로그인 없이는 RLS로 접근 자체가 불가)
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '공부', color: 'blue' },
  { id: '2', name: '업무', color: 'green' },
  { id: '3', name: '운동', color: 'orange' },
  { id: '4', name: '독서', color: 'purple' },
  { id: '5', name: '기타', color: 'gray' },
];

interface TaskStore {
  tasks: Task[];
  categories: Category[];

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
  reorderTasks: (fromIndex: number, toIndex: number) => void;

  addCategory: (input: { name: string; color: Category['color'] }) => void;
  updateCategory: (id: string, input: { name: string; color: Category['color'] }) => void;
  deleteCategory: (id: string) => { blocked: boolean };
  reorderCategories: (fromIndex: number, toIndex: number) => void;
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export const createTaskStore = () =>
  createStore<TaskStore>()((set, get) => ({
    tasks: [],
    categories: DEFAULT_CATEGORIES,

    addTask: ({ title, categoryId, targetFocusMinutes, targetCycles, targetBreakMinutes }) => {
      const id = generateId();
      const task: Task = {
        id,
        title: title.trim(),
        categoryId,
        targetFocusMinutes: targetFocusMinutes ?? 25,
        targetCycles: targetCycles ?? 4,
        targetBreakMinutes: targetBreakMinutes ?? 5,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      set({ tasks: [task, ...get().tasks] });
      return id;
    },

    toggleTask: (id) => {
      set({
        tasks: get().tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      });
    },

    updateTask: (id, patch) => {
      const title = patch.title?.trim();
      set({
        tasks: get().tasks.map((t) =>
          t.id === id ? { ...t, ...patch, title: title ?? t.title } : t,
        ),
      });
    },

    deleteTask: (id) => {
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
    },

    reorderTasks: (fromIndex, toIndex) => {
      set({ tasks: arrayMove(get().tasks, fromIndex, toIndex) });
    },

    addCategory: ({ name, color }) => {
      const categories = get().categories;
      if (categories.length >= CATEGORY_LIMITS.COUNT_MAX) return;
      set({ categories: [...categories, { id: generateId(), name: name.trim(), color }] });
    },

    updateCategory: (id, { name, color }) => {
      set({
        categories: get().categories.map((c) =>
          c.id === id ? { ...c, name: name.trim(), color } : c,
        ),
      });
    },

    deleteCategory: (id) => {
      if (get().tasks.some((t) => t.categoryId === id)) {
        return { blocked: true };
      }
      set({ categories: get().categories.filter((c) => c.id !== id) });
      return { blocked: false };
    },

    reorderCategories: (fromIndex, toIndex) => {
      set({ categories: arrayMove(get().categories, fromIndex, toIndex) });
    },
  }));

export type TaskStoreApi = ReturnType<typeof createTaskStore>;
export type { TaskStore };
