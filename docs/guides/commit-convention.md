# Git 규칙

모든 작업은 기능 브랜치 → PR → squash merge 순서로 진행하고, main은 항상 배포 가능한 상태로 유지

## 작업 순서

1. 브랜치 생성
2. 커밋할 때마다 변경 내용을 요약해 보여주고 승인을 받은 뒤 커밋과 push를 한 번에 진행
3. PR 만들기 전에 feature 브랜치에서 `git fetch origin && git rebase origin/main` 후 push
4. PR 제목과 본문 초안을 보여주고 승인 후 `gh pr create`
5. 승인 후 `gh pr merge --squash` — merge는 사용자가 아니라 Claude가 처리
6. merge 직후 `git switch main && git pull && git branch -D <merged-branch>`

- 브랜치 생성이나 계획을 승인받았어도 커밋 승인은 커밋할 때마다 따로 받음
- 커밋 승인을 받으면 push는 다시 묻지 않음

## 브랜치

형식은 `<type>/<short-description>`, 설명은 영어 소문자와 하이픈

| type | 용도 |
|---|---|
| `feat/` | 새 기능 |
| `fix/` | 버그 수정 |
| `refactor/` | 기능 변경 없는 코드 개선 |
| `style/` | 기능 변경 없는 UI 스타일 |
| `chore/` | 설정, 패키지, 빌드 |
| `docs/` | 문서 |
| `test/` | 테스트 추가와 보강 |

**브랜치 하나 = 목적 하나**
- 이 브랜치로 무엇이 달라지는지 한 문장으로 설명할 수 있어야 함
- 변경 파일 10개 이하가 목표
- main에 merge해도 앱이 정상 동작해야 함
- 로직과 UI는 나눔 — 예를 들어 `feat/timer-core`와 `feat/timer-ui`

## 커밋 메시지

```
type: 설명
```

- 제목 한 줄만 작성하고 본문은 쓰지 않음, 사용자가 요청할 때만 예외
- type은 영어 소문자, 설명은 한국어로 동사로 시작하고 50자 이내, 마침표 없음
- type은 브랜치 type과 맞춤 — `feat/timer-display`면 `feat: 포모도로 타이머 디스플레이 구현`
- squash commit도 같은 형식
- 호환이 깨지는 변경은 `feat!:`로 쓰고 `BREAKING CHANGE:` 트레일러 추가, 이때만 본문 허용

| type | 용도 |
|---|---|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `style` | 코드 포맷, UI 스타일 |
| `perf` | 성능 개선 |
| `docs` | 문서 |
| `test` | 테스트 |
| `chore` | 패키지, 설정, 빌드 |
| `ci` | CI/CD 설정 |

예시
```
feat: 작업 목록 CRUD 구현
fix: 백그라운드 탭 타이머 드리프트 수정
refactor: localStorage 로직을 lib/storage로 분리
```

커밋 템플릿은 `git config commit.template .gitmessage`로 적용

## PR

- 브랜치 하나가 PR 하나
- 본문은 `.github/pull_request_template.md` 형식을 따름
- 모든 섹션을 짧은 불릿으로 작성하고 문단형 설명은 쓰지 않음
- 해당 없는 섹션과 실제로 확인하지 않은 체크리스트 항목은 통째로 삭제
- 왜 이렇게 구현했나 섹션에 구현 결정의 이유를 남김
