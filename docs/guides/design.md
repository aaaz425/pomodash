---
version: 1.1
name: pomodash-design-system
description: "민트 단일 액센트로 다크/라이트 두 모드를 지원한다. 다크는 딥 네이비(Linear 기반), 라이트는 뉴트럴 화이트(Cal 기반). 두 모드 모두 '타이머가 주인공' 원칙을 공유한다."
source: 'dark — linear.app DESIGN.md / light — cal.com DESIGN.md (awesome-design-md) 기반 커스터마이징'
---

## 1. 디자인 철학

> **"타이머가 주인공이다. UI는 배경이다."**

집중 모드에서 타이머 숫자와 진행 링만 남기고 나머지는 배경으로 물러난다.
색상은 민트 단일 액센트만 쓴다. 장식은 없다.

**핵심 원칙:**

- 다크 / 라이트 두 모드 지원 (시스템 설정 따라감, 사용자 수동 전환 가능)
- 단일 크로매틱 액센트 (민트) — 두 모드 동일하게 적용
- 표면 계층으로 깊이 표현 — 그림자 최소화
- 집중 모드 진입 시 UI 최소화 (타이머 + 동기부여 메시지만 노출)

---

## 2. 색상 팔레트

### 2-1. 다크 모드 (기본) — Linear 기반

#### 배경 계층 (표면 래더)

| 토큰              | Hex       | 용도                                     |
| ----------------- | --------- | ---------------------------------------- |
| `canvas`          | `#07090f` | 기본 페이지 배경 (가장 어두운 딥 네이비) |
| `surface-1`       | `#0d1117` | 카드, 패널의 기본 배경                   |
| `surface-2`       | `#111827` | 강조 카드, hover 상태                    |
| `surface-3`       | `#1a2332` | 드롭다운, 서브메뉴, 모달 배경            |
| `hairline`        | `#1e2d3d` | 카드 테두리, 구분선                      |
| `hairline-strong` | `#263548` | 포커스 링, 강조 테두리                   |

#### 텍스트 계층

| 토큰           | Hex       | 용도                   |
| -------------- | --------- | ---------------------- |
| `ink`          | `#f0f4f8` | 헤드라인, 강조 텍스트  |
| `ink-muted`    | `#94a3b8` | 보조 텍스트, 메타 정보 |
| `ink-subtle`   | `#64748b` | 3차 텍스트, 비활성     |
| `ink-tertiary` | `#475569` | 비활성, 비어있는 상태  |

#### 액센트 (민트)

| 토큰            | Hex         | 용도                                   |
| --------------- | ----------- | -------------------------------------- |
| `primary`       | `#10d9a0`   | 타이머 링, 시작 버튼, 포커스 링        |
| `primary-hover` | `#34e8b3`   | hover 상태                             |
| `primary-focus` | `#0fb88a`   | pressed / 포커스 아웃라인              |
| `primary-dim`   | `#10d9a01a` | 타이머 링 트랙 (배경 원, 10% 불투명도) |

#### 세션별 컬러

| 세션      | 토큰            | Hex       | 용도                         |
| --------- | --------------- | --------- | ---------------------------- |
| 집중      | `session-focus` | `#10d9a0` | 민트 — 집중 세션 기본 액센트 |
| 짧은 휴식 | `session-short` | `#60a5fa` | 블루 — 짧은 휴식             |
| 긴 휴식   | `session-long`  | `#a78bfa` | 바이올렛 — 긴 휴식           |

#### 시맨틱

| 토큰               | Hex         | 용도                              |
| ------------------ | ----------- | --------------------------------- |
| `semantic-success` | `#22c55e`   | 세션 완료, 성공 상태              |
| `semantic-warning` | `#f59e0b`   | 경고, 잔여 시간 알림              |
| `semantic-error`   | `#ef4444`   | 오류                              |
| `semantic-overlay` | `#000000cc` | 집중 모드 오버레이 (80% 불투명도) |

---

### 2-2. 라이트 모드 — Cal 기반

#### 배경 계층 (표면 래더)

| 토큰              | Hex       | 용도                   |
| ----------------- | --------- | ---------------------- |
| `canvas`          | `#ffffff` | 기본 페이지 배경       |
| `surface-1`       | `#f8f9fa` | 카드, 패널의 기본 배경 |
| `surface-2`       | `#f5f5f5` | 강조 카드, hover 상태  |
| `surface-3`       | `#efefef` | 드롭다운, 모달 배경    |
| `hairline`        | `#e5e7eb` | 카드 테두리, 구분선    |
| `hairline-strong` | `#d1d5db` | 포커스 링, 강조 테두리 |

#### 텍스트 계층

