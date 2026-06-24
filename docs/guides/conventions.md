# Conventions

## 폴더 구조

```
app/                        # 라우팅 세그먼트만 — 비즈니스 로직 금지
  (main)/
    layout.tsx              # 공통 레이아웃 + StoreProvider
    page.tsx                # 메인 (타이머 + 작업 목록)
    loading.tsx             # Suspense 스켈레톤
    error.tsx               # 에러 바운더리
    dashboard/
      page.tsx
      loading.tsx
    journal/
      page.tsx
      loading.tsx
    settings/
      page.tsx
  landing/
    page.tsx                # 랜딩 페이지
  api/
    ai/route.ts             # Claude API (선택적)
components/
  ui/                       # shadcn/ui 설치 경로 — 직접 수정 금지
  timer/                    # 타이머 feature
    TimerDisplay.tsx
    TimerControls.tsx
    FocusMode.tsx           # 집중 모드 전환 래퍼
  tasks/                    # 작업 feature
    TaskList.tsx
    TaskItem.tsx
    TaskForm.tsx
  dashboard/                # 대시보드 feature
    StudyChart.tsx
    StreakCard.tsx
  journal/                  # 기록 feature
    SessionNote.tsx
    SessionHistory.tsx
  shared/                   # 여러 feature에서 공유하는 컴포넌트
    layout/                 # 반응형 레이아웃 전용 (app 레이어에서만 사용)
      TopBar.tsx
      Sidebar.tsx
      IconSidebar.tsx
      BottomNav.tsx
    CategoryBadge.tsx
    MotivationalMessage.tsx
store/
  timerStore.ts
  taskStore.ts
  settingsStore.ts
  StoreProvider.tsx         # SSR 안전 초기화용 Provider — app/layout.tsx에 마운트
hooks/
  useTimer.ts               # 타이머 tick 로직 + visibilitychange 처리
  useTasks.ts
lib/
  storage.ts                # localStorage 추상화 + Zod 파싱 (docs/data-models.md 참조)
  notifications.ts          # Web Notifications API
  analytics.ts              # Posthog 이벤트 래핑 — 컴포넌트에서 posthog 직접 import 금지
workers/
  timer.worker.ts           # (선택) Web Worker — MVP 이후 드리프트 재발 시 도입
types/
  index.ts                  # 모든 타입 (docs/data-models.md 참조)
```

### 무엇이 어디에 들어가는가

| 코드 종류                      | 위치                         |
| ------------------------------ | ---------------------------- |
| 페이지 라우트, 레이아웃        | `app/`                       |
| UI 컴포넌트 (feature별)        | `components/<feature>/`      |
| 여러 feature에서 쓰는 컴포넌트 | `components/shared/`         |
| shadcn/ui 원본                 | `components/ui/` (수정 금지) |
| 전역 상태                      | `store/`                     |
| 브라우저 API 추상화 훅         | `hooks/`                     |
| 순수 유틸 (브라우저/서버 무관) | `lib/`                       |
| 공유 TypeScript 타입           | `types/index.ts`             |

### 의존성 방향 규칙

`app/ → components/ → lib/` 단방향만 허용.
`lib/`에서 `components/`나 `app/`을 import하지 않는다.

## 네이밍

| 대상          | 규칙                   | 예시               |
| ------------- | ---------------------- | ------------------ |
| 컴포넌트 파일 | PascalCase             | `TimerDisplay.tsx` |
| 스토어 파일   | camelCase + Store      | `timerStore.ts`    |
| 훅 파일       | camelCase + use 접두사 | `useTimer.ts`      |
| 유틸 파일     | camelCase              | `storage.ts`       |
| 타입 이름     | PascalCase             | `TimerState`       |
| 함수/변수     | camelCase              | `remainingSeconds` |

## 컴포넌트 규칙

- 서버 컴포넌트 기본, 클라이언트 상태/이벤트 필요 시 `'use client'` 명시
- props 타입은 파일 상단에 `interface Props` 로 정의
- shadcn/ui 컴포넌트 우선 사용, 없을 때만 직접 작성
- `button`, `[role="button"]`, `select`, `label[for]` 요소는 호버 시 `cursor: pointer` — `globals.css`에 레이어 밖(unlayered) 전역 규칙으로 적용되어 있으므로 개별 클래스를 따로 추가하지 않아도 된다. `disabled` 상태에는 `cursor-not-allowed`를 명시적으로 추가한다.

### 컴포넌트 분리 기준

아래 4가지 중 하나라도 해당되면 분리를 검토한다.

1. **200줄 초과** — 파일 크기 자체가 분리 신호
2. **역할이 2개 이상** — 폼 로직 + 표시 로직 + 애니메이션 등이 한 파일에 혼재
3. **2곳 이상에서 동일 패턴 반복** — 즉시 공유 컴포넌트로 추출
4. **독립 테스트 단위** — 단위 테스트를 별도로 작성하고 싶은 조각

**분리 위치 규칙**

| 용도                                    | 위치                                |
| --------------------------------------- | ----------------------------------- |
| 한 feature 안에서만 쓰이는 서브컴포넌트 | `components/<feature>/` (같은 폴더) |
| 2개 이상 feature에서 쓰이는 컴포넌트    | `components/shared/`                |

