# 화면정의서 — Screen Specification

> **버전:** 1.1 · **기준:** Phase 6-b 완료

---

## 공통 사항

### 반응형 레이아웃 분기

| 브레이크포인트            | 레이아웃       | 네비게이션                        |
| ------------------ | ---------- | ---------------------------- |
| 모바일 (< 768px)      | 단일 컬럼      | BottomNav (하단, 상단 바 없음)     |
| 태블릿 (768px–1024px) | 단일 컬럼      | IconSidebar (좌측 아이콘)         |
| 데스크탑 (≥ 1024px)    | 사이드바 + 콘텐츠 | Sidebar (좌측 전체)              |

모바일은 별도 상단 바(TopBar) 없이 콘텐츠가 바로 시작되고 safe-area-inset-top 여백만 적용된다. 네비게이션 4개 탭(타이머 `/` · 통계 `/dashboard` · 기록 `/journal` · 설정 `/settings`)은 `components/shared/layout/navItems.ts`의 `NAV_ITEMS`를 세 레이아웃이 공유한다.

### 공통 컴포넌트

| 컴포넌트        | 경로                                         | 역할           |
| ----------- | ------------------------------------------ | ------------ |
| BottomNav   | `components/shared/layout/BottomNav.tsx`   | 모바일 하단 네비게이션 |
| IconSidebar | `components/shared/layout/IconSidebar.tsx` | 태블릿 아이콘 사이드바 |
| Sidebar     | `components/shared/layout/Sidebar.tsx`     | 데스크탑 사이드바    |
| PageSpinner | `components/shared/PageSpinner.tsx`        | 로딩 상태        |
| AppToaster  | `components/shared/AppToaster.tsx`         | 토스트 알림 컨테이너  |
| MiniTimerWidget | `components/timer/MiniTimerWidget.tsx` | 타이머 화면 외 다른 페이지에서 뜨는 플로팅 미니 타이머 |
| AbandonedSessionDialog | `components/timer/AbandonedSessionDialog.tsx` | 일시정지 세션 방치 감지 시 전 페이지 공용으로 뜨는 다이얼로그 |

MiniTimerWidget과 AbandonedSessionDialog는 `app/(main)/layout.tsx`에 상시 마운트되어 있어 특정 화면 전용이 아니라 `/(main)` 하위 모든 페이지에서 조건부로 나타난다.

테마 전환은 별도 헤더 토글이 없고, 설정 화면의 `ThemeSection`(인라인 라이트/다크/시스템 버튼) 하나로만 이루어진다. `components/shared/ThemeInit.tsx`는 초기 테마 값을 적용하는 마운트 전용 컴포넌트다.

### 테마

- 다크 모드 기본, 라이트 모드 지원
- 시스템 설정 연동 + 수동 전환 (설정 화면의 ThemeSection)
- 색상 토큰: 딥 네이비 계열(다크) / 뉴트럴 화이트 계열(라이트), 민트 포인트

---

## 화면 1 — 랜딩 페이지

**경로:** `/` (랜딩 전용 레이아웃, 네비게이션 없음)
**파일:** `app/landing/page.tsx`
**목적:** 신규 방문자에게 서비스를 소개하고 메인 화면 진입을 유도한다.

### 컴포넌트

| 컴포넌트    | 경로        | 설명                    |
| ------- | --------- | --------------------- |
| LandingHeader | `components/landing/LandingHeader.tsx` | 로고 + 시작하기 버튼 |
| LandingHero | `components/landing/LandingHero.tsx` | 타이틀 + 서브카피 + CTA |
| LandingFeatures | `components/landing/LandingFeatures.tsx` | 주요 기능 소개 |
| LandingHowItWorks | `components/landing/LandingHowItWorks.tsx` | 사용 흐름 설명 |
| LandingCtaSection | `components/landing/LandingCtaSection.tsx` | 하단 CTA |
| LandingFooter | `components/landing/LandingFooter.tsx` | 푸터 |
| LandingCTA | `components/landing/LandingCTA.tsx` | 헤더/히어로/하단에서 공용으로 쓰는 CTA 버튼 |

### 인터랙션

| 액션                 | 동작                |
| ------------------ | ----------------- |
| "시작하기" / CTA 버튼 클릭 | `/(main)`(메인 화면)으로 이동 |
| 헤더 로고 클릭           | 랜딩 페이지 최상단 스크롤    |

### 에지케이스

