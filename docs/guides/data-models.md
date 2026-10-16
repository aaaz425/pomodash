# Data Models

프로젝트 전체에서 사용하는 TypeScript 타입 정의.
인터페이스는 `types/models.ts`, Zod 스키마와 기본값은 `types/schemas.ts`에 위치한다. `types/index.ts`는 둘을 re-export하는 barrel이다. 웹과 모바일이 공유하는 타입(`TimerPhase`, `TimerMode`, `TimerSettings`, `FocusPeriod`, `AppSettings` 등)은 `packages/shared`에서 정의하고 `types/models.ts`가 re-export한다.

## 개념 계층 (Concept Hierarchy)

### 세션 (Session)

타이머를 한 번 실행한 기록. 작업 연결은 선택 사항이며(`taskId` null이면 미분류), 한 세션은 `totalCycles`회의 사이클로 구성된다.
마지막 사이클이 끝나거나 사용자가 종료하면 기록 모달이 표시되고, 저장하면 세션이 남는다. 건너뛰면 기록은 저장되지 않는다.
타이머 시간 설정은 작업과 무관하게 설정의 타이머 기본값에서 시작하고, 시작할 때마다 그 회차에 한해 조정할 수 있다.

**세션 메모(note):** 세션이 완전히 끝난 후 사용자가 1회 작성하는 회고 메모. 최대 500자.
사이클마다 작성하는 것이 아니라, 마지막 사이클 완료 시점에 한 번만 표시된다.

**집중 시간 집계 원칙:** `endedAt - startedAt`은 일시정지를 포함한 경과 시간이므로 집계에 사용하면 가짜 집중 시간이 된다. 집중 시간 통계는 반드시 `focusSeconds`만 사용한다. 타임라인 블록 표시는 `focusPeriods` 배열을 사용한다.

**최소 기록 시간:** 세션 전체 집중 시간이 30초(`SESSION_LIMITS.MIN_SESSION_FOCUS_SECONDS`) 미만이면 기록을 만들지 않고 타이머를 초기화한다.

**focusPeriods 정규화:** 저장 전 `normalizeFocusPeriods()`(`packages/shared`)를 반드시 통과시킨다. 기록 모달(웹 `SessionRecordModal`, 모바일 `SessionCompleteSheet`)이 저장 직전에 호출한다.

- 5초 미만 집중 구간 드롭 (노이즈)
- 5초 이하 일시정지로 나뉜 인접 구간 병합
- 최대 100개 구간 상한 (초과 시 뒤쪽 구간을 드롭, 병합하지 않음)

### 사이클 (Cycle)

세션 내의 반복 단위. focus → short-break 한 쌍.
`totalCycles`(기본 4)회 완료 시 세션 종료.

### 타이머 기록 (TimerRecord)

향후 개별 타이머 phase(focus / short-break) 1회의 세분화된 실행 기록용으로 예약된 타입.
현재는 사용하지 않는다. 대시보드에서 phase 단위 집계가 필요할 때 활성화한다.

### 대시보드 요약 (DashboardSummary)

스트릭·월간 히트맵·전일/전주/전월 비교·가장 바쁜 요일처럼 세션 전체 히스토리를 스캔해야 하는 통계.
클라이언트가 전체 `sessions` row를 받아와 집계하던 방식은 세션 수가 늘수록 선형으로 느려지는 구조적 문제가 있었다.
Postgres RPC `get_dashboard_summary(p_timezone)`가 서버에서 한 번에 계산해 반환하며, `lib/supabase/dashboard.ts`의
`fetchDashboardSummary()`가 이를 호출하고 Zod로 검증한다. 오늘/이번주/이번달 탭의 원시 세션 목록(필터링·리스트 표시용)은
여전히 클라이언트가 `sessions`를 들고 계산 — DashboardSummary는 "전체 히스토리 스캔이 필요한 통계"만 담당한다.

---

## Core Types

