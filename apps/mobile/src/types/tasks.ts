import type { CategoryColorKey } from '@/constants/categoryColors';

export interface Category {
  id: string;
  name: string;
  color: CategoryColorKey;
}

export interface Task {
  id: string;
  title: string;
  categoryId: string;
  targetFocusMinutes: number; // 사이클당 집중 시간 (분)
  targetCycles: number; // 목표 사이클 수 (회)
  targetBreakMinutes: number; // 사이클 간 휴식 시간 (분)
  completed: boolean;
  createdAt: string; // ISO 8601
}