- 기존 사용자(localStorage에 세션/작업 데이터 있음)도 랜딩으로 진입 가능 — 별도 리다이렉트 없음

---

## 화면 2 — 메인 (타이머)

**경로:** `/(main)`
**파일:** `app/(main)/page.tsx`
**목적:** 타이머 실행이 중심인 화면. 작업 선택은 세션 시작 모달을 통해 이루어진다.

페이지는 `TimerSection` · `SessionRecordModal` · `FocusMode` 3개만 렌더링한다. 작업 목록(`TaskList`)은 화면에 상시 노출되지 않고, `StartSessionModal`과 `SessionTaskSelector` 내부(둘 다 `TaskList mode="select"` 재사용)에서만 나타난다.

### 컴포넌트 트리

```
TimerSection
├─ 현재 작업 표시 (CategoryBadge + 제목, 없으면 "선택된 작업이 없습니다")
├─ TimerRing (내부에 TimerGlow 포함, 원형 SVG + 중앙 시간/상태뱃지)
├─ CycleIndicator (mode==='free'면 렌더링 안 함)
├─ 세션 설정 카드 (집중/휴식/사이클 3분할 표시)
└─ TimerControls
    ├─ "집중" 버튼 (실행 중일 때만 활성) → enterFocusMode()
    ├─ 시작/일시정지 버튼 (세션 미시작 시 StartSessionModal 오픈)
    ├─ "세션 종료" 버튼 → ConfirmDialog
    └─ StartSessionModal (조건부 마운트)
        └─ TaskList(mode="select") + SegmentedControl(포모도로/자유) + TimerSettingsGroup
SessionRecordModal (세션 종료 후에만 마운트)
└─ SessionTaskSelector (미분류 세션에 사후 작업 지정 시)
    └─ TaskList(mode="select")
FocusMode (집중 모드 진입 시 AnimatePresence로 마운트)
```

### 컴포넌트 표

| 컴포넌트             | 경로                                       | 설명                       |
| ---------------- | ---------------------------------------- | ------------------------ |
| TimerSection     | `components/timer/TimerSection.tsx`      | 메인 타이머 전체 조립             |
| TimerRing        | `components/timer/TimerRing.tsx`         | 원형 진행률 링 + 시간/상태 표시 (TimerGlow 포함) |
| TimerGlow        | `components/timer/TimerGlow.tsx`         | phase별 blur 배경광 (장식용)    |
| SessionProgressBadge | `components/timer/SessionProgressBadge.tsx` | 세션 진행 요약(사이클 또는 자유모드 경과 시간) |
| TimerControls    | `components/timer/TimerControls.tsx`     | 집중모드 진입/시작·일시정지/종료 버튼    |
| CycleIndicator   | `components/timer/CycleIndicator.tsx`    | 사이클 진행 점 표시 (자유 모드는 숨김)  |
| StartSessionModal | `components/timer/StartSessionModal.tsx` | 세션 시작 전 작업/모드/설정 선택      |
| SessionTaskSelector | `components/timer/SessionTaskSelector.tsx` | 세션 종료 후 미분류 세션에 작업 사후 지정 |
| TaskList         | `components/tasks/TaskList.tsx`          | 작업 목록 (select/manage 겸용), 드래그 정렬 |
| TaskItem         | `components/tasks/TaskItem.tsx`          | 개별 작업 행                  |
| TaskFormModal    | `components/tasks/TaskFormModal.tsx`     | 작업 생성/수정 모달             |

### 타이머 상태별 UI

| 상태       | 표시                                 |
| -------- | ---------------------------------- |
| 대기(idle) | 시작 버튼, 링 비어있음                      |
| 집중 실행 중  | 일시정지 버튼 + 종료 버튼, 링 진행, 집중 모드 버튼 활성 |
| 휴식 실행 중  | 일시정지 버튼 + 종료 버튼, 링 다른 색상           |
| 일시정지     | 재개 버튼                              |
| 사이클 완료   | 다음 단계 선택 안내                        |

### 인터랙션

| 액션       | 동작                     |
| -------- | ---------------------- |
| 세션 미시작 상태에서 시작 버튼 클릭 | StartSessionModal 오픈 |
| 모달에서 작업 선택 | 작업의 목표 시간/사이클이 세션 설정에 자동 반영 |
| 모달 "시작" 클릭 | 작업/설정/모드 확정 후 타이머 시작 |
| TaskList 하단 "새 작업 추가" | TaskFormModal 오픈, 저장 시 자동 선택까지 이어짐 (인라인 빠른 추가 UI는 없음) |
| "집중" 버튼(실행 중만 활성) | 전체화면 FocusMode 진입 |
| 세션 종료    | 확인 후 SessionRecordModal 표시 |