| 토큰           | Hex       | 용도                   |
| -------------- | --------- | ---------------------- |
| `ink`          | `#111111` | 헤드라인, 강조 텍스트  |
| `ink-muted`    | `#374151` | 보조 텍스트, 메타 정보 |
| `ink-subtle`   | `#6b7280` | 3차 텍스트, 비활성     |
| `ink-tertiary` | `#9ca3af` | 비활성, 비어있는 상태  |

#### 액센트 (민트 — 라이트 조정)

| 토큰            | Hex         | 용도                                            |
| --------------- | ----------- | ----------------------------------------------- |
| `primary`       | `#10d9a0`   | 타이머 링 진행, 버튼 배경 (다크 텍스트 올림)    |
| `primary-hover` | `#0fc690`   | hover 상태                                      |
| `primary-focus` | `#0aaa7d`   | pressed / 포커스 아웃라인                       |
| `primary-text`  | `#0aaa7d`   | 라이트 모드에서 민트 텍스트로 쓸 때 (명도 확보) |
| `primary-dim`   | `#10d9a020` | 타이머 링 트랙 (12% 불투명도, 흰 배경용)        |

#### 세션별 컬러 (라이트 — 텍스트용 어두운 변형)

| 세션      | 링/배경 tint | 텍스트/아이콘 | 용도      |
| --------- | ------------ | ------------- | --------- |
| 집중      | `#10d9a0`    | `#0aaa7d`     | 집중 세션 |
| 짧은 휴식 | `#60a5fa`    | `#2563eb`     | 짧은 휴식 |
| 긴 휴식   | `#a78bfa`    | `#7c3aed`     | 긴 휴식   |

#### 시맨틱 (공통)

다크 모드와 동일 (`#22c55e` / `#f59e0b` / `#ef4444`).
오버레이는 라이트 모드에서 `#00000080` (50% 불투명도).

---

### 2-3. 공통 금지 사항

- 민트(`primary`)를 카드 배경이나 섹션 fill로 사용하지 않는다
- 두 번째 크로매틱 액센트(오렌지, 핑크 등)를 도입하지 않는다
- 대기 상태/비활성에 `primary`를 사용하지 않는다
- 세션 컬러 3종 이외 색상을 UI 주요 요소에 추가하지 않는다

---

## 3. 타이포그래피

### 폰트 패밀리

| 역할            | 폰트           | fallback                                      |
| --------------- | -------------- | --------------------------------------------- |
| 기본 (본문, UI) | **Pretendard** | `Inter, -apple-system, system-ui, sans-serif` |
| 타이머 숫자     | **Geist Mono** | `ui-monospace, SF Mono, Menlo`                |
| 코드 / 로그     | **Geist Mono** | `ui-monospace`                                |

Next.js `next/font/local`로 Pretendard + Geist Mono를 로드한다.
Pretendard는 `@fontsource/pretendard` 패키지 또는 CDN(`cdn.jsdelivr.net/gh/orioncactus/pretendard`)을 통해 제공한다.
Inter 대비 한글 글리프를 내장하므로 한글/영문이 동일 폰트로 렌더링된다.

### 타입 스케일

| 토큰            | 크기 | 굵기 | 행간 | 자간   | 용도                         |
| --------------- | ---- | ---- | ---- | ------ | ---------------------------- |
| `display`       | 48px | 700  | 1.05 | -1.5px | 빈 상태 대형 헤드라인        |
| `headline`      | 28px | 600  | 1.20 | -0.5px | 카드 제목, 섹션 헤더         |
| `title`         | 20px | 600  | 1.30 | -0.3px | 작업 제목, 서브 헤더         |
| `body-lg`       | 18px | 400  | 1.50 | -0.1px | 동기부여 메시지, 중요 본문   |
| `body`          | 16px | 400  | 1.50 | 0      | 기본 본문                    |
| `body-sm`       | 14px | 400  | 1.50 | 0      | 카드 보조 텍스트, 레이블     |
| `caption`       | 12px | 400  | 1.40 | 0      | 메타, 타임스탬프, 뱃지       |
| `timer-display` | 80px | 700  | 1.00 | -3px   | 타이머 숫자 (Geist Mono)     |
| `timer-sm`      | 48px | 700  | 1.00 | -2px   | 소형 뷰 타이머               |
| `button`        | 14px | 500  | 1.20 | 0      | 모든 버튼 레이블             |
| `eyebrow`       | 12px | 600  | 1.30 | +0.6px | 섹션 분류 레이블 (양의 자간) |

### 원칙

- `timer-display`는 Geist Mono만 사용 — 숫자 폭이 고정(tabular)이어야 깜빡이지 않는다
- 헤드라인에 음의 자간(-3px~-0.3px), 아이브로우에 양의 자간(+0.6px) 적용
- 무게는 400 / 500 / 600 / 700 네 단계만 사용

