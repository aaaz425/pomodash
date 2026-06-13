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

### 전체 흐름 (Claude가 전담)
1. 브랜치 내 중간 커밋 → **자동으로 진행** (커밋한 브랜치명 응답에 명시, 즉시 push)
2. 작업 완료 → PR 제목/본문 초안 제시 → **승인 후** `gh pr create`
3. **승인 후** `gh pr merge --squash`
4. merge 직후 **반드시** `git fetch origin && git rebase origin/main` 실행
5. 다음 브랜치 생성

### 핵심 규칙
- 커밋 후 항상 **즉시 push**, 브랜치명 응답에 명시
- Squash merge는 **사용자가 직접 하지 않는다** — 반드시 Claude가 처리
- Squash merge 후 rebase 누락 시 이미 머지된 커밋이 다음 PR에 중복 등장함

```bash
# merge 후 항상 실행
git fetch origin && git rebase origin/main
```

- 자세한 내용: `docs/commit-convention.md`

---

## 참조 문서
@docs/data-models.md
@docs/conventions.md
@docs/commit-convention.md

## 주요 결정사항
- AI API 없이도 완전히 작동 (Claude API는 MVP 이후 선택적 추가)
- localStorage만 사용 (로그인 없음, 진입 장벽 최소화)
- 다크 모드 우선 + 라이트 모드 지원 (시스템 설정 연동, 수동 전환 가능)
