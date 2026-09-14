import { createStore } from 'zustand';
import { INPUT_LIMITS } from '@pomodash/shared';
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

// fetchCategories 실패 시에만 쓰는 폴백 — DB 트리거(handle_new_user) 기본값과 이름을 맞춤
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '공부', color: '#3b82f6' },
  { id: '2', name: '업무', color: '#22c55e' },
  { id: '3', name: '운동', color: '#f97316' },
  { id: '4', name: '독서', color: '#a855f7' },
  { id: '5', name: '기타', color: '#6b7280' },
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
    patch: Partial<Pick<Session, 'title' | 'note' | 'focusRating' | 'distractionTags' | 'taskId'>>,
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

type PendingIds = Map<string, Promise<string | null>>;

// tempId 생성 중 update/delete가 겹치면 나중 도착한 insert reconcile이 그 변경을 덮어쓰므로, 생성이 끝날 때까지 기다렸다가 실제 DB id로 동작한다
function trackPendingId(pending: PendingIds, tempId: string, promise: Promise<string | null>) {
  pending.set(tempId, promise);
  void promise.finally(() => {
    if (pending.get(tempId) === promise) pending.delete(tempId);
  });
}

function resolvePendingId(pending: PendingIds, id: string): Promise<string | null> {
  return pending.get(id) ?? Promise.resolve(id);
}