### 미니 타이머 / 방치 감지

- 타이머 실행 중 다른 페이지(`/dashboard`, `/journal`, `/settings`)로 이동하면 MiniTimerWidget이 플로팅으로 뜬다. 클릭하면 메인 화면으로 돌아간다.
- 일시정지 상태로 일정 시간 방치되면 AbandonedSessionDialog가 표시되어 이어가기/종료하고 기록/폐기 중 선택한다.

### 에지케이스

- 작업 없음: "작업을 추가해서 집중을 시작해보세요" 빈 상태
- 작업 미선택 상태에서 타이머 시작: 미분류 세션으로 기록

---

## 화면 3 — 집중 모드

**경로:** 메인 화면 오버레이 (별도 URL 없음)
**파일:** `components/timer/FocusMode.tsx`
**목적:** 타이머와 동기부여 메시지만 노출해 집중 환경을 만든다.

`TimerRing`(+`TimerGlow`)과 `CycleIndicator`를 `TimerSection`과 그대로 재사용한다. 동기부여 메시지는 별도 컴포넌트 없이 `FocusMode.tsx` 내부 인라인 `motion.p` + `hooks/useRotatingMessage.ts` 훅 조합으로 구현되어 있으며, 설정에서 사용자가 편집한 메시지 목록에서 일정 간격마다 무작위로 교체된다.

### 컴포넌트

| 컴포넌트                | 설명                                                   |
| ------------------- | ---------------------------------------------------- |
| TimerRing (확대)   | TimerSection과 공용, 집중 모드에서는 확대된 크기로 렌더링                               |
| useRotatingMessage 훅 | `hooks/useRotatingMessage.ts` — 설정의 동기부여 메시지 목록을 일정 간격으로 무작위 교체 |
| 종료 버튼               | 집중 모드 나가기 (타이머 유지)                                   |

### 인터랙션

| 액션    | 동작                                 |
| ----- | ---------------------------------- |
| 우상단 X 버튼 | 집중 모드만 종료, 세션은 유지되고 메인 화면으로 복귀 |
| Space 키 | 시작/일시정지 토글 |
| ESC 키 | 종료확인 다이얼로그가 열려있으면 취소, 아니면 집중 모드 종료 |

---

## 화면 4 — 대시보드

**경로:** `/(main)/dashboard`
**파일:** `app/(main)/dashboard/page.tsx`, `components/dashboard/DashboardView.tsx`
**목적:** 집중 기록을 집계해 시각화하고 성취감을 준다.

탭(오늘/이번 주/이번 달/전체)에 따라 컴포넌트가 나타나거나 숨겨지지 않는다. `StatCard`×4, `FocusChart`, `CategoryChart`, `HourlyChart`, `MonthlyActivityCard`+`ContributionCalendar`, `BadgeGallery`가 항상 동시에 렌더링되고, 탭 전환은 `StatCard`/`FocusChart`/`CategoryChart`에 전달되는 데이터 필터링에만 영향을 준다. `HourlyChart`(24시간 고정), `MonthlyActivityCard`/`ContributionCalendar`(항상 당월 고정), `BadgeGallery`(항상 전체 세션 기준)는 탭 값을 받지 않는다.

### 컴포넌트 트리

```
DashboardView
├─ 헤더 (제목 + 공유 아이콘 버튼 → ShareCardModal 오픈)
├─ DashboardTabs (오늘/이번 주/이번 달/전체)
├─ StatCard ×4 (집중시간/세션수/연속집중일/세션평균, 전일·전주·전월 대비 증감 표시)
├─ FocusChart (탭 단위 구간별 카테고리 누적 막대) + SrOnlyDataTable
├─ CategoryChart (카테고리별 비율 도넛) + SrOnlyDataTable
├─ HourlyChart (0~23시 커스텀 막대) + SrOnlyDataTable
├─ MonthlyActivityCard → ContributionCalendar (월요일 시작 히트맵, 4단계 음영)
├─ BadgeGallery (기본: 획득 뱃지만, "뱃지 모두 보기"로 미획득 포함 전체) → BadgeMedal ×N
└─ ShareCardModal (조건부 마운트, canvas로 공유 카드 렌더링)
```

### 컴포넌트 표

