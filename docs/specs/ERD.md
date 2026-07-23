# ERD — Entity Relationship Diagram

> **버전:** 1.0 · **기준:** `types/index.ts` (localStorage MVP 기준, Supabase 마이그레이션 전)
> **저장소:** 브라우저 localStorage (서버 DB 없음)

---

## 개요

Pomodash는 서버 DB 없이 localStorage만 사용한다. 엔티티 간 관계는 외래 키 ID로 참조하고 런타임에 Zod 스키마로 검증한다. FocusPeriod는 Session에 내장(embedded)되어 별도 키로 저장되지 않는다.

---

## 관계도

```mermaid
erDiagram
    CATEGORY {
        string id PK
        string name
        string color "Tailwind class (e.g. bg-blue-500)"
    }

    TASK {
        string id PK
        string title
        string categoryId FK
        number targetFocusMinutes "기본 25, 범위 5-120"
        number targetCycles "기본 4, 범위 1-10"
        number targetBreakMinutes "기본 5, 범위 0-60"
        boolean completed
        string createdAt "ISO 8601"
    }

    SESSION {
        string id PK
        string taskId FK "nullable — 미분류 세션"
        string mode "'pomodoro' | 'free', free는 completedCycles/totalCycles 0"
        string startedAt "ISO 8601"
        string endedAt "ISO 8601"
        number completedCycles
        number totalCycles "당시 설정값 스냅샷"
        number focusSeconds "집계 전용 — endedAt-startedAt 사용 금지"
        number pausedSeconds
        string note "nullable, 최대 500자"
        number focusRating "nullable, 1-3단계 집중도 자가 평점"
        string distractionTags "방해요소 태그 id 배열"
    }

    FOCUS_PERIOD {
        string start "ISO 8601 (Session에 내장)"
        string end "ISO 8601 (Session에 내장)"
    }

    TIMER_SETTINGS {
        number focusMinutes "5-120"
        number shortBreakMinutes "0-60"
        number totalCycles "1-10"
    }

    APP_SETTINGS {
        string nickname
        boolean browserNotification
        boolean soundAlert
        string soundType "'sine' | 'chime' | 'bell' | 'digital'"
        number soundVolume "0-100"
        number soundRepeatCount "1-5"
        string motivationalMessages "배열, 1-20개"
    }

    CATEGORY ||--o{ TASK : "분류"
    TASK ||--o{ SESSION : "집중 기록"
    SESSION ||--|{ FOCUS_PERIOD : "포함 (내장)"
    APP_SETTINGS ||--|| TIMER_SETTINGS : "defaultTimerSettings (내장)"
```

---

## 엔티티 상세

### Category

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | string | PK | UUID 또는 고정 ID |
| `name` | string | - | 표시 이름 |
| `color` | string | - | Tailwind 클래스 (예: `bg-blue-500`) |

**기본값:** 공부(blue), 업무(green), 운동(orange), 독서(purple), 기타(gray)

---

### Task

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | string | PK | UUID |
| `title` | string | - | 작업 이름 |
| `categoryId` | string | FK → Category | 카테고리 참조 |
| `targetFocusMinutes` | number | 5–120 | 사이클당 집중 시간 |
| `targetCycles` | number | 1–10 | 목표 사이클 수 |
| `targetBreakMinutes` | number | 0–60 | 사이클 간 휴식 시간 |
| `completed` | boolean | - | 완료 여부 |
| `createdAt` | string | ISO 8601 | 생성 시각 |

---

### Session

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | string | PK | UUID |
| `taskId` | string \| null | FK → Task | null = 미분류 세션 |
| `mode` | `'pomodoro' \| 'free'` | - | free 모드는 완료 사이클 개념이 없어 completedCycles/totalCycles가 항상 0 |
| `startedAt` | string | ISO 8601 | 세션 최초 시작 시각 |
| `endedAt` | string | ISO 8601 | 세션 종료 시각 |
| `completedCycles` | number | - | 실제 완료 사이클 수 |
| `totalCycles` | number | - | 당시 설정값 스냅샷 |
| `focusSeconds` | number | - | **집계 전용** (pausedSeconds 제외) |
| `pausedSeconds` | number | - | 총 일시정지 시간 |
| `focusPeriods` | FocusPeriod[] | - | 타임라인 블록용 실제 집중 구간 |
| `note` | string \| null | 최대 500자 | 세션 회고 메모 |
| `focusRating` | 1 \| 2 \| 3 \| null | 옵션 | 집중도 자가 평점 3단계 |
| `distractionTags` | string[] | 옵션 | 방해요소 태그 프리셋 id 배열 |

