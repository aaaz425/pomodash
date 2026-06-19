---
version: 1.0
---

# Testing Strategy

## 두 레이어 전략

| 레이어 | 도구       | 실행 시점                                        |
| ------ | ---------- | ------------------------------------------------ |
| Unit   | Vitest     | 기능 개발 중, pre-commit hook (vitest 도입 후)   |
| E2E    | Playwright | PR 생성 시 GitHub Actions 자동 실행, 로컬 수동 가능 |

---

## Unit 테스트 (Vitest)

### 언제 도입하는가

각 핵심 레이어(`lib/`, `store/`)를 구현할 때 함께 작성한다.

### 무엇을 테스트하는가

브라우저 없이 실행 가능한 순수 로직만. UI 컴포넌트는 MVP 범위에서 제외.

| 대상                   | 핵심 테스트 케이스                                                     |
| ---------------------- | ---------------------------------------------------------------------- |
| `lib/storage.ts`       | Zod 파싱 실패 시 fallback 반환, SSR 환경(`window === undefined`) guard |
| `store/timerStore.ts`  | `pause()` 후 `startedAt === null`, 절대시간 기반 잔여 시간 계산        |
| `lib/notifications.ts` | 권한 없을 때 조용히 실패                                               |

### 파일 위치

테스트 대상 파일과 같은 폴더, `*.test.ts` 확장자.

```
lib/
  storage.ts
  storage.test.ts   ← 여기
store/
  timerStore.ts
  timerStore.test.ts
```

### 테스트 퍼스트 패턴

구현 요청 전에 실패하는 테스트를 먼저 작성하고, Claude에게 통과시키도록 지시한다.

```
"timerStore의 pause() 호출 시 startedAt이 null이 되어야 한다는
테스트를 먼저 작성해줘. 그 다음에 통과시켜줘."
```

### lefthook 연동 (vitest 설치 후 lefthook.yml에서 주석 해제)

```yaml
pre-commit:
  commands:
    unit-test:
      run: npm run test -- --run
```

---

## E2E 테스트 (Playwright)

### 언제 실행하는가

PR 생성 시 GitHub Actions(`.github/workflows/e2e.yml`)에서 자동 실행.
로컬에서 수동 실행도 가능.

```bash
npm run test:e2e
```

### 핵심 플로우

```
tests/e2e/
  timer.spec.ts     # 타이머 시작 → 일시정지 → 재개 → 완료
  tasks.spec.ts     # 작업 생성 → 타이머 연결 → 세션 종료
  dashboard.spec.ts # 집계 데이터 표시 확인
```

### 브라우저 설정

Chromium 단일 브라우저 실행. `playwright.config.ts` 참고.
CI에서는 `retries: 2`, 로컬에서는 개발 서버가 이미 떠 있으면 재사용.

---

## 패키지 설치 현황

| 패키지 | 상태 |
|--------|------|
| `@playwright/test` | 설치됨 |
| `vitest` | 미설치 — 도입 시 `npm install -D vitest @vitejs/plugin-react` |
