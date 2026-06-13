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
  targetMinutes: number
  completed: boolean
  createdAt: string // ISO 8601
}

export interface Session {
  id: string
  taskId: string
  phase: TimerPhase
  startedAt: string // ISO 8601
  endedAt: string   // ISO 8601
  focusMinutes: number
  note: string
}

export interface TimerState {
  phase: TimerPhase
  remainingSeconds: number
  isRunning: boolean
  currentTaskId: string | null
  cycleCount: number // 완료된 focus 세션 수 (4마다 long-break)
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

export const SessionSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  phase: z.enum(['focus', 'short-break', 'long-break']),
  startedAt: z.string(),
  endedAt: z.string(),
  focusMinutes: z.number(),
  note: z.string(),
})

export const CategoriesSchema = z.array(CategorySchema)
export const TasksSchema = z.array(TaskSchema)
export const SessionsSchema = z.array(SessionSchema)

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  tasks: 'pomodash:tasks',
  categories: 'pomodash:categories',
  sessions: 'pomodash:sessions',
  version: 'pomodash:version',
} as const

// ─── Default Values ───────────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '공부', color: 'bg-blue-500' },
  { id: '2', name: '업무', color: 'bg-green-500' },
  { id: '3', name: '운동', color: 'bg-orange-500' },
  { id: '4', name: '독서', color: 'bg-purple-500' },
]

export const DEFAULT_TIMER_SETTINGS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
} as const
