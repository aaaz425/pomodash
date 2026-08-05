import { createStore } from 'zustand';
import { CATEGORY_LIMITS } from '@pomodash/shared';
import { generateId } from '@/lib/generateId';
import {
  fetchTasks,
  insertTask as insertTaskRow,
  updateTask as updateTaskRow,
  deleteTask as deleteTaskRow,
  reorderTasks as reorderTasksRows,
} from '@/lib/supabase/tasks';
import {
  fetchCategories,
  insertCategory as insertCategoryRow,
  updateCategory as updateCategoryRow,
  deleteCategory as deleteCategoryRow,
  reorderCategories as reorderCategoriesRows,
} from '@/lib/supabase/categories';
import { insertSession as insertSessionRow } from '@/lib/supabase/sessions';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';

// 회원가입 시 DB 트리거(handle_new_user)가 심어주는 기본값과 이름을 맞춘 폴백 —
// fetchCategories 실패(네트워크 오류 등) 시에만 사용
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
  }) => Promise<string | null>;
  toggleTask: (id: string) => Promise<void>;
  updateTask: (
    id: string,
    patch: Partial<
      Pick<
        Task,
        'title' | 'categoryId' | 'targetFocusMinutes' | 'targetCycles' | 'targetBreakMinutes'
      >
    >,
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (fromIndex: number, toIndex: number) => Promise<void>;

  addCategory: (input: { name: string; color: Category['color'] }) => Promise<void>;
  updateCategory: (id: string, input: { name: string; color: Category['color'] }) => Promise<void>;
  deleteCategory: (id: string) => Promise<{ blocked: boolean }>;
  reorderCategories: (fromIndex: number, toIndex: number) => Promise<void>;

  addSession: (input: Omit<Session, 'id'>) => Promise<void>;

  hydrate: () => Promise<void>;
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
    categories: [],

    addTask: async ({
      title,
      categoryId,
      targetFocusMinutes,
      targetCycles,
      targetBreakMinutes,
    }) => {
      const trimmed = title.trim();
      const focus = targetFocusMinutes ?? 25;
      const cycles = targetCycles ?? 4;
      const breakMinutes = targetBreakMinutes ?? 5;
      const tempId = generateId();
      const optimisticTask: Task = {
        id: tempId,
        title: trimmed,
        categoryId,
        targetFocusMinutes: focus,
        targetCycles: cycles,
        targetBreakMinutes: breakMinutes,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      const previousTasks = get().tasks;
      const optimisticTasks = [optimisticTask, ...previousTasks];
      set({ tasks: optimisticTasks });

      const inserted = await insertTaskRow({
        title: trimmed,
        categoryId,
        targetFocusMinutes: focus,
        targetCycles: cycles,
        targetBreakMinutes: breakMinutes,
      });

      if (!inserted) {
        set({ tasks: previousTasks });
        console.warn('[taskStore] addTask 실패');
        return null;
      }

      const finalTasks = optimisticTasks.map((t) => (t.id === tempId ? inserted : t));
      set({ tasks: finalTasks });
      void reorderTasksRows(finalTasks.map((t) => t.id));
      return inserted.id;
    },

    toggleTask: async (id) => {
      const previousTasks = get().tasks;
      const task = previousTasks.find((t) => t.id === id);
      if (!task) return;
      const completed = !task.completed;
      set({ tasks: previousTasks.map((t) => (t.id === id ? { ...t, completed } : t)) });
      const { error } = await updateTaskRow(id, { completed });
      if (error) {
        set({ tasks: previousTasks });
        console.warn('[taskStore] toggleTask 실패');
      }
    },

    updateTask: async (id, patch) => {
      const previousTasks = get().tasks;
      if (!previousTasks.some((t) => t.id === id)) return;
      const title = patch.title?.trim();
      set({
        tasks: previousTasks.map((t) =>
          t.id === id ? { ...t, ...patch, title: title ?? t.title } : t,
        ),
      });
      const { error } = await updateTaskRow(id, { ...patch, title });
      if (error) {
        set({ tasks: previousTasks });
        console.warn('[taskStore] updateTask 실패');
      }
    },

    deleteTask: async (id) => {
      const previousTasks = get().tasks;
      if (!previousTasks.some((t) => t.id === id)) return;
      set({ tasks: previousTasks.filter((t) => t.id !== id) });
      const { error } = await deleteTaskRow(id);
      if (error) {
        set({ tasks: previousTasks });
        console.warn('[taskStore] deleteTask 실패');
      }
    },

    reorderTasks: async (fromIndex, toIndex) => {
      const previousTasks = get().tasks;
      const next = arrayMove(previousTasks, fromIndex, toIndex);
      set({ tasks: next });
      const { error } = await reorderTasksRows(next.map((t) => t.id));
      if (error) {
        set({ tasks: previousTasks });
        console.warn('[taskStore] reorderTasks 실패');
      }
    },

    addCategory: async ({ name, color }) => {
      const previousCategories = get().categories;
      if (previousCategories.length >= CATEGORY_LIMITS.COUNT_MAX) return;
      const trimmed = name.trim();
      const tempId = generateId();
      const optimisticCategories = [...previousCategories, { id: tempId, name: trimmed, color }];
      set({ categories: optimisticCategories });

      const inserted = await insertCategoryRow({ name: trimmed, color });
      if (!inserted) {
        set({ categories: previousCategories });
        console.warn('[taskStore] addCategory 실패');
        return;
      }
      const finalCategories = optimisticCategories.map((c) => (c.id === tempId ? inserted : c));
      set({ categories: finalCategories });
      void reorderCategoriesRows(finalCategories.map((c) => c.id));
    },

    updateCategory: async (id, { name, color }) => {
      const previousCategories = get().categories;
      if (!previousCategories.some((c) => c.id === id)) return;
      const trimmed = name.trim();
      set({
        categories: previousCategories.map((c) =>
          c.id === id ? { ...c, name: trimmed, color } : c,
        ),
      });
      const { error } = await updateCategoryRow(id, { name: trimmed, color });
      if (error) {
        set({ categories: previousCategories });
        console.warn('[taskStore] updateCategory 실패');
      }
    },

    deleteCategory: async (id) => {
      const previousCategories = get().categories;
      if (!previousCategories.some((c) => c.id === id)) return { blocked: false };

      // 참조하는 작업이 있으면 DB에서도 막히지만, 낙관적 삭제 후 롤백되는 깜빡임을 피하려고 미리 로컬에서 걸러낸다
      if (get().tasks.some((t) => t.categoryId === id)) {
        return { blocked: true };
      }

      set({ categories: previousCategories.filter((c) => c.id !== id) });
      const { error, blocked } = await deleteCategoryRow(id);
      if (error) {
        set({ categories: previousCategories });
        console.warn('[taskStore] deleteCategory 실패');
      }
      return { blocked };
    },

    reorderCategories: async (fromIndex, toIndex) => {
      const previousCategories = get().categories;
      const next = arrayMove(previousCategories, fromIndex, toIndex);
      set({ categories: next });
      const { error } = await reorderCategoriesRows(next.map((c) => c.id));
      if (error) {
        set({ categories: previousCategories });
        console.warn('[taskStore] reorderCategories 실패');
      }
    },

    addSession: async (input) => {
      const inserted = await insertSessionRow(input);
      if (!inserted) {
        console.warn('[taskStore] addSession 실패');
      }
    },

    hydrate: async () => {
      const [tasks, categories] = await Promise.all([fetchTasks(), fetchCategories()]);
      set({
        tasks: tasks ?? [],
        categories: categories ?? DEFAULT_CATEGORIES,
      });
    },
  }));

export type TaskStoreApi = ReturnType<typeof createTaskStore>;
export type { TaskStore };
