# Conventions

## 폴더 구조

```
app/                        # Next.js App Router 페이지
  (main)/                   # 레이아웃 그룹
    page.tsx                # 메인 (타이머 + 작업 목록)
    dashboard/page.tsx      # 대시보드
    journal/page.tsx        # 기록 히스토리
  api/
    ai/route.ts             # Claude API (선택적)
components/
  ui/                       # shadcn/ui 설치 경로 — 직접 수정 금지
  timer/                    # 타이머 관련 컴포넌트
  tasks/                    # 작업 관련 컴포넌트
  dashboard/                # 대시보드 관련 컴포넌트
  journal/                  # 기록 관련 컴포넌트
store/
  timerStore.ts
  taskStore.ts
  sessionStore.ts
hooks/
  useTimer.ts
  useTasks.ts
lib/
  storage.ts                # localStorage 추상화
  notifications.ts          # Web Notifications
types/
  index.ts                  # 모든 타입 (docs/data-models.md 참조)
```

## 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `TimerDisplay.tsx` |
| 스토어 파일 | camelCase + Store | `timerStore.ts` |
| 훅 파일 | camelCase + use 접두사 | `useTimer.ts` |
| 유틸 파일 | camelCase | `storage.ts` |
| 타입 이름 | PascalCase | `TimerState` |
| 함수/변수 | camelCase | `remainingSeconds` |

## 컴포넌트 규칙

- 서버 컴포넌트 기본, 클라이언트 상태/이벤트 필요 시 `'use client'` 명시
- props 타입은 파일 상단에 `interface Props` 로 정의
- shadcn/ui 컴포넌트 우선 사용, 없을 때만 직접 작성

## Zustand 스토어 패턴

```typescript
interface TimerStore {
  // state
  phase: TimerPhase
  remainingSeconds: number

  // actions
  start: () => void
  pause: () => void
  reset: () => void
}

export const useTimerStore = create<TimerStore>()(
  devtools((set) => ({
    // state 초기값
    // actions
  }))
)
```

## 기타

- 절대 경로 import 사용 (`@/components/...`)
- 타입은 반드시 `types/index.ts`에서 import
- 색상은 Tailwind 클래스만 사용, 인라인 style 금지
