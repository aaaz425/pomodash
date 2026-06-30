# Conventions

## 폴더 구조

```
app/                  # 라우팅 세그먼트만 — 비즈니스 로직 금지
config/               # 앱 설정 선언 (site.ts, analytics.ts)
components/
  ui/                 # shadcn/ui — 직접 수정 금지
  timer/              # 타이머 feature
  tasks/              # 작업 feature
  dashboard/          # 대시보드 feature
  journal/            # 기록 feature
  settings/           # 설정 feature
  shared/             # 여러 feature에서 공유하는 컴포넌트
    layout/           # 반응형 레이아웃 전용 (app 레이어에서만 사용)
store/                # Zustand 스토어 (createStore 팩토리 패턴)
  StoreProvider.tsx   # SSR 안전 초기화용 Provider — app/layout.tsx에 마운트
hooks/                # 브라우저 API 추상화 + 재사용 로직 훅
lib/
  constants/          # 검증·비즈니스·UX 상수 SSOT (limits, ux, categoryColors, timerColors …)
  storage.ts          # localStorage 추상화 + Zod 파싱
  notifications.ts    # Web Notifications API + 사운드 재생
  dashboard.ts        # 대시보드 집계 순수 함수
  sessionUtils.ts     # 세션 포맷팅·그룹핑
  focusPeriods.ts     # 집중 구간 정규화 알고리즘
  utils.ts            # cn(), generateId() 등 범용 유틸
types/
  models.ts           # TypeScript 인터페이스 + 타입 별칭
  schemas.ts          # Zod 스키마 + 기본값 + STORAGE_KEYS
  index.ts            # barrel (re-export — 기존 import 경로 유지)
```

### 무엇이 어디에 들어가는가

| 코드 종류                      | 위치                         |
| ------------------------------ | ---------------------------- |
| 페이지 라우트, 레이아웃        | `app/`                       |
| 앱 설정·서드파티 초기화        | `config/`                    |
| UI 컴포넌트 (feature별)        | `components/<feature>/`      |
| 여러 feature에서 쓰는 컴포넌트 | `components/shared/`         |
| shadcn/ui 원본                 | `components/ui/` (수정 금지) |
| 전역 상태                      | `store/`                     |
| 재사용 로직 훅                 | `hooks/`                     |
| 검증·비즈니스·UX 상수          | `lib/constants/`             |
| 도메인 순수 함수·유틸          | `lib/`                       |
| TypeScript 인터페이스          | `types/models.ts`            |
| Zod 스키마·기본값              | `types/schemas.ts`           |

### 의존성 방향 규칙

`app/ → components/ → lib/` 단방향만 허용.
`lib/`에서 `components/`나 `app/`을 import하지 않는다.

---

## 네이밍

| 대상          | 규칙                   | 예시               |
| ------------- | ---------------------- | ------------------ |
| 컴포넌트 파일 | PascalCase             | `TimerDisplay.tsx` |
| 스토어 파일   | camelCase + Store      | `timerStore.ts`    |
| 훅 파일       | camelCase + use 접두사 | `useTimer.ts`      |
| 유틸 파일     | camelCase              | `storage.ts`       |
| 타입 이름     | PascalCase             | `TimerState`       |
| 함수/변수     | camelCase              | `remainingSeconds` |

---

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

---

## 기타

- 절대 경로 import 사용 (`@/components/...`)
- 인터페이스는 `types/models.ts`, Zod 스키마는 `types/schemas.ts`, 상수는 `lib/constants`에서 import. `@/types` barrel import도 허용.
- 색상은 Tailwind 클래스만 사용, 인라인 style 금지