---

## 4. 간격 & 반경

### 간격 (4px 기준)

| 토큰       | 값   | 용도                          |
| ---------- | ---- | ----------------------------- |
| `space-1`  | 4px  | 아이콘-텍스트 간격, 미세 여백 |
| `space-2`  | 8px  | 인라인 요소 간격              |
| `space-3`  | 12px | 버튼 내부 수직 패딩           |
| `space-4`  | 16px | 기본 컴포넌트 내부 패딩       |
| `space-6`  | 24px | 카드 내부 패딩                |
| `space-8`  | 32px | 섹션 간격                     |
| `space-12` | 48px | 큰 섹션 여백                  |
| `space-16` | 64px | 페이지 상하 패딩              |

### 테두리 반경

| 토큰           | 값     | 용도                         |
| -------------- | ------ | ---------------------------- |
| `rounded-xs`   | 4px    | 뱃지, 작은 태그              |
| `rounded-sm`   | 6px    | 인라인 태그                  |
| `rounded-md`   | 8px    | 버튼, 입력 필드              |
| `rounded-lg`   | 12px   | 카드, 패널                   |
| `rounded-xl`   | 16px   | 모달, 큰 카드                |
| `rounded-2xl`  | 24px   | 집중 모드 타이머 패널 (선택) |
| `rounded-full` | 9999px | 아바타, 세션 뱃지, 토글      |

---

## 5. 컴포넌트 규칙

### 5-1. 타이머 링 (TimerRing)

원형 SVG progress indicator. 앱의 주인공 컴포넌트.

```
크기: 240px (기본) / 180px (소형)
트랙 원: stroke #10d9a01a (primary 10% 불투명도), stroke-width 8px
진행 원: stroke {현재 세션 컬러}, stroke-width 8px
      → 집중: #10d9a0 / 짧은 휴식: #60a5fa / 긴 휴식: #a78bfa
진행 방향: 12시 기준 시계 방향
중앙: timer-display 타이포 (Geist Mono 80px 700)
     → 남은 시간 MM:SS
애니메이션: stroke-dashoffset 트랜지션 1초 linear (매 tick)
집중 모드: 링 크기 300px로 확대 (framer-motion layoutId)
```

### 5-2. 세션 뱃지 (SessionBadge)

현재 타이머 단계를 나타내는 pill.

```
형태: rounded-full, 패딩 4px 12px
텍스트: caption (12px 600), 세션별 컬러
배경: 세션 컬러 15% 불투명도
예시:
  집중 중  → 배경 #10d9a026, 텍스트 #10d9a0
  짧은 휴식 → 배경 #60a5fa26, 텍스트 #60a5fa
  긴 휴식  → 배경 #a78bfa26, 텍스트 #a78bfa
```

### 5-3. 사이클 카운터 (CycleIndicator)

4개 사이클 진행도를 점으로 표시.

```
점 4개, 크기 8px, 간격 8px
완료: 세션 컬러 (solid)
미완료: hairline (outline)
현재: 세션 컬러 + pulse 애니메이션 (1.5s ease-in-out infinite)
```

### 5-4. 버튼

**primary** — 타이머 시작/재개 CTA

```
배경: #10d9a0, 텍스트: #07090f (다크), 타이포: button (14px 500)
반경: rounded-md (8px), 패딩: 12px 24px
hover: 배경 #34e8b3
pressed: 배경 #0fb88a
focus ring: 2px solid #10d9a0, offset 2px
```

**ghost** — 일시정지, 리셋 등 보조 액션

```
배경: transparent, 텍스트: ink-muted
테두리: 1px solid hairline
반경: rounded-md, 패딩: 12px 16px
hover: 배경 surface-2, 텍스트 ink
```

**icon** — 아이콘 전용 버튼 (설정, 닫기 등)

```
크기: 36px × 36px
배경: transparent → hover: surface-2
반경: rounded-md
아이콘: 20px, ink-subtle → hover: ink
```

### 5-5. 카드 / 패널

**기본 카드** (작업 아이템, 세션 기록)

```
배경: surface-1 (#0d1117)
테두리: 1px solid hairline (#1e2d3d)
반경: rounded-lg (12px)
패딩: 16px (space-4)
hover: 배경 surface-2
```

**모달 / 설정 패널**

```
배경: surface-2 (#111827)
테두리: 1px solid hairline-strong
반경: rounded-xl (16px)
패딩: 24px (space-6)
오버레이: semantic-overlay (#000000cc)
```

### 5-6. 입력 필드