| 컴포넌트            | 경로                                      | 설명                |
| --------------- | --------------------------------------- | ----------------- |
| DashboardTabs    | `components/dashboard/DashboardTabs.tsx` | 오늘/이번 주/이번 달/전체 탭 |
| StatCard         | `components/dashboard/StatCard.tsx`      | 라벨+아이콘+값+증감 통계 카드 |
| FocusChart       | `components/dashboard/FocusChart.tsx`    | 탭 단위 구간별 집중 시간 막대 차트 (Recharts) |
| CategoryChart    | `components/dashboard/CategoryChart.tsx` | 카테고리별 비율 도넛 차트 (Recharts) |
| HourlyChart      | `components/dashboard/HourlyChart.tsx`   | 시간대별 집중량 커스텀 막대 (Recharts 미사용) |
| MonthlyActivityCard | `components/dashboard/MonthlyActivityCard.tsx` | "이달의 잔디" 카드 |
| ContributionCalendar | `components/dashboard/ContributionCalendar.tsx` | 월 단위 집중 히트맵 그리드 |
| BadgeGallery     | `components/dashboard/BadgeGallery.tsx`  | 뱃지 획득 현황 + 펼치기/접기 |
| BadgeMedal       | `components/dashboard/BadgeMedal.tsx`    | tier별 메달 + 호버 툴팁  |
| ShareCardModal   | `components/dashboard/ShareCardModal.tsx` | 집중 요약 PNG 공유 카드 |
| SrOnlyDataTable  | `components/dashboard/SrOnlyDataTable.tsx` | 차트별 스크린리더 전용 표 |

### 인터랙션

| 액션         | 동작                |
| ---------- | ----------------- |
| 탭 전환       | StatCard 4개/FocusChart/CategoryChart 데이터만 재계산 |
| 공유 아이콘 클릭 | ShareCardModal 오픈, 현재 탭 기준 요약 데이터로 카드 생성 |
| 공유 카드 "다운로드"/"공유" | PNG 저장 / Web Share API(지원 환경만 노출) |
| "뱃지 모두 보기" / "접기" | 미획득 포함 전체 뱃지 노출 / 획득 뱃지만 노출 토글 |
| 뱃지 hover | 이름+설명 툴팁 (미획득 시 "(미획득)") |

### 에지케이스

- 데이터 없음: "아직 기록이 없어요. 타이머를 시작해볼까요?" + 메인 링크
- 삭제된 카테고리의 세션: 차트에 "미분류"로 표시

---

## 화면 5 — 저널 (리스트/캘린더 + 인사이트)

**경로:** `/(main)/journal`
**파일:** `app/(main)/journal/page.tsx`, `components/journal/JournalView.tsx`
**목적:** 저장된 세션 기록을 리스트 또는 캘린더로 조회하고, 집중도/방해요소 기반 인사이트를 제공하며, 기록을 수정/삭제한다.

세션이 0개면 `JournalEmptyState`만 표시한다. 세션이 있으면 `InsightsSection`(탭과 무관하게 항상 노출)과 `JournalTabs`(list/calendar) + 선택된 탭 뷰, 그리고 세션 선택 시 공용으로 뜨는 `SessionDetailOverlay`를 렌더링한다.

### 컴포넌트 트리

```
JournalView
├─ 헤더 ("기록" + JournalTabs, 세션 있을 때만 탭 노출)
├─ (세션 0개) JournalEmptyState  또는
├─ InsightsSection → InsightCard ×4 (방해요소/집중도추이/카테고리/요일패턴)
├─ activeTab==='list' → ListView
│   ├─ 상단: "N개의 세션" + 필터 버튼(활성 필터 시 점 표시)
│   ├─ JournalSessionList → SessionListItem ×N (날짜별 그룹)
│   └─ JournalFilterModal (검색/카테고리/기간)
│       ├─ JournalSearchField
│       ├─ JournalCategoryFilter
│       └─ JournalDateRangeFilter
├─ activeTab==='calendar' → CalendarView
│   ├─ CalendarMonthNav (이전/다음 해·달, 오늘 버튼)
│   ├─ CalendarMonthGrid (월요일~일요일 그리드, 일별 집중분 뱃지)
│   └─ CalendarDayModal (날짜 선택 시 해당일 SessionListItem 목록)
└─ SessionDetailOverlay (세션 선택 시, 모바일 하단시트/데스크톱 중앙팝업)
    └─ JournalDetailPanel
        ├─ 작업명+CategoryBadge, 날짜/시간범위
        ├─ FocusRatingPicker (집중도 3단계)
        ├─ DistractionTagPicker (방해요소 태그, 다중 선택)
        ├─ JournalNoteEditor (클릭 시 인라인 편집모드, 별도 모달 아님)
        ├─ 통계(집중시간 / 사이클 또는 자유 집중 시간)
        └─ "세션 삭제" → ConfirmDialog
```