### 컴포넌트 재활용 원칙

**새 UI 코드 작성 전 반드시 다음 순서로 확인한다:**
1. `components/ui/` — shadcn/ui 설치 컴포넌트 (수정 금지, 우선 사용)
2. `components/shared/` — 프로젝트 공유 컴포넌트

비슷한 UI 패턴이 2곳 이상 생기는 순간 바로 `shared/`로 추출한다. 미루면 누락되기 쉽다.
shared 컴포넌트를 추가할 때 아래 목록도 함께 갱신한다.

**`components/ui/` (shadcn/ui — 직접 수정 금지)**

| 컴포넌트 | 용도 |
| -------- | ---- |
| `button` | 기본 버튼 |

**`components/shared/layout/` (반응형 레이아웃 — app 레이어 전용)**

| 컴포넌트 | 용도 |
| -------- | ---- |
| `BottomNav` | 모바일 하단 네비게이션 |
| `IconSidebar` | 아이콘 사이드바 (태블릿) |
| `Sidebar` | 사이드바 (데스크탑) |
| `TopBar` | 상단 바 (모바일) |

**`components/shared/` (프로젝트 공유)**

| 컴포넌트 | 용도 |
| -------- | ---- |
| `AnalyticsProvider` | Posthog 초기화 클라이언트 래퍼 |
| `CategoryBadge` | 카테고리 색상 뱃지 |
| `CategoryPills` | 카테고리 선택 pill 버튼 (`variant: rich / simple`) |
| `ConfirmDialog` | 확인/취소 대화상자 |
| `DatePickerInput` | 날짜 선택 입력 |
| `Modal` | 범용 모달 셸 (모바일 bottom-sheet / 데스크탑 중앙 팝업) |
| `PageSpinner` | 페이지 로딩 스피너 |
| `SettingsMenuRow` | 설정 메뉴 행 (아이콘 + 라벨 + 값 미리보기 + 모달 오픈) |
| `StepperInput` | 숫자 증감 입력 (단위 포함) |
| `TaskQuickAddForm` | 인라인 작업 빠른 생성 폼 (모달 내부용) |
| `ThemeToggle` | 테마 전환 버튼 |
| `TimerSettingsGroup` | 집중·횟수·휴식 StepperInput 3종 세트 |

## Zustand 스토어 패턴

Next.js 16 SSR 환경에서 전역 싱글톤 스토어는 요청 간 상태 공유 버그를 일으킨다.
**팩토리 함수 + StoreProvider 패턴**을 반드시 사용한다.

```typescript
// store/timerStore.ts — 팩토리 함수로 정의
import { createStore } from 'zustand'

interface TimerStore {
  // state
  phase: TimerPhase
  remainingSeconds: number
  startedAt: number | null // 절대 시간 기반 계산용

  // actions
  start: () => void
  pause: () => void
  reset: () => void
}

export const createTimerStore = () =>
  createStore<TimerStore>()((set) => ({
    phase: 'focus',
    remainingSeconds: 25 * 60,
    startedAt: null,
    start: () => set({ startedAt: Date.now() }),
    pause: () => set({ startedAt: null }),
    reset: () => set({ remainingSeconds: 25 * 60, startedAt: null }),
  }))

export type TimerStoreApi = ReturnType<typeof createTimerStore>
```

```typescript
// store/StoreProvider.tsx — 앱 최상단에서 한 번만 초기화
'use client'
import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'
import { createTimerStore, TimerStoreApi } from './timerStore'

const TimerStoreContext = createContext<TimerStoreApi | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<TimerStoreApi | null>(null)
  if (!storeRef.current) storeRef.current = createTimerStore()
  return (
    <TimerStoreContext.Provider value={storeRef.current}>
      {children}
    </TimerStoreContext.Provider>
  )
}

export function useTimerStore<T>(selector: (state: TimerStore) => T) {
  const store = useContext(TimerStoreContext)
  if (!store) throw new Error('StoreProvider missing')
  return useStore(store, selector)
}
```

**컴포넌트에서 스토어 구독 시 slice 선택자 필수:**

```ts
// 나쁨 — 스토어 전체 구독으로 불필요한 리렌더링 발생
const store = useTimerStore((s) => s)
// 좋음 — 필요한 값만 선택
const isRunning = useTimerStore((s) => s.startedAt !== null)
```

## Analytics 패턴

Posthog를 `lib/analytics.ts`에 래핑한다. 컴포넌트가 `posthog`를 직접 import하지 않는다.

```typescript
// lib/analytics.ts
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') return // 개발 환경 비활성화
  posthog.capture(event, properties)
}

// 사용 예시
trackEvent('timer_completed', { phase: 'focus', minutes: 25 })
trackEvent('focus_mode_entered')
```

추적 이벤트 목록: `timer_started`, `timer_completed`, `focus_mode_entered`, `task_created`, `session_note_written`, `dashboard_viewed`

---

## 기타

- 절대 경로 import 사용 (`@/components/...`)
- 타입은 반드시 `types/index.ts`에서 import
- 색상은 Tailwind 클래스만 사용, 인라인 style 금지

