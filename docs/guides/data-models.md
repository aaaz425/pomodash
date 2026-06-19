# Data Models

프로젝트 전체에서 사용하는 TypeScript 타입 정의.
실제 코드는 `types/index.ts`에 위치한다.

## 개념 계층 (Concept Hierarchy)

### 세션 (Session)

특정 작업에 할당된 집중 작업 단위. 한 세션은 `totalCycles`회의 사이클로 구성되며,
마지막 사이클이 끝나면 세션 기록 모달이 표시되고 세션이 마무리된다.
사용자는 세션을 시작/종료하며 작업을 관리한다.

**세션 메모(note):** 세션이 완전히 끝난 후 사용자가 1회 작성하는 회고 메모. 최대 500자.
사이클마다 작성하는 것이 아니라, 마지막 사이클 완료 시점에 한 번만 표시된다.

**집중 시간 집계 원칙:** `endedAt - startedAt`은 일시정지를 포함한 경과 시간이므로 집계에 사용하면 가짜 집중 시간이 된다. 집중 시간 통계는 반드시 `focusSeconds`만 사용한다. 타임라인 블록 표시는 `focusPeriods` 배열을 사용한다.

**focusPeriods 정규화:** 저장 전 `lib/focusPeriods.ts`의 `normalizeFocusPeriods()`를 반드시 통과시킨다.

- 5초 미만 집중 구간 드롭 (노이즈)
- 5초 이하 일시정지로 나뉜 인접 구간 병합
- 최대 100개 구간 상한 (초과 시 뒤쪽을 하나로 합침)

### 사이클 (Cycle)

세션 내의 반복 단위. focus → short-break 한 쌍.
`totalCycles`(기본 4)회 완료 시 세션 종료.

### 타이머 기록 (TimerRecord)

향후 개별 타이머 phase(focus / short-break) 1회의 세분화된 실행 기록용으로 예약된 타입.
현재는 사용하지 않는다. 대시보드에서 phase 단위 집계가 필요할 때 활성화한다.

---

## Core Types

```typescript
export type TimerPhase = 'focus' | 'short-break'

export interface Category {
  id: string
  name: string
  color: string // Tailwind color class (e.g. 'bg-blue-500')
}

export interface Task {
  id: string
  title: string
  categoryId: string
  targetFocusMinutes: number // 사이클당 집중 시간 (분)
  targetCycles: number // 목표 사이클 수 (회)
  targetBreakMinutes: number // 사이클 간 휴식 시간 (분)
  completed: boolean
  createdAt: string // ISO 8601
}

export interface FocusPeriod {
  start: string // ISO 8601
  end: string // ISO 8601
}

export interface Session {
  id: string
  taskId: string | null // null = 미분류
  startedAt: string // ISO 8601 — 세션 최초 시작 시각 (시간대 분석용)
  endedAt: string // ISO 8601 — 세션 종료 시각 (경과 시간 ≠ 집중 시간)
  completedCycles: number // 실제 완료 사이클 수
  totalCycles: number // 당시 설정값 스냅샷
  focusSeconds: number // 집계용 — 반드시 이 값만 사용 (endedAt - startedAt 금지)
  pausedSeconds: number // 총 일시정지 초
  focusPeriods: Array<{ start: string; end: string }> // 타임라인 블록용 실제 집중 구간
  note: string | null // 세션 회고 메모 (향후 모달에서 입력)
}

// TimerRecord — 향후 per-phase 세분화 집계용으로 예약, 현재 미사용
export interface TimerRecord {
  id: string
  taskId: string | null
  phase: TimerPhase
  startedAt: string // ISO 8601
  endedAt: string // ISO 8601
  focusSeconds: number
  pausedSeconds: number
}

export interface TimerSettings {
  focusMinutes: number
  shortBreakMinutes: number
  totalCycles: number // 세션당 총 사이클 수
}

export interface AppSettings {
  nickname: string
  browserNotification: boolean
  soundAlert: boolean
  motivationalMessages: string[] // 1–20개
  defaultTimerSettings: TimerSettings
}
```

## localStorage Keys

```typescript
const STORAGE_KEYS = {
  tasks: 'pomodash:tasks',
  categories: 'pomodash:categories',
  sessions: 'pomodash:sessions',
  settings: 'pomodash:settings',
  timerSettings: 'pomodash:timer-settings',
  version: 'pomodash:version',
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
  targetFocusMinutes: z.number(),
  completed: z.boolean(),
  createdAt: z.string(),
})
const TasksSchema = z.array(TaskSchema)

// lib/storage.ts — 제네릭 유틸
function loadFromStorage<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  if (typeof window === 'undefined') return fallback // SSR guard
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return schema.parse(JSON.parse(raw))
  } catch {
    return fallback // 파싱 실패 시 기본값 fallback (구버전 데이터 방어)
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
  { id: '5', name: '기타', color: 'bg-gray-500' },
]

const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  totalCycles: 4,
}
```

## Zod 유효성 범위

```typescript
// TimerSettingsSchema 허용 범위
focusMinutes: 5–120분
shortBreakMinutes: 0–60분
totalCycles: 1–20회
```