`JournalDetailPanel`은 리스트뷰/캘린더뷰 어느 쪽에서 세션을 클릭해도 공통으로 열리는 상세 콘텐츠다. `SessionDetailOverlay`는 그 콘텐츠를 담는 반응형 Dialog 셸이다.

### 컴포넌트 표

| 컴포넌트            | 경로                                      | 설명              |
| --------------- | --------------------------------------- | --------------- |
| JournalView      | `components/journal/JournalView.tsx`    | 탭/필터/선택 세션 상태 관리, 전체 조립 |
| JournalTabs      | `components/journal/JournalTabs.tsx`    | list/calendar 탭 |
| InsightsSection / InsightCard | `components/journal/InsightsSection.tsx`, `InsightCard.tsx` | 방해요소·집중도추이·카테고리·요일패턴 인사이트 |
| ListView         | `components/journal/ListView.tsx`       | 검색/필터 버튼 + 세션 목록 조립 |
| JournalSessionList / SessionListItem | `components/journal/JournalSessionList.tsx`, `SessionListItem.tsx` | 날짜별 그룹 목록 / 개별 세션 행 |
| JournalFilterModal | `components/journal/JournalFilterModal.tsx` | 검색+카테고리+기간 통합 필터 |
| CalendarView     | `components/journal/CalendarView.tsx`   | 월 네비게이션 + 그리드 조립 |
| CalendarMonthGrid | `components/journal/CalendarMonthGrid.tsx` | 월간 히트맵 그리드 |
| CalendarDayModal | `components/journal/CalendarDayModal.tsx` | 선택 날짜의 세션 목록 모달 |
| SessionDetailOverlay | `components/journal/SessionDetailOverlay.tsx` | 반응형 Dialog 셸 |
| JournalDetailPanel | `components/journal/JournalDetailPanel.tsx` | 세션 상세(집중도/방해요소/메모/통계/삭제) |
| JournalNoteEditor | `components/journal/JournalNoteEditor.tsx` | 메모 인라인 편집(500자 제한) |
| JournalEmptyState | `components/journal/JournalEmptyState.tsx` | 세션 0개일 때 안내 |
| CategoryBadge   | `components/shared/CategoryBadge.tsx`   | 카테고리 색상 뱃지      |
| ConfirmDialog   | `components/shared/ConfirmDialog.tsx`   | 삭제 확인           |

### 인터랙션

| 액션       | 동작                         |
| -------- | -------------------------- |
| list/calendar 탭 전환 | ListView ↔ CalendarView 전환 (InsightsSection은 유지) |
| 리스트뷰 필터 버튼 클릭 | JournalFilterModal 오픈 |
| 필터 적용 | `useJournalFilters` 훅이 세션 필터링 후 날짜별 재그룹핑 |
| 세션 항목 클릭(리스트/캘린더 공통) | SessionDetailOverlay + JournalDetailPanel 오픈 |
| 캘린더 날짜 클릭(집중기록 있는 날만 활성) | CalendarDayModal 오픈, 해당일 세션 목록 표시 |
| 상세 패널에서 메모 클릭 | 인라인 편집모드(저장/취소) |
| 상세 패널에서 집중도/방해요소 선택 | 즉시 세션에 반영 |
| "세션 삭제"    | ConfirmDialog → 확인 시 세션 제거, 오버레이 자동 닫힘 |

### 에지케이스

- 기록 없음: JournalEmptyState + "타이머로 이동" 링크
- 필터 결과 0건: 세션 자체가 없는 것과 별개로 "검색 결과가 없어요" 인라인 표시
- 캘린더뷰에서 미래 날짜/기록 없는 날 클릭: 버튼 비활성화

---

## 화면 6 — 설정

**경로:** `/(main)/settings`
**파일:** `app/(main)/settings/page.tsx`, `components/settings/SettingsView.tsx`
**목적:** 타이머 기본값, 작업/카테고리 관리, 동기부여 메시지, 알림, 테마, 앱 정보를 관리한다.

