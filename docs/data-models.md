# Data Models

프로젝트 전체에서 사용하는 TypeScript 타입 정의.
실제 코드는 `types/index.ts`에 위치한다.

## 개념 계층 (Concept Hierarchy)

### 세션 (Session)
특정 작업에 할당된 집중 작업 단위. 한 세션 동안 여러 번의 포모도로
사이클(집중 → 짧은 휴식)이 반복되며, `cyclesBeforeLongBreak` 사이클
완료 후 긴 휴식으로 세션이 마무리된다. 사용자는 세션을 시작/종료하며
작업을 관리한다.

### 사이클 (Cycle)
세션 내의 반복 단위. focus → short-break 한 쌍.
`cyclesBeforeLongBreak`(기본 4)회 완료 시 long-break로 세션 종료.

### 타이머 기록 (TimerRecord)
개별 타이머 phase(focus / short-break / long-break) 1회의 실행 기록.
`TimerRecord` 인터페이스가 이를 나타낸다.

---

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

export interface TimerRecord {
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
  timerRecords: 'pomodash:timer-records',
} as const
```

## localStorage 접근 패턴

localStorage 데이터는 외부 입력이므로 반드시 런타임 검증을 거친다.
Zod 스키마로 파싱 + 타입 추론을 일원화하고, SSR 환경을 방어한다.

```typescript
import { z } from 'zod'

// 스키마 정의 (types/index.ts의 interface와 1:1 대응)
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  targetMinutes: z.number(),
  completed: z.boolean(),
  createdAt: z.string(),
})
const TasksSchema = z.array(TaskSchema)

// lib/storage.ts — 제네릭 유틸
function loadFromStorage<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  if (typeof window === 'undefined') return fallback  // SSR guard
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return schema.parse(JSON.parse(raw))
  } catch {
    return fallback  // 파싱 실패 시 기본값 fallback (구버전 데이터 방어)
  }
}
```

## 스키마 버저닝

데이터 구조 변경 시 기존 localStorage 데이터와 충돌을 방지하기 위해 버전을 관리한다.

```typescript
const STORAGE_VERSION = 1

// 버전 불일치 감지 시 초기화 또는 마이그레이션
const storedVersion = localStorage.getItem('pomodash:version')
if (Number(storedVersion) !== STORAGE_VERSION) {
  // 마이그레이션 로직 또는 초기화
  localStorage.clear()
  localStorage.setItem('pomodash:version', String(STORAGE_VERSION))
}
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
