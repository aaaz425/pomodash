# Architecture

## 플랫폼 결정: 웹 (Next.js PWA)

네이티브 앱 대신 웹을 먼저 선택한 이유:
- 앱스토어 심사 없이 즉시 배포 및 업데이트 가능
- PWA로 모바일 홈 화면에 추가하면 네이티브 앱처럼 동작
- MVP 단계에서 유저 반응을 빠르게 확인 후 네이티브 앱 전환 고려
- "집중 모드 중 다른 앱 차단" 기능은 OS 수준 접근이 필요해 어차피 나중에 별도 구현

## 기술 스택 선택 이유

| 기술 | 선택 이유 |
|------|-----------|
| Next.js 16 | Vercel 최적화, App Router로 SSR/CSR 혼용 용이, Turbopack stable |
| Tailwind CSS + shadcn/ui | 빠른 UI 구성, 디자인 시스템 일관성 |
| Zustand | 타이머 전역 상태 관리, Redux 대비 보일러플레이트 적음 |
| localStorage (MVP) | 로그인 없이 즉시 사용 가능, 진입 장벽 최소화 |
| Supabase (이후) | localStorage에서 클라우드 동기화로 마이그레이션 |
| Clerk (이후) | 인증 도입 시점에 빠른 연동 |
| Recharts | React 친화적, 커스터마이즈 쉬움 |
| date-fns | 대시보드 날짜 조작 (일/주/월 그루핑, 스트릭 계산). native Date 대비 코드량 절감 |
| react-hook-form + @hookform/resolvers | shadcn/ui `<Form>` 컴포넌트 의존성, Zod 스키마와 폼 검증 일원화 |
| framer-motion | 집중 모드 전환 애니메이션 |
| Vercel Analytics | 페이지뷰, Web Vitals 모니터링. 쿠키 없음, GDPR 준수 |
| Posthog | 제품 지표 (타이머 완료율, 기능별 사용 비율 등). 무료 1M 이벤트/월 |
| Vercel | GitHub 연동 자동 배포, 무료 tier로 시작 가능 |

## 타이머 정확도 전략

브라우저는 비활성 탭의 `setInterval`/`setTimeout`을 최소 1초, 최대 1분 간격으로 throttle한다.
포모도로 타이머가 백그라운드에서 멈추거나 드리프트가 발생하는 핵심 원인이다.

**채택 전략: 절대 시간 기반 계산 + Page Visibility API**

- 타이머 시작 시 `startedAt = Date.now()` 저장
- 매 tick마다 `remainingSeconds = targetSeconds - Math.floor((Date.now() - startedAt) / 1000)` 재계산 → drift 누적 방지
- `document.addEventListener('visibilitychange', ...)` 로 탭 복귀 시 즉시 재계산

```ts
// 나쁨 — setInterval 카운트다운은 백그라운드에서 throttle됨
setInterval(() => setState(s => s.remainingSeconds - 1), 1000)

// 좋음 — 경과 시간을 절대 시각 기준으로 재계산
const elapsed = Math.floor((Date.now() - startedAt) / 1000)
const remaining = targetSeconds - elapsed
```

> Web Worker 방식(워커 스레드 타이머)이 정확도는 더 높지만 구현 복잡도가 높다.
> MVP에서는 절대 시간 기반으로 충분하며, 드리프트 문제 재발 시 Web Worker로 전환한다.

## 배포 전략

1. Vercel 무료 tier로 시작 (`pomodash.vercel.app`)
2. GitHub `main` 브랜치 push 시 Vercel 자동 배포
3. 커스텀 도메인은 유저 확보 후 도입
