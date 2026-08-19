import { createStore } from 'zustand';
import { CATEGORY_LIMITS } from '@pomodash/shared';
import { generateId } from '@/lib/generateId';
import { toast } from '@/lib/toast';
import { withRetry } from '@/lib/retry';
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
  reorderTasks: (fromIndex: number, toIndex: number) => Promise<void>;

  addCategory: (input: { name: string; color: Category['color'] }) => Promise<void>;
  updateCategory: (id: string, input: { name: string; color: Category['color'] }) => Promise<void>;
  deleteCategory: (id: string) => Promise<{ blocked: boolean }>;
  reorderCategories: (fromIndex: number, toIndex: number) => Promise<void>;

  /** 성공 여부를 반환 — 실패 시 호출부가 폼을 유지하고 재시도할 수 있도록 함 */
  addSession: (input: Omit<Session, 'id'>) => Promise<boolean>;
  updateSessionFields: (
    id: string,
    patch: Partial<Pick<Session, 'title' | 'note' | 'focusRating' | 'distractionTags'>>,
  ) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;

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

    reorderTasks: async (fromIndex, toIndex) => {
      const previousTasks = get().tasks;
      const next = arrayMove(previousTasks, fromIndex, toIndex);
      set({ tasks: next });
      const { error } = await reorderTasksRows(next.map((t) => t.id));
      if (error) {
        set({ tasks: previousTasks });
        toast('순서 저장에 실패했어요');
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
      if (!previousCategories.some((c) => c.id === id)) return { blocked: false };

      // 참조하는 작업이 있으면 DB에서도 막히지만, 낙관적 삭제 후 롤백되는 깜빡임을 피하려고 미리 로컬에서 걸러낸다
      if (get().tasks.some((t) => t.categoryId === id)) {
        return { blocked: true };
      }

      set({ categories: previousCategories.filter((c) => c.id !== id) });
      const { error, blocked } = await deleteCategoryRow(id);
      if (error) {
        set({ categories: previousCategories });
        toast('카테고리 삭제에 실패했어요. 다시 시도해주세요');
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
        toast('순서 저장에 실패했어요');
      }
    },

    addSession: async (input) => {
      const tempId = generateId();
      const previousSessions = get().sessions;
      set({ sessions: [{ id: tempId, ...input }, ...previousSessions] });

      const inserted = await insertSessionRow(input);
      if (!inserted) {
        set({ sessions: previousSessions });
        toast('기록 저장에 실패했어요');
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
        toast('기록 저장에 실패했어요');
      }
    },

    deleteSession: async (id) => {
      const previousSessions = get().sessions;
      if (!previousSessions.some((s) => s.id === id)) return;
      set({ sessions: previousSessions.filter((s) => s.id !== id) });
      const { error } = await deleteSessionRow(id);
      if (error) {
        set({ sessions: previousSessions });
        toast('기록 삭제에 실패했어요');
      }
    },

    hydrate: async () => {
      const [tasksResult, categoriesResult, sessionsResult] = await Promise.all([
        withRetry(fetchTasks),
        withRetry(fetchCategories),
        withRetry(fetchSessions),
      ]);
      if (tasksResult === null || categoriesResult === null || sessionsResult === null) {
        toast('데이터를 불러오지 못했어요. 다시 시도해주세요');
      }
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
