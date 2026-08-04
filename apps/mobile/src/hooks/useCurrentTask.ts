import { useTimerStore, useTaskStore } from '@/store/StoreProvider';

// timerStore의 currentTaskId로 task/category를 조회 — index.tsx/FocusMode에서 동일하게 필요해 추출
export function useCurrentTask() {
  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const task = tasks.find((t) => t.id === currentTaskId) ?? null;
  const category = task ? (categories.find((c) => c.id === task.categoryId) ?? null) : null;

  return { task, category };
}
