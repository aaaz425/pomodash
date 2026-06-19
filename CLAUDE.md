# Pomodash — Claude Context

## 프로젝트 개요

포모도로 타이머 기반 학습 집중 도구. 작업 계획 → 집중 타이머 → 세션 기록 → 대시보드.
자세한 내용: `docs/specs/PRD.md`, `docs/specs/architecture-diagram.md`

## 기술 스택

Next.js 16 (App Router) · Tailwind CSS · shadcn/ui · Zustand · Zod · Recharts · date-fns · react-hook-form · framer-motion · Vercel Analytics · Posthog · Vercel

## 개발 명령어

```bash
npm run dev      # 로컬 개발 서버
npm run build    # 프로덕션 빌드 — 커밋 전 반드시 통과 확인
npm run lint     # 린트
npm run test     # 단위 테스트 (vitest 도입 후)
```

---

## 절대 규칙 (non-obvious — 코드만 봐서는 알 수 없는 것들)

### 작업 순서

- 새 기능 작업 시작 전 **반드시** `docs/roadmap.md`를 읽고 다음에 할 작업을 파악한다
- 파악한 내용을 사용자에게 제시하고 **승인을 받은 후** 브랜치를 생성한다
- 임의로 작업 범위를 결정하거나 브랜치를 생성하지 않는다

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

### 보안

- `NEXT_PUBLIC_` 접두사는 브라우저에 완전히 노출됨 → **API 키에 절대 사용 금지**
- Claude API 키 등 모든 시크릿은 `.env.local`에만, `app/api/` 서버 사이드에서만 사용
- `.env.local` **절대 커밋 금지** — `.gitignore`에 있어도 `git add -f` 사용 금지
- API 라우트 응답은 필요한 필드만 추출해서 반환 — 외부 API 응답 원본을 클라이언트에 그대로 전달 금지
- `dangerouslySetInnerHTML` 사용 금지 — 사용자 입력을 HTML로 렌더링하는 경로 차단

### Verification (커밋 전 필수)

- `npm run build` 통과 확인 (pre-commit hook이 tsc + lint를 강제하지만 미리 확인)
- UI 변경 시 다크/라이트 모드 양쪽 확인
- `lib/`, `store/` 변경 시 관련 단위 테스트 통과 확인

---

## Git 워크플로우

> 1인 개발을 전제로 설계된 워크플로우. 개발 인원 충원 시 역할 분담, 브랜치 보호 규칙 등을 재검토해야 한다.

### 전체 흐름 (Claude가 전담)

1. 브랜치 내 중간 커밋 → **자동으로 진행** (커밋한 브랜치명 응답에 명시, 즉시 push)
2. PR 생성 전 → **반드시** feature 브랜치에서 `git fetch origin && git rebase origin/main` 실행 후 push
3. 작업 완료 → PR 제목/본문 초안 제시 → **승인 후** `gh pr create`
4. **승인 후** `gh pr merge --squash`
5. merge 직후 **반드시** main으로 전환 후 정리
6. 다음 브랜치 생성

### 핵심 규칙

- 커밋 후 항상 **즉시 push**, 브랜치명 응답에 명시
- Squash merge는 **사용자가 직접 하지 않는다** — 반드시 Claude가 처리
- PR 전 rebase 누락 시 GitHub에서 충돌 발생 → **PR 생성 전 반드시 실행**
- 커밋 메시지: `docs/guides/commit-convention.md` 형식만 사용
- PR 본문: `.github/pull_request_template.md` 형식만 사용

### 로드맵 상태 관리 (docs/roadmap.md)

- **브랜치 생성 시** → 해당 항목 `[ ]` → `[>]` 로 변경 후 feature 브랜치에 커밋
- **사용자 승인 후, squash merge 실행 전** → 해당 항목 `[>]` → `[x]` 로 변경 후 feature 브랜치에 커밋·push → 그 다음 merge
  - `[x]` 변경이 squash commit 안에 포함되어 PR 번호와 함께 main에 기록됨
- 두 시점 모두 **예외 없이** roadmap.md 업데이트 후 커밋/머지 진행

```bash
# PR 생성 전 (feature 브랜치에서)
git fetch origin && git rebase origin/main

# merge 후 항상 실행
git switch main && git pull && git branch -D <merged-branch>
```

- 자세한 내용: `docs/guides/commit-convention.md`

---

## 참조 문서

@docs/guides/data-models.md
@docs/guides/conventions.md
@docs/guides/commit-convention.md
@docs/guides/testing.md

## 주요 결정사항

- AI API 없이도 완전히 작동 (Claude API는 MVP 이후 선택적 추가)
- localStorage만 사용 (로그인 없음, 진입 장벽 최소화)
- 다크 모드 우선 + 라이트 모드 지원 (시스템 설정 연동, 수동 전환 가능)
