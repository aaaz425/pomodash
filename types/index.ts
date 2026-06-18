import { z } from 'zod';

// ─── Core Types ───────────────────────────────────────────────────────────────

export type TimerPhase = 'focus' | 'short-break';

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class (e.g. 'bg-blue-500')
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

export interface FocusPeriod {
  start: string; // ISO 8601
  end: string; // ISO 8601
}

export interface Session {
  id: string;
  taskId: string | null;
  startedAt: string; // ISO 8601 — 세션 최초 시작 시각 (시간대 분석용)
  endedAt: string; // ISO 8601 — 세션 종료 시각 (경과 시간 ≠ 집중 시간)
  completedCycles: number;
  totalCycles: number;
  focusSeconds: number; // 집계용 — endedAt - startedAt 사용 금지
  pausedSeconds: number;
  focusPeriods: FocusPeriod[]; // 타임라인 블록용 실제 집중 구간
  note: string | null;
}

// 향후 per-phase 세분화 집계용으로 예약, 현재 미사용
export interface TimerRecord {
  id: string;
  taskId: string | null;
  phase: TimerPhase;
  startedAt: string;
  endedAt: string;
  focusSeconds: number;
  pausedSeconds: number;
}

export interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  totalCycles: number; // 세션당 총 사이클 수 (이전 cyclesBeforeLongBreak)
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  targetFocusMinutes: z.number().default(25),
  targetCycles: z.number().default(4),
  targetBreakMinutes: z.number().default(5),
  completed: z.boolean(),
  createdAt: z.string(),
});

export const FocusPeriodSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const SessionSchema = z.object({
  id: z.string(),
  taskId: z.string().nullable(),
  startedAt: z.string(),
  endedAt: z.string(),
  completedCycles: z.number(),
  totalCycles: z.number(),
  focusSeconds: z.number(),
  pausedSeconds: z.number(),
  focusPeriods: z.array(FocusPeriodSchema),
  note: z.string().nullable(),
});

// 향후 per-phase 집계용으로 예약, 현재 미사용
export const TimerRecordSchema = z.object({
  id: z.string(),
  taskId: z.string().nullable(),
  phase: z.enum(['focus', 'short-break']),
  startedAt: z.string(),
  endedAt: z.string(),
  focusSeconds: z.number(),
  pausedSeconds: z.number(),
});

export const TimerSettingsSchema = z.object({
  focusMinutes: z.number().min(5).max(120),
  shortBreakMinutes: z.number().min(0).max(60),
  totalCycles: z.number().min(1).max(20),
});

export interface AppSettings {
  nickname: string;
  browserNotification: boolean;
  soundAlert: boolean;
  motivationalMessages: string[];
  defaultTimerSettings: TimerSettings;
}

export const AppSettingsSchema = z.object({
  nickname: z.string(),
  browserNotification: z.boolean(),
  soundAlert: z.boolean(),
  motivationalMessages: z.array(z.string()).min(1),
  defaultTimerSettings: TimerSettingsSchema,
});

export const CategoriesSchema = z.array(CategorySchema);
export const TasksSchema = z.array(TaskSchema);
export const SessionsSchema = z.array(SessionSchema);
export const TimerRecordsSchema = z.array(TimerRecordSchema);

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  tasks: 'pomodash:tasks',
  categories: 'pomodash:categories',
  sessions: 'pomodash:sessions',
  timerSettings: 'pomodash:timer-settings',
  settings: 'pomodash:settings',
  version: 'pomodash:version',
} as const;

// ─── Default Values ───────────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '공부', color: 'bg-blue-500' },
  { id: '2', name: '업무', color: 'bg-green-500' },
  { id: '3', name: '운동', color: 'bg-orange-500' },
  { id: '4', name: '독서', color: 'bg-purple-500' },
  { id: '5', name: '기타', color: 'bg-gray-500' },
];

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  totalCycles: 4,
};
