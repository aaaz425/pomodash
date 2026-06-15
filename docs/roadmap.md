# Roadmap

기능 명세: `docs/features.md`
브랜치 단위 = PR 단위. 각 항목은 `feat/`, `chore/` 브랜치 하나에 대응.

상태: `[ ]` 대기 · `[>]` 진행 중 · `[x]` 완료

---

## Phase 1 — 타이머

- [x] `chore/project-setup` — Next.js 15 + 패키지 + 폴더 구조 + 스캐폴드
- [ ] `feat/timer-core` — timerStore 완성 (절대시간 기반) + useTimer 훅
- [ ] `feat/timer-ui` — TimerDisplay(링) + TimerControls + CycleIndicator + SessionBadge
- [ ] `feat/focus-mode` — 집중 모드 오버레이 + framer-motion 전환 + 동기부여 메시지
- [ ] `feat/session-settings` — 세션 시작 전 타이머 설정 UI (전역 설정값 기본)
- [ ] `feat/notifications` — 타이머 종료 시 소리 알람 + 브라우저 알림

## Phase 2 — 작업 관리

- [ ] `feat/task-core` — taskStore + Task 타입 확정
- [ ] `feat/task-ui` — TaskList + TaskItem + TaskForm + 카테고리 태그
- [ ] `feat/task-dnd` — 드래그앤드롭 순서 조정

## Phase 3 — 장기 계획

- [ ] `feat/long-term-plan` — LongTermPlan 타입 + CRUD UI + 작업 연결

## Phase 4 — 세션 기록

- [ ] `feat/session-record` — 세션 종료 후 메모 작성 (sessionStore)
- [ ] `feat/journal` — /journal 페이지: 히스토리 조회 + 수정 + 삭제

## Phase 5 — 대시보드

- [ ] `feat/dashboard-core` — 일/주/월 탭 + 집중 시간 집계
- [ ] `feat/dashboard-chart` — 카테고리별 색상 구분 막대 차트 (Recharts)
- [ ] `feat/dashboard-streak` — 연속 기록 (스트릭) 계산 + 표시
- [ ] `feat/dashboard-goal` — 목표 시간 설정 + 달성률
- [ ] `feat/dashboard-longterm` — 장기 계획 진척도

## Phase 6 — 설정

- [ ] `feat/settings` — 타이머 기본값 + 카테고리 관리 + 동기부여 메시지 관리 + 알림 on/off

## Phase 7 — 공통 & 마무리

- [ ] `feat/mini-timer-nav` — 타이머 실행 중 다른 페이지에 있을 때 nav 미니 타이머
- [ ] `chore/analytics` — Vercel Analytics + Posthog 이벤트 연동
- [ ] `chore/pwa` — PWA 아이콘 + 매니페스트 마무리