export const createTaskStore = () => {
  const pendingTaskIds: PendingIds = new Map();
  const pendingCategoryIds: PendingIds = new Map();
  const pendingSessionIds: PendingIds = new Map();

  return createStore<TaskStore>()((set, get) => ({
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
      // 스냅샷을 직접 set하면 대기 중 다른 변경을 덮어쓰므로 state 콜백으로 최신 상태 위에서 반영
      set((state) => ({ tasks: [optimisticTask, ...state.tasks] }));

      const idPromise = (async () => {
        const inserted = await insertTaskRow({
          title: trimmed,
          categoryId,
          targetFocusMinutes: focus,
          targetCycles: cycles,
          targetBreakMinutes: breakMinutes,
        });

        if (!inserted) {
          set((state) => ({ tasks: state.tasks.filter((t) => t.id !== tempId) }));
          toast('작업 추가에 실패했어요. 다시 시도해주세요');
          return null;
        }

        set((state) => ({ tasks: state.tasks.map((t) => (t.id === tempId ? inserted : t)) }));
        void reorderTasksRows(get().tasks.map((t) => t.id));
        return inserted.id;
      })();
      trackPendingId(pendingTaskIds, tempId, idPromise);
      return idPromise;
    },

    toggleTask: async (id) => {
      const targetId = await resolvePendingId(pendingTaskIds, id);
      if (!targetId) return;
      const original = get().tasks.find((t) => t.id === targetId);
      if (!original) return;
      const completed = !original.completed;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === targetId ? { ...t, completed } : t)),
      }));
      const { error } = await updateTaskRow(targetId, { completed });
      if (error) {
        set((state) => ({ tasks: state.tasks.map((t) => (t.id === targetId ? original : t)) }));
        toast('작업 저장에 실패했어요. 다시 시도해주세요');
      }
    },

    updateTask: async (id, patch) => {
      const targetId = await resolvePendingId(pendingTaskIds, id);
      if (!targetId) return;
      const original = get().tasks.find((t) => t.id === targetId);
      if (!original) return;
      const title = patch.title?.trim();
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === targetId ? { ...t, ...patch, title: title ?? t.title } : t,
        ),
      }));
      const { error } = await updateTaskRow(targetId, { ...patch, title });
      if (error) {
        set((state) => ({ tasks: state.tasks.map((t) => (t.id === targetId ? original : t)) }));
        toast('작업 저장에 실패했어요. 다시 시도해주세요');
      }
    },

    deleteTask: async (id) => {
      const targetId = await resolvePendingId(pendingTaskIds, id);
      if (!targetId) return;
      const index = get().tasks.findIndex((t) => t.id === targetId);
      if (index === -1) return;
      const target = get().tasks[index];
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== targetId) }));
      const { error } = await deleteTaskRow(targetId);
      if (error) {
        set((state) => {
          const tasks = [...state.tasks];
          tasks.splice(Math.min(index, tasks.length), 0, target);
          return { tasks };
        });
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
      if (get().categories.length >= INPUT_LIMITS.CATEGORIES_MAX) return;
      const trimmed = name.trim();
      const tempId = generateId();
      set((state) => ({
        categories: [...state.categories, { id: tempId, name: trimmed, color }],
      }));

      const idPromise = (async () => {
        const inserted = await insertCategoryRow({ name: trimmed, color });
        if (!inserted) {
          set((state) => ({ categories: state.categories.filter((c) => c.id !== tempId) }));
          toast('카테고리 추가에 실패했어요. 다시 시도해주세요');
          return null;
        }
        set((state) => ({
          categories: state.categories.map((c) => (c.id === tempId ? inserted : c)),
        }));
        void reorderCategoriesRows(get().categories.map((c) => c.id));
        return inserted.id;
      })();
      trackPendingId(pendingCategoryIds, tempId, idPromise);
      await idPromise;
    },

    updateCategory: async (id, { name, color }) => {
      const targetId = await resolvePendingId(pendingCategoryIds, id);
      if (!targetId) return;
      const original = get().categories.find((c) => c.id === targetId);
      if (!original) return;
      const trimmed = name.trim();
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === targetId ? { ...c, name: trimmed, color } : c,
        ),
      }));
      const { error } = await updateCategoryRow(targetId, { name: trimmed, color });
      if (error) {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === targetId ? original : c)),
        }));
        toast('카테고리 저장에 실패했어요. 다시 시도해주세요');
      }
    },

    deleteCategory: async (id) => {
      const targetId = await resolvePendingId(pendingCategoryIds, id);
      if (!targetId) return { blocked: false };
      const index = get().categories.findIndex((c) => c.id === targetId);
      if (index === -1) return { blocked: false };

      // 참조하는 작업이 있으면 DB에서도 막히지만, 낙관적 삭제 후 롤백되는 깜빡임을 피하려고 미리 로컬에서 걸러낸다
      if (get().tasks.some((t) => t.categoryId === targetId)) {
        return { blocked: true };
      }

      const target = get().categories[index];
      set((state) => ({ categories: state.categories.filter((c) => c.id !== targetId) }));
      const { error, blocked } = await deleteCategoryRow(targetId);
      if (error) {
        set((state) => {
          const categories = [...state.categories];
          categories.splice(Math.min(index, categories.length), 0, target);
          return { categories };
        });
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
      set((state) => ({ sessions: [{ id: tempId, ...input }, ...state.sessions] }));

      const idPromise = (async () => {
        const inserted = await insertSessionRow(input);
        if (!inserted) {
          set((state) => ({ sessions: state.sessions.filter((s) => s.id !== tempId) }));
          return null;
        }
        set((state) => ({ sessions: state.sessions.map((s) => (s.id === tempId ? inserted : s)) }));
        return inserted.id;
      })();
      trackPendingId(pendingSessionIds, tempId, idPromise);

      const insertedId = await idPromise;
      if (!insertedId) {
        toast('기록 저장에 실패했어요');
        return false;
      }
      return true;
    },

    updateSessionFields: async (id, patch) => {
      const targetId = await resolvePendingId(pendingSessionIds, id);
      if (!targetId) return;
      const original = get().sessions.find((s) => s.id === targetId);
      if (!original) return;
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === targetId ? { ...s, ...patch } : s)),
      }));
      const { error } = await updateSessionRow(targetId, patch);
      if (error) {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === targetId ? original : s)),
        }));
        toast('기록 저장에 실패했어요');
      }
    },

    deleteSession: async (id) => {
      const targetId = await resolvePendingId(pendingSessionIds, id);
      if (!targetId) return;
      const index = get().sessions.findIndex((s) => s.id === targetId);
      if (index === -1) return;
      const target = get().sessions[index];
      set((state) => ({ sessions: state.sessions.filter((s) => s.id !== targetId) }));
      const { error } = await deleteSessionRow(targetId);
      if (error) {
        set((state) => {
          const sessions = [...state.sessions];
          sessions.splice(Math.min(index, sessions.length), 0, target);
          return { sessions };
        });
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
};

export type TaskStoreApi = ReturnType<typeof createTaskStore>;
export type { TaskStore };
