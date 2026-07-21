# Roadmap

기능 명세: `docs/specs/feature-spec.md`
브랜치 단위 = PR 단위. 각 항목은 `feat/`, `chore/` 브랜치 하나에 대응한다.

상태: `[ ]` 대기 · `[>]` 진행 중 · `[x]` 완료

---

## Phase 1 — 타이머

- [x] `chore/project-setup` — Next.js 16 + 패키지 + 폴더 구조 + 스캐폴드
- [x] `feat/timer-core` — timerStore 완성 (절대시간 기반) + useTimer 훅
- [x] `feat/timer-ui` — TimerDisplay(링) + TimerControls + CycleIndicator + SessionBadge
- [x] `feat/focus-mode` — 집중 모드 오버레이 + framer-motion 전환 + 동기부여 메시지
- [x] `feat/session-settings` — 세션 시작 전 타이머 설정 UI (전역 설정값 기본)

## Phase 2 — 작업 관리

- [x] `feat/task-core` — taskStore + Task 타입 확정
- [x] `feat/task-ui` — TaskList + TaskItem + TaskForm + 카테고리 태그
- [x] `feat/task-dnd` — 드래그앤드롭 순서 조정

## Phase 3 — 세션 기록

- [x] `feat/session-record` — 세션 종료 후 메모 작성 (sessionStore)
- [x] `feat/journal` — /journal 페이지: 히스토리 조회 + 수정 + 삭제

## Phase 4 — 대시보드

- [x] `feat/dashboard-core` — 일/주/월 탭 + 집중 시간 집계
- [x] `feat/dashboard-charts` — 집중 시간 추이 차트 + 카테고리별 도넛 차트 (Recharts)
- [x] `feat/dashboard-streak` — 연속 기록 (스트릭) 계산 + 표시

## Phase 5 — 설정

- [x] `feat/settings` — 타이머 기본값 + 카테고리 관리 + 동기부여 메시지 관리 + 알림 on/off
- [x] `feat/notifications` — 타이머 종료 시 소리 알람 + 브라우저 알림

## Phase 6 — 공통 & 마무리 (MVP 완료)

- [x] `style/loading-error-ui` — PageSpinner 추출 + loading 개선 + error 재디자인 + 404 페이지
- [x] `feat/mini-timer-nav` — 타이머 실행 중 다른 페이지에 있을 때 nav 미니 타이머
- [x] `chore/pwa` — PWA 아이콘 + 매니페스트 마무리
- [x] `chore/vercel-deploy` — Vercel 프로젝트 연결
- [x] `chore/analytics` — Vercel Analytics + Posthog 이벤트 연동

## Phase 6-a — 서비스 고도화

- [x] `style/landing-and-ui-polish` — 랜딩 페이지, 모바일 레이아웃/버튼/모달 UI 개선, 설정 앱 정보
- [x] `fix/desktop-bottom-padding` — PC/태블릿 화면 하단 여백 부족 수정 (macOS Dock 가림 등)
- [x] `refactor/settings-modal` — 설정 페이지 타이머/카테고리/동기부여/알림을 모달 메뉴 방식으로 정리
- [x] `feat/notification-sound-options` — 알림 소리 종류 선택 + 음량 조절 (localStorage 영속)

## Phase 6-b — 차별화 기능

- [x] `feat/free-stopwatch-mode` — 고정 사이클 없이 자유롭게 측정하는 스톱워치 모드
- [x] `feat/badge-collection` — 스트릭/누적시간/다양성/특별 이벤트 뱃지 수집
- [>] `feat/share-card` — 집중 요약 공유 카드 (클라이언트 Canvas 생성)

## Phase 7 — 백엔드 & 동기화

- [ ] `chore/supabase-migration` — localStorage → Supabase 마이그레이션 (로그인, 동기화)
- [ ] `style/skeleton-ui` — 페이지별 스켈레톤 로딩 UI (supabase-migration 완료 후)

## Phase 8 — 네이티브 앱

- [ ] `chore/rn-setup` — React Native (Expo) 프로젝트 초기 설정 + 공유 로직 분리
- [ ] `feat/rn-timer` — 네이티브 타이머 (백그라운드 알림 포함)
- [ ] `feat/rn-tasks` — 작업 목록 네이티브 UI
- [ ] `feat/rn-sync` — 웹 ↔ 앱 데이터 동기화 (Supabase 기반)

