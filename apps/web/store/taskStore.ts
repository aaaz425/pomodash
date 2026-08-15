'use client';

import { createStore } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { generateId } from '@/lib/utils';
import { INPUT_LIMITS } from '@/lib/constants/limits';
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
import {
  fetchSessions,
  insertSession as insertSessionRow,
  updateSession as updateSessionRow,
  deleteSession as deleteSessionRow,
} from '@/lib/supabase/sessions';
import { type Task, type Category, type Session, DEFAULT_CATEGORIES } from '@/types';

const CATEGORY_IN_USE_MESSAGE =
  '이 카테고리를 쓰는 작업이 있어요. 작업을 먼저 옮기거나 삭제해주세요';

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
  /** 성공 여부를 반환 — 실패 시 호출부가 폼을 유지하고 재시도할 수 있도록 함 */
  addSession: (input: Omit<Session, 'id'>) => Promise<boolean>;
  updateSessionFields: (
    id: string,
    patch: Partial<Pick<Session, 'title' | 'note' | 'focusRating' | 'distractionTags'>>,
  ) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  reorderTasks: (activeId: string, overId: string) => Promise<void>;
  addCategory: (input: { name: string; color: string }) => Promise<void>;
  updateCategory: (id: string, input: { name: string; color: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (activeId: string, overId: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const createTaskStore = () =>
  createStore<TaskStore>()((set, get) => ({
    // SSR hydration mismatch 방지 — 실제 데이터는 hydrate()로 반영
    tasks: [],
    categories: DEFAULT_CATEGORIES,
    sessions: [],

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
        toast('작업 추가에 실패했어요. 다시 시도해주세요');
        return null;
      }

      const finalTasks = optimisticTasks.map((t) => (t.id === tempId ? inserted : t));
      set({ tasks: finalTasks });
      // 새 작업이 맨 앞으로 온 순서를 position에 반영 — 실패해도 다음 재정렬 때 자연히 맞춰짐
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
        toast('작업 저장에 실패했어요. 다시 시도해주세요');
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
        toast('작업 저장에 실패했어요. 다시 시도해주세요');
      }
    },

    deleteTask: async (id) => {
      const previousTasks = get().tasks;
      if (!previousTasks.some((t) => t.id === id)) return;
      set({ tasks: previousTasks.filter((t) => t.id !== id) });
      const { error } = await deleteTaskRow(id);
      if (error) {
        set({ tasks: previousTasks });
        toast('작업 삭제에 실패했어요. 다시 시도해주세요');
      }
    },

    addSession: async (input) => {
      const tempId = generateId();
      const previousSessions = get().sessions;
      set({ sessions: [{ id: tempId, ...input }, ...previousSessions] });

      const inserted = await insertSessionRow(input);
      if (!inserted) {
        set({ sessions: previousSessions });
        toast('세션 저장에 실패했어요');
        return false;
      }
      set({ sessions: [inserted, ...previousSessions] });
      return true;
    },

    updateSessionFields: async (id, patch) => {
      const previousSessions = get().sessions;
      if (!previousSessions.some((s) => s.id === id)) return;
      set({
        sessions: previousSessions.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      });
      const { error } = await updateSessionRow(id, patch);
      if (error) {
        set({ sessions: previousSessions });
        toast('세션 저장에 실패했어요');
      }
    },

    deleteSession: async (id) => {
      const previousSessions = get().sessions;
      if (!previousSessions.some((s) => s.id === id)) return;
      set({ sessions: previousSessions.filter((s) => s.id !== id) });
      const { error } = await deleteSessionRow(id);
      if (error) {
        set({ sessions: previousSessions });
        toast('세션 삭제에 실패했어요');
      }
    },

    reorderTasks: async (activeId, overId) => {
      const previousTasks = get().tasks;
      const from = previousTasks.findIndex((t) => t.id === activeId);
      const to = previousTasks.findIndex((t) => t.id === overId);
      if (from === -1 || to === -1) return;
      const next = arrayMove(previousTasks, from, to);
      set({ tasks: next });
      const { error } = await reorderTasksRows(next.map((t) => t.id));
      if (error) {
        set({ tasks: previousTasks });
        toast('순서 저장에 실패했어요');
      }
    },

    addCategory: async ({ name, color }) => {
      const previousCategories = get().categories;
      if (previousCategories.length >= INPUT_LIMITS.CATEGORIES_MAX) return;
      const trimmed = name.trim();
      const tempId = generateId();
      const optimisticCategories = [...previousCategories, { id: tempId, name: trimmed, color }];
      set({ categories: optimisticCategories });

      const inserted = await insertCategoryRow({ name: trimmed, color });
      if (!inserted) {
        set({ categories: previousCategories });
        toast('카테고리 추가에 실패했어요. 다시 시도해주세요');
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
        toast('카테고리 저장에 실패했어요. 다시 시도해주세요');
      }
    },

    deleteCategory: async (id) => {
      const previousCategories = get().categories;
      if (!previousCategories.some((c) => c.id === id)) return;

      // 참조하는 작업이 있으면 DB에서 어차피 막히는데, 먼저 지웠다가 롤백되면 화면이 깜빡여서
      // 로컬에 이미 있는 tasks로 미리 걸러 낙관적 삭제 자체를 생략한다(DB 체크는 안전망으로 유지)
      if (get().tasks.some((t) => t.categoryId === id)) {
        toast(CATEGORY_IN_USE_MESSAGE);
        return;
      }

      set({ categories: previousCategories.filter((c) => c.id !== id) });
      const { error, blocked } = await deleteCategoryRow(id);
      if (error) {
        set({ categories: previousCategories });
        toast(blocked ? CATEGORY_IN_USE_MESSAGE : '카테고리 삭제에 실패했어요. 다시 시도해주세요');
      }
    },

    reorderCategories: async (activeId, overId) => {
      const previousCategories = get().categories;
      const from = previousCategories.findIndex((c) => c.id === activeId);
      const to = previousCategories.findIndex((c) => c.id === overId);
      if (from === -1 || to === -1) return;
      const next = arrayMove(previousCategories, from, to);
      set({ categories: next });
      const { error } = await reorderCategoriesRows(next.map((c) => c.id));
      if (error) {
        set({ categories: previousCategories });
        toast('순서 저장에 실패했어요');
      }
    },

    hydrate: async () => {
      const [tasksResult, categoriesResult, sessionsResult] = await Promise.all([
        fetchTasks(),
        fetchCategories(),
        fetchSessions(),
      ]);
      set({
        tasks: tasksResult?.tasks ?? [],
        categories: categoriesResult?.categories ?? DEFAULT_CATEGORIES,
        sessions: sessionsResult?.sessions ?? [],
      });

      // 형식이 안 맞는 데이터가 있어 일부 항목이 조용히 빠졌을 때 사용자에게 알림
      const invalidCount =
        (tasksResult?.invalidCount ?? 0) +
        (categoriesResult?.invalidCount ?? 0) +
        (sessionsResult?.invalidCount ?? 0);
      if (invalidCount > 0) {
        toast(`형식이 맞지 않아 불러오지 못한 기록이 ${invalidCount}건 있어요`);
      }
    },
  }));

export type TaskStoreApi = ReturnType<typeof createTaskStore>;
export type { TaskStore };
