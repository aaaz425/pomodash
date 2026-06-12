# Data Models

프로젝트 전체에서 사용하는 TypeScript 타입 정의.
실제 코드는 `types/index.ts`에 위치한다.

## Core Types

```typescript
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
  startedAt: string  // ISO 8601
  endedAt: string    // ISO 8601
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
```

## localStorage Keys

```typescript
const STORAGE_KEYS = {
  tasks: 'pomodash:tasks',
  categories: 'pomodash:categories',
  sessions: 'pomodash:sessions',
} as const
```

## Default Values

```typescript
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '공부', color: 'bg-blue-500' },
  { id: '2', name: '업무', color: 'bg-green-500' },
  { id: '3', name: '운동', color: 'bg-orange-500' },
  { id: '4', name: '독서', color: 'bg-purple-500' },
]

const DEFAULT_TIMER_SETTINGS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
}
```
