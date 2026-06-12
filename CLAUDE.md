# Pomodash — Claude Context

## 프로젝트 개요
포모도로 타이머 기반 학습 집중 도구. 작업 계획 → 집중 타이머 → 세션 기록 → 대시보드 흐름을 하나의 웹앱에서 제공한다.
자세한 내용: `docs/vision.md`, `docs/architecture.md`

## 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **스타일**: Tailwind CSS + shadcn/ui
- **상태 관리**: Zustand
- **데이터**: localStorage (MVP) → Supabase (이후)
- **차트**: Recharts
- **배포**: Vercel

## MVP 기능 범위
1. 작업 관리 (할 일 목록 + 카테고리 태그)
2. 포모도로 타이머 (집중/휴식 사이클, 브라우저 알림 + 소리)
3. 동기부여 메시지 (랜덤 명언)
4. 세션 기록 (메모)
5. 대시보드 (공부 시간 차트, 스트릭)

AI 기능(Claude API)은 MVP 이후 선택적으로 추가 예정.

## 개발 명령어
```bash
npm run dev     # 로컬 개발 서버
npm run build   # 프로덕션 빌드
npm run lint    # 린트
```

## 참조 문서
@docs/data-models.md
@docs/conventions.md
@docs/commit-convention.md

## 주요 결정사항
- AI API 없이도 완전히 작동해야 함 (AI는 선택적 강화)
- MVP는 로그인 없이 localStorage만 사용 (진입 장벽 최소화)
- 다크 모드 우선 디자인
