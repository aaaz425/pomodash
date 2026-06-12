# Commit Convention

## 형식

```
type: 설명

[본문 — 선택사항]
```

## 타입

| 타입 | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 포맷, UI 스타일 (기능 변경 없음) |
| `refactor` | 기능 변경 없는 코드 개선 |
| `perf` | 성능 개선 |
| `test` | 테스트 추가/수정 |
| `chore` | 패키지 설치, 설정 변경, 빌드 등 |
| `ci` | CI/CD 설정 변경 |

## 규칙

- `type:` 은 **영어** 소문자
- 설명과 본문은 **한국어**로 작성
- 설명은 **동사로 시작**, 마침표 없음 (`타이머 추가` ✓, `타이머를 추가했습니다` ✗)
- 설명은 **50자 이내**
- 본문은 **WHY**를 설명 (WHAT은 코드가 말함)

## Breaking Changes

```
feat!: localStorage 세션 제거

BREAKING CHANGE: 기존 로컬 세션 데이터가 초기화됩니다.
```

## 예시

```
feat: 집중 세션 종료 알람 소리 추가

fix: 새로고침 시 세션 중복 저장 오류 수정

docs: 시작하기 섹션 추가

chore: zustand, recharts 설치

style: 차트 라벨 다크모드 적용

refactor: localStorage 로직을 lib/storage로 분리
```