한 페이지 아코디언 방식이 아니라 두 그룹으로 나뉜다. (1) 인라인형 — 모달 없이 그 자리에서 바로 조작하는 `ProfileSection`(닉네임), `ThemeSection`(테마), `InstallSection`(PWA 설치), `AboutSection`(앱 정보). (2) 모달형 — `SettingsMenuRow`(아이콘+라벨+요약값+화살표)를 클릭하면 대응 모달이 열리는 타이머 기본값/작업 관리/카테고리 관리/동기부여 메시지/알림. `SettingsView`는 `openMenu` 단일 state로 5개 모달을 배타 제어한다.

작업 관리 모달 안에 "카테고리 관리" 버튼이 있어 클릭하면 카테고리 목록 모달이 그 위에 중첩되고, 목록 모달에서 추가/편집을 누르면 카테고리 편집 모달이 다시 그 위에 중첩된다(최대 3중 모달).

### 컴포넌트

| 컴포넌트               | 경로                                         | 형태                        |
| ------------------ | ------------------------------------------ | ------------------------- |
| ProfileSection | `components/settings/ProfileSection.tsx` | 인라인 — 닉네임 입력+저장 |
| ThemeSection | `components/settings/ThemeSection.tsx` | 인라인 — 라이트/다크/시스템 버튼 |
| InstallSection | `components/settings/InstallSection.tsx` | 인라인 — PWA 설치 상태별 안내/버튼 |
| AboutSection | `components/settings/AboutSection.tsx` | 인라인 — 앱 이름/버전/설명/랜딩 링크 |
| SettingsMenuRow | `components/shared/SettingsMenuRow.tsx` | 아이콘+라벨+요약값+화살표 클릭형 행 |
| TimerDefaultsModal / TimerDefaultsSection | `components/settings/timer-defaults/` | 모달 — 기본 집중/휴식/사이클 |
| TaskManageModal | `components/settings/task/TaskManageModal.tsx` | 모달 — 작업 목록 관리(TaskList mode="manage") |
| CategoryModal / CategorySection | `components/settings/category/` | 모달 — 카테고리 목록(드래그 정렬/편집/삭제) |
| CategoryEditModal | `components/settings/category/CategoryEditModal.tsx` | 모달 — 카테고리 이름/색상 추가·편집 (CategoryModal 위 중첩) |
| MotivationalModal / MotivationalSection | `components/settings/motivational/` | 모달 — 동기부여 메시지 목록(드래그 정렬, 행 내 인라인 편집) |
| NotificationModal / NotificationSection | `components/settings/notification/` | 모달 — 브라우저 알림+소리 알림 |
| StepperInput       | `components/shared/StepperInput.tsx`       | 숫자 증감 입력 (단위 포함)          |
| ConfirmDialog      | `components/shared/ConfirmDialog.tsx`      | 카테고리/작업 삭제 확인                |

### 인터랙션

| 액션              | 동작                                      |
| --------------- | --------------------------------------- |
| 닉네임 입력 후 저장 | 즉시 저장, "저장됨" 1.5초 표시(모달 없음) |
| 테마 버튼 클릭 | 즉시 전환(모달 없음) |
| "타이머 기본값"/"작업 관리"/"카테고리 관리"/"동기부여 메시지"/"알림" 행 클릭 | 각 대응 모달 오픈 |
| 작업 관리 모달에서 "카테고리 관리" 클릭 | 카테고리 목록 모달이 위에 중첩 오픈 |
| 카테고리 목록 모달에서 추가/편집 클릭 | 카테고리 편집 모달이 다시 위에 중첩 오픈 |
| 소리 알림 토글 끔 | 세부 옵션(종류/음량/반복) 비활성 처리 |
| "앱 정보" 내 랜딩 링크 | `/landing`으로 페이지 이동 |

### 에지케이스

- 동기부여 메시지 전체 삭제 시: 최소 1개 유지 규칙 (마지막 메시지 삭제 버튼 비활성)
- 브라우저 알림 권한 영구 거부 시: 토글 비활성 + "브라우저 설정에서 변경하세요" 안내
- 기본 카테고리(공부, 업무, 운동, 독서, 기타) 삭제 가능 여부: 허용 (사용자 자율, 참조하던 작업의 categoryId는 유지되어 이후 "카테고리 없음"으로 표시됨)

---

## 참조

- 디자인 시스템: [docs/guides/design.md](../guides/design.md)
- 기능명세서: [docs/specs/feature-spec.md](feature-spec.md)
- 아키텍처: [docs/specs/architecture-diagram.md](architecture-diagram.md)
