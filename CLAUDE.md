# Pomodash — Claude Context

## 프로젝트 개요
포모도로 타이머 기반 학습 집중 도구. 작업 계획 → 집중 타이머 → 세션 기록 → 대시보드.
포트폴리오 프로젝트 (혼자 개발). 자세한 내용: `docs/vision.md`, `docs/architecture.md`

## 기술 스택
Next.js 16 (App Router) · Tailwind CSS · shadcn/ui · Zustand · Zod · Recharts · date-fns · react-hook-form · framer-motion · Vercel Analytics · Posthog · Vercel

## 개발 명령어
```bash
npm run dev      # 로컬 개발 서버
npm run build    # 프로덕션 빌드 — 커밋 전 반드시 통과 확인
npm run lint     # 린트
```

---

## 절대 규칙 (non-obvious — 코드만 봐서는 알 수 없는 것들)

### Zustand
- `create()` 전역 싱글톤 **금지** → `createStore()` 팩토리 + `StoreProvider` 패턴 사용 (SSR 버그 방지)
- 컴포넌트에서 스토어 전체 구독 **금지** → slice 선택자 필수
```ts
// 금지
const store = useTimerStore((s) => s)
// 허용
const isRunning = useTimerStore((s) => s.startedAt !== null)
```

### localStorage
- 직접 파싱 **금지** → 반드시 Zod 스키마로 런타임 검증 후 사용
- SSR guard 필수: `typeof window === 'undefined'` 체크
- 파싱 실패 시 기본값 fallback (`try/catch` 필수)

### 타이머
- `setInterval` 카운트다운 방식 **금지** → 절대 시간 기반 계산 (백그라운드 탭 throttle 방지)
```ts
// 금지 — 백그라운드에서 드리프트 발생
remainingSeconds - 1
// 허용
targetSeconds - Math.floor((Date.now() - startedAt) / 1000)
```
- `visibilitychange` 이벤트로 탭 복귀 시 즉시 재계산

### 의존성 방향
- `app/ → components/ → lib/` 단방향만 허용
- `lib/`에서 `components/` 또는 `app/` import **금지**
- 타입은 반드시 `types/index.ts`에서만 import (인라인 타입 정의 금지)

### 코드 스타일
- 색상은 Tailwind 클래스만 사용, 인라인 `style={}` 금지
- 절대 경로 import 사용 (`@/components/...`), 상대 경로 금지
- shadcn/ui `components/ui/` 파일 직접 수정 금지 — 래퍼 컴포넌트 사용

---

## Git 워크플로우
- **브랜치 내 중간 커밋**: 자동으로 진행
- **squash commit 메시지 / PR 생성**: 초안 제시 → 승인 후 실행
- **커밋 후 항상 push까지 실행**, 커밋한 브랜치명을 응답에 명시

### Squash merge 후 필수 — 빠뜨리면 이미 머지된 커밋이 다음 PR에 다시 나타남
```bash
git fetch origin && git rebase origin/main
```
새 브랜치 시작 전, 또는 PR이 merge된 브랜치에서 계속 작업하기 전 **반드시** 실행.

- 자세한 내용: `docs/commit-convention.md`

---

## 참조 문서
@docs/data-models.md
@docs/conventions.md
@docs/commit-convention.md

## 주요 결정사항
- AI API 없이도 완전히 작동 (Claude API는 MVP 이후 선택적 추가)
- localStorage만 사용 (로그인 없음, 진입 장벽 최소화)
- 다크 모드 우선 디자인
