import { z } from 'zod';
import { TIMER_LIMITS } from '@pomodash/shared';
import { CATEGORY_COLOR_KEYS, type CategoryColorKey } from '@/constants/categoryColors';

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

// Supabase 응답도 외부 입력이므로 반드시 검증 후 사용 — lib/supabase/{tasks,categories}.ts에서만 사용
// (color는 DB의 'bg-blue-500' 형태를 categoryColorMap.ts가 CategoryColorKey로 변환한 뒤 여기로 들어옴)
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.enum(CATEGORY_COLOR_KEYS),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  targetFocusMinutes: z
    .number()
    .min(TIMER_LIMITS.FOCUS_MINUTES_MIN)
    .max(TIMER_LIMITS.FOCUS_MINUTES_MAX),
  targetCycles: z.number().min(TIMER_LIMITS.CYCLES_MIN).max(TIMER_LIMITS.CYCLES_MAX),
  targetBreakMinutes: z
    .number()
    .min(TIMER_LIMITS.BREAK_MINUTES_MIN)
    .max(TIMER_LIMITS.BREAK_MINUTES_MAX),
  completed: z.boolean(),
  createdAt: z.string(),
});