```typescript
export type TimerPhase = 'focus' | 'short-break'
export type TimerMode = 'pomodoro' | 'free'

export interface Category {
  id: string
  name: string
  color: string // hex color (e.g. '#3b82f6')
}

export interface Task {
  id: string
  title: string
  categoryId: string
  createdAt: string // ISO 8601
}

export interface FocusPeriod {
  start: string // ISO 8601
  end: string // ISO 8601
}

export interface Session {
  id: string
  taskId: string | null // null = 미분류
  title: string | null // taskId와 독립된 세션별 라벨, 저널 상세 편집에서만 설정, 최대 100자
  mode: TimerMode // 'free'는 completedCycles/totalCycles가 0 — "N/M 사이클" 대신 별도 표시 필요
  startedAt: string // ISO 8601 — 세션 최초 시작 시각 (시간대 분석용)
  endedAt: string // ISO 8601 — 세션 종료 시각 (경과 시간 ≠ 집중 시간)
  completedCycles: number // 실제 완료 사이클 수
  totalCycles: number // 당시 설정값 스냅샷
  focusSeconds: number // 집계용 — 반드시 이 값만 사용 (endedAt - startedAt 금지)
  pausedSeconds: number // 총 일시정지 초
  focusPeriods: Array<{ start: string; end: string }> // 타임라인 블록용 실제 집중 구간
  note: string | null // 세션 회고 메모, 마지막 사이클 완료 시 1회 작성
  focusRating: FocusRating | null // 집중도 자가 평점 3단계, 옵션
  distractionTags: string[] // 방해요소 태그 프리셋(id) 배열, 옵션
}

export type FocusRating = 1 | 2 | 3

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

export interface PeriodStat {
  focusSeconds: number
  count: number
}

// get_dashboard_summary RPC 응답 — 전체 히스토리를 스캔해야 하는 통계만 담는다
export interface DashboardSummary {
  streakDays: number
  maxStreakDays: number
  monthlyActivity: DayActivity[]
  monthFocusSeconds: number
  busiestDay: string | null
  firstSessionDate: string | null // ISO 8601
  prevDay: PeriodStat
  prevWeek: PeriodStat
  prevMonth: PeriodStat
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
  soundType: SoundType         // 'sine' | 'chime' | 'bell' | 'digital'
  soundVolume: number          // 0–100
  soundRepeatCount: number     // 1–5
  motivationalMessages: string[] // 1–20개
  defaultTimerSettings: TimerSettings
  keepScreenAwake: boolean
}
```

## localStorage Keys

Task/Category/Session/AppSettings는 Supabase로 이전되어 더 이상 localStorage에 저장하지 않는다(`lib/supabase/*.ts`에서 Zod로 검증). localStorage에는 새로고침 복구용 활성 타이머 스냅샷과 테마(라이트/다크, 컬러 테마)만 남아있다.

```typescript
const STORAGE_KEYS = {
  activeTimer: 'pomoroutine:active-timer',
  version: 'pomoroutine:version',
  theme: 'theme', // 예외적으로 'pomoroutine:' 접두사 없음
  colorTheme: 'pomoroutine:color-theme',
} as const
```

## localStorage 접근 패턴

localStorage 데이터는 외부 입력이므로 반드시 런타임 검증을 거친다.
Zod 스키마로 파싱 + 타입 추론을 일원화하고, SSR 환경을 방어한다.

```typescript
import { z } from 'zod'

// 스키마 정의 (types/models.ts의 interface와 1:1 대응) — 활성 타이머 예시
const ActiveTimerStateSchema = z.object({
  phase: z.enum(['focus', 'short-break']),
  remainingSeconds: z.number(),
  startedAt: z.number().nullable(),
  // ...
})

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
const storedVersion = localStorage.getItem('pomoroutine:version')
if (Number(storedVersion) !== STORAGE_VERSION) {
  // 마이그레이션 로직 또는 초기화
  localStorage.clear()
  localStorage.setItem('pomoroutine:version', String(STORAGE_VERSION))
}
```

## Default Values

```typescript
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '공부', color: '#3b82f6' },
  { id: '2', name: '업무', color: '#22c55e' },
  { id: '3', name: '운동', color: '#f97316' },
  { id: '4', name: '독서', color: '#a855f7' },
  { id: '5', name: '기타', color: '#6b7280' },
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
focusMinutes: 1–120분
shortBreakMinutes: 0–60분
totalCycles: 1–10회
```

