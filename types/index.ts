import { z } from 'zod'

// ─── Core Types ───────────────────────────────────────────────────────────────

export type TimerPhase = 'focus' | 'short-break' | 'long-break'

export interface Category {
  id: string
  name: string
  color: string // Tailwind color class (e.g. 'bg-blue-500')
}

export interface Task {
  id: string
  title: string
  categoryId: string
  targetMinutes: number // 총 누적 집중 목표 분 (진행도 표시용, 완료는 사용자 수동 설정)
  completed: boolean
  createdAt: string // ISO 8601
}

export interface TimerRecord {
  id: string
  taskId: string
  phase: TimerPhase
  startedAt: string // ISO 8601
  endedAt: string   // ISO 8601
  focusMinutes: number // 실제 집중한 분 수 (일시정지·중단 시 설정값보다 작을 수 있음)
}

export interface TimerSettings {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  cyclesBeforeLongBreak: number
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
})

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  targetMinutes: z.number(),
  completed: z.boolean(),
  createdAt: z.string(),
})

export const TimerRecordSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  phase: z.enum(['focus', 'short-break', 'long-break']),
  startedAt: z.string(),
  endedAt: z.string(),
  focusMinutes: z.number(),
})

export const TimerSettingsSchema = z.object({
  focusMinutes: z.number().min(1).max(60),
  shortBreakMinutes: z.number().min(1).max(30),
  longBreakMinutes: z.number().min(1).max(60),
  cyclesBeforeLongBreak: z.number().min(1).max(10),
})

export const CategoriesSchema = z.array(CategorySchema)
export const TasksSchema = z.array(TaskSchema)
export const TimerRecordsSchema = z.array(TimerRecordSchema)

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  tasks: 'pomodash:tasks',
  categories: 'pomodash:categories',
  timerRecords: 'pomodash:timer-records',
  timerSettings: 'pomodash:timer-settings',
  version: 'pomodash:version',
} as const

// ─── Default Values ───────────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '공부', color: 'bg-blue-500' },
  { id: '2', name: '업무', color: 'bg-green-500' },
  { id: '3', name: '운동', color: 'bg-orange-500' },
  { id: '4', name: '독서', color: 'bg-purple-500' },
]

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
}
