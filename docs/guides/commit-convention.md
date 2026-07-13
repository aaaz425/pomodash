# Git 전략

작업 단위와 사고 과정이 GitHub에 명확히 보이도록 설계한다.
모든 작업은 기능 브랜치 → PR → Squash merge 흐름을 따른다.

## 커밋 전 승인

브랜치 생성이나 작업 계획을 승인받았더라도, 그 자체로 커밋 권한이 주어지는 것은 아니다.
**커밋할 때마다** 변경 내용을 요약해 보여주고 승인을 받은 뒤 `git commit`을 실행한다.
승인이 오면 커밋과 push는 한 세트로 바로 진행한다(push만 별도로 다시 묻지 않음).

---

## 브랜치 전략

`main` 브랜치는 항상 배포 가능한 상태를 유지한다.
모든 작업은 기능 브랜치에서 진행하고, main에는 PR로만 반영한다.

### 브랜치 네이밍

`<type>/<short-description>` 형식. 설명은 영어 소문자 + 하이픈.

| 타입        | 용도                       |
| ----------- | -------------------------- |
| `feat/`     | 새 기능                    |
| `fix/`      | 버그 수정                  |
| `chore/`    | 설정, 패키지, 빌드         |
| `docs/`     | 문서 수정                  |
| `refactor/` | 기능 변경 없는 코드 개선   |
| `style/`    | UI 스타일 (기능 변경 없음) |
| `test/`     | 테스트 코드 추가/보강 (기능 변경 없음) |

```
feat/timer-core
feat/timer-ui
feat/task-crud
fix/timer-drift
chore/project-setup
refactor/storage-abstraction
test/timer-store-coverage
```

### 브랜치 단위 기준

**하나의 브랜치 = 하나의 "왜"** — 단일 목적으로 설명할 수 있어야 한다.

| 기준   | 내용                                                    |
| ------ | ------------------------------------------------------- |
| 크기   | 변경 파일 10개 이하를 목표                              |
| 목적   | "이 브랜치로 무엇이 달라지는가"를 한 문장으로 설명 가능 |
| 독립성 | main에 merge했을 때 앱이 정상 동작해야 함               |

**쪼개는 기준:** 로직(store, hook)과 UI(component)는 분리한다.

```
# 나쁨 — 타이머 전부를 하나로
feat/timer

# 좋음 — 레이어별로 분리
feat/timer-core   (timerStore, useTimer, 절대시간 로직)
feat/timer-ui     (TimerDisplay, TimerControls 컴포넌트)
```

**Pomodash MVP 브랜치 계획 예시:**

```
chore/project-setup          # Next.js 16 + 패키지 초기 설정
feat/timer-core              # timerStore + 절대시간 기반 로직
feat/timer-ui                # 타이머 디스플레이 + 집중 모드 전환
feat/task-crud               # 작업 목록 CRUD + 카테고리
feat/session-record          # 세션 종료 메모 기록
feat/dashboard               # 공부 시간 차트 + 스트릭
feat/notifications           # 브라우저 알림 + 소리
feat/motivational-message    # 동기부여 메시지
```

---

## PR 전략

PR은 작업 단위와 사고 과정을 남기는 핵심 도구다.
브랜치 단위 = PR 단위. `.github/pull_request_template.md` 형식을 따른다.

### PR 단위 기준

브랜치 단위와 동일하게 **단일 목적**을 유지한다.
PR description에서 "왜 이렇게 구현했나" 항목이 가장 중요하다 — 구현 결정 이유를 구체적으로 남긴다.

### Merge 방식

**Squash merge** 사용.
브랜치의 중간 커밋(`wip:`, `typo` 등)이 main에 노출되지 않고, PR 단위 한 줄로 정리된다.

**Squash merge는 Claude가 전담한다.** 사용자가 직접 merge하면 이후 rebase가 누락될 수 있음.

### Squash merge 절차 (Claude 전담)

1. PR 생성 전 feature 브랜치에서 반드시 실행:

```bash
git fetch origin && git rebase origin/main
```

2. PR 제목/본문 초안 제시 → 승인 후 `gh pr create`
3. 승인 후 `gh pr merge --squash`
4. **merge 직후 반드시 실행:**

```bash
git switch main && git pull && git branch -D <merged-branch>
```

PR 전 rebase를 빠뜨리면 main에 쌓인 커밋과 충돌이 발생한다.

---

## 커밋 컨벤션

브랜치 내 작업 커밋도 squash merge로 main에서 사라지지만, Claude가 작성하는 커밋은 브랜치 내 커밋이든 **main에 남는 squash commit**이든 항상 아래 형식을 동일하게 따른다.

### 형식

```
type: 설명
```

**본문(body) 없이 제목 한 줄만 작성한다.** WHY를 설명하고 싶어도 본문을 붙이지 않는다 — 사용자가 명시적으로 본문을 요청할 때만 예외로 짧게 추가한다. Breaking Change 트레일러(`BREAKING CHANGE: ...`)는 이 규칙의 예외로, 필요할 때는 그대로 사용한다.

### 타입

| 타입       | 용도                                  |
| ---------- | ------------------------------------- |
| `feat`     | 새 기능                               |
| `fix`      | 버그 수정                             |
| `docs`     | 문서 수정                             |
| `style`    | 코드 포맷, UI 스타일 (기능 변경 없음) |
| `refactor` | 기능 변경 없는 코드 개선              |
| `perf`     | 성능 개선                             |
| `chore`    | 패키지 설치, 설정 변경, 빌드 등       |
| `ci`       | CI/CD 설정 변경                       |
| `test`     | 테스트 코드 추가/수정                 |

### 규칙

- `type:` 은 **영어** 소문자
- 설명은 **한국어**, 동사로 시작, 마침표 없음
- 설명은 **50자 이내**
- 브랜치 네이밍의 type과 일치시킨다 (`feat/timer-display` → `feat: 포모도로 타이머 디스플레이 구현`)

### 예시

```
feat: 포모도로 타이머 기본 구현
feat: 작업 목록 CRUD 구현
fix: 백그라운드 탭 타이머 드리프트 수정
chore: Next.js 16, shadcn/ui, Zustand 초기 설정
style: 대시보드 다크모드 색상 보정
refactor: localStorage 로직을 lib/storage로 분리
```

### Breaking Changes

```
feat!: localStorage 세션 구조 변경

BREAKING CHANGE: 기존 로컬 세션 데이터가 초기화됩니다.
```

### 커밋 템플릿 적용

`.gitmessage`를 git 커밋 에디터 기본 템플릿으로 설정한다.

```bash
git config commit.template .gitmessage
```