> **주의:** `focusSeconds`만 집계에 사용. `endedAt - startedAt`은 일시정지를 포함한 경과 시간이므로 통계에 쓰면 안 된다.

---

### FocusPeriod (Session 내장)

Session의 `focusPeriods` 배열 원소. 별도 localStorage 키 없음.

| 필드 | 타입 | 설명 |
|------|------|------|
| `start` | string (ISO 8601) | 집중 구간 시작 |
| `end` | string (ISO 8601) | 집중 구간 종료 |

**정규화 규칙 (`lib/focusPeriods.ts`):**
- 5초 미만 구간 드롭 (노이즈 제거)
- 5초 이하 일시정지로 나뉜 인접 구간 병합
- 최대 100개 구간 상한

---

### TimerSettings (AppSettings 내장)

| 필드 | 타입 | 범위 | 기본값 |
|------|------|------|--------|
| `focusMinutes` | number | 5–120 | 25 |
| `shortBreakMinutes` | number | 0–60 | 5 |
| `totalCycles` | number | 1–10 | 4 |

---

### AppSettings

| 필드 | 타입 | 설명 |
|------|------|------|
| `nickname` | string | 사용자 닉네임 |
| `browserNotification` | boolean | 브라우저 알림 on/off |
| `soundAlert` | boolean | 소리 알람 on/off |
| `soundType` | SoundType | `'sine' \| 'chime' \| 'bell' \| 'digital'` |
| `soundVolume` | number | 0–100 |
| `soundRepeatCount` | number | 1–5 |
| `motivationalMessages` | string[] | 동기부여 메시지 목록 (1–20개) |
| `defaultTimerSettings` | TimerSettings | 세션 시작 시 기본 적용값 |

---

## localStorage 키 매핑

| 엔티티 | localStorage 키 | 형태 |
|--------|-----------------|------|
| Category[] | `pomodash:categories` | JSON 배열 |
| Task[] | `pomodash:tasks` | JSON 배열 |
| Session[] | `pomodash:sessions` | JSON 배열 (FocusPeriod 내장) |
| AppSettings | `pomodash:settings` | JSON 객체 |
| TimerSettings (런타임) | `pomodash:timer-settings` | JSON 객체 |
| 진행 중 타이머 상태 | `pomodash:active-timer` | JSON 객체 (새로고침 복원용) |
| 스키마 버전 | `pomodash:version` | 숫자 문자열 |
| 테마 | `theme` | 문자열 (`pomodash:` 접두사 예외) |

---

## 스키마 버전 관리

- `pomodash:version` 값이 현재 버전과 다르면 localStorage 전체 초기화 또는 마이그레이션 실행
- 현재 버전: **1**
- 버전 업그레이드 시 기존 사용자 데이터 유실 가능 → 마이그레이션 로직 필수

---

## 파생 데이터 (localStorage 미저장)

아래는 Task/Session/Category로부터 매번 다시 계산되는 값으로, 별도 localStorage 키를 갖지 않는다. `types/models.ts`에 인터페이스로 정의되어 있다.

| 타입 | 계산 위치 | 용도 |
|------|-----------|------|
| Badge 획득 여부 | `lib/badges.ts` | 스트릭/누적시간/다양성/특별이벤트 뱃지 수집 상태 (정의는 `lib/constants/badges.ts`) |
| `ShareCardData` | `lib/shareCard.ts` | 집중 요약 공유 카드에 표시할 데이터 — 클라이언트 Canvas로 이미지 생성(`lib/shareCardCanvas.ts`) 후 `navigator.share`로 공유 |
| `FocusRatingTrend`, `CategoryRatingItem`, `DistractionFrequency` | `lib/journalInsights.ts` | 기록 페이지 인사이트(최근/과거 집중도 비교, 카테고리별 평점, 방해요소 빈도) |

---

## Phase 7 이후 변경 예정

Supabase 마이그레이션 시:
- localStorage 키 → Supabase 테이블로 전환
- `taskId` nullable FK → Supabase foreign key constraint
- `focusPeriods` 내장 배열 → 별도 `focus_periods` 테이블로 정규화 가능