```
배경: surface-1, 텍스트: ink, 플레이스홀더: ink-subtle
테두리: 1px solid hairline → focus: 1px solid primary
반경: rounded-md (8px), 패딩: 10px 12px
focus ring: none (테두리 컬러 변경으로 대체)
```

### 5-7. 동기부여 메시지 (MotivationalMessage)

```
타이포: body-lg (18px 400), 텍스트: ink-muted
위치: 타이머 링 아래, 중앙 정렬
전환: 교체 시 cross-fade 0.4s (framer-motion AnimatePresence)
집중 모드에서만 노출, 그 외에는 숨김
```

### 5-8. 토스트 / 알림

```
배경: surface-3 (#1a2332)
테두리: 1px solid hairline-strong
반경: rounded-lg
패딩: 12px 16px
아이콘 + 텍스트 구성
진입: slide up + fade in (0.3s ease-out)
퇴장: fade out (0.2s ease-in)
위치: 오른쪽 하단
```

---

## 6. 모션 가이드 (framer-motion)

### 기본 원칙

- 기능적 애니메이션만 사용 (상태 변화를 명확히 전달하는 것)
- 장식적 애니메이션 금지
- 집중 모드 전환이 앱에서 가장 중요한 애니메이션

### 애니메이션 토큰

| 이름         | duration | easing                 | 용도                  |
| ------------ | -------- | ---------------------- | --------------------- |
| `anim-fast`  | 0.15s    | ease-out               | 버튼 hover, 토글      |
| `anim-base`  | 0.25s    | ease-out               | 카드 hover, 뱃지 전환 |
| `anim-enter` | 0.35s    | ease-out               | 컴포넌트 진입         |
| `anim-focus` | 0.5s     | ease-in-out            | 집중 모드 전환        |
| `anim-pulse` | 1.5s     | ease-in-out (infinite) | 사이클 현재 점 pulse  |

### 집중 모드 전환

```
진입:
  - 타이머 링: layoutId로 중앙 이동 + 크기 240→300px (0.5s ease-in-out)
  - 나머지 UI: opacity 1→0 (0.3s ease-in)
  - 배경: canvas → #000000cc 오버레이 (0.4s ease-in)
  - 동기부여 메시지: opacity 0→1, y 10→0 (0.4s, 지연 0.2s)

퇴장:
  - 역순. 타이머 링 원래 자리로 복귀.
```

### 세션 완료 축하

```
타이머 링이 100%에 도달했을 때:
  - 링: scale 1 → 1.05 → 1 (0.4s spring)
  - 세션 뱃지: 순간 bright flash (0.3s)
  - 사이클 점: 완료된 점에 pop (scale 0 → 1.2 → 1)
```

### 페이지 전환

```
공통: opacity 0→1, y 8→0 (0.25s ease-out)
대시보드 차트: stagger 0.05s로 막대별 순차 등장
```

---

## 7. 반응형 기준

| 이름      | 너비    | 주요 변화                                    |
| --------- | ------- | -------------------------------------------- |
| Mobile    | ~480px  | 타이머 링 180px, 버튼 전체 폭, 설정 풀스크린 |
| Mobile-lg | 640px   | 단일 컬럼 유지                               |
| Tablet    | 768px   | 레이아웃 여백 확대, 설정 사이드시트 전환     |
| Desktop   | 1024px+ | 타이머 + 작업 목록 2컬럼 가능 (MVP 이후)     |

**터치 타겟:** 모든 인터랙티브 요소 최소 44px × 44px 확보.

---

## 8. Do / Don't

### Do

- 민트(`primary`)는 타이머 링 진행, 시작 버튼, 포커스 링에만 사용
- 표면 계층(canvas → surface-1 → surface-2 → surface-3)으로만 깊이 표현
- 버튼 반경은 `rounded-md` (8px)
- 타이머 숫자는 항상 Geist Mono (tabular 숫자)
- 세션 타입별 컬러(민트/블루/바이올렛)는 일관되게 유지
- 집중 모드 전환에 `layoutId` + framer-motion 사용

### Don't

- 그림자(box-shadow)로 깊이 표현하지 않는다 (다크 모드)
- 민트를 배경 fill이나 섹션 색상으로 쓰지 않는다
- 인라인 `style={}` 색상 지정 금지 — 반드시 Tailwind 클래스
- 집중 모드에서 타이머 + 동기부여 메시지 외 요소 노출 금지
- 라이트 모드에서 민트 텍스트에 `#10d9a0` 직접 사용 금지 — `#0aaa7d`(`primary-text`) 사용
- 장식적 그라디언트 / 스포트라이트 카드 금지
- 두 모드에서 서로 다른 액센트 컬러 사용 금지 — 민트로 통일

