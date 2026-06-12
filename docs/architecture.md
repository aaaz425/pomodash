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
| Next.js 15 | Vercel 최적화, App Router로 SSR/CSR 혼용 용이 |
| Tailwind CSS + shadcn/ui | 빠른 UI 구성, 디자인 시스템 일관성 |
| Zustand | 타이머 전역 상태 관리, Redux 대비 보일러플레이트 적음 |
| localStorage (MVP) | 로그인 없이 즉시 사용 가능, 진입 장벽 최소화 |
| Supabase (이후) | localStorage에서 클라우드 동기화로 마이그레이션 |
| Clerk (이후) | 인증 도입 시점에 빠른 연동 |
| Recharts | React 친화적, 커스터마이즈 쉬움 |
| Vercel | GitHub 연동 자동 배포, 무료 tier로 시작 가능 |

## 배포 전략

1. Vercel 무료 tier로 시작 (`pomodash.vercel.app`)
2. GitHub `main` 브랜치 push 시 Vercel 자동 배포
3. 커스텀 도메인은 유저 확보 후 도입
