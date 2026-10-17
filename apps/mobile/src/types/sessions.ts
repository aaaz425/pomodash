import type { FocusRating, TimerMode } from '@pomoroutine/shared';

export interface FocusPeriod {
  start: string; // ISO 8601
  end: string; // ISO 8601
}

export interface Session {
  id: string;
  taskId: string | null;
  title: string | null; // taskId와 독립된 세션별 라벨, 저널 상세 편집에서만 설정
  mode: TimerMode;
  startedAt: string; // ISO 8601
  endedAt: string; // ISO 8601
  completedCycles: number;
  totalCycles: number;
  focusSeconds: number;
  pausedSeconds: number;
  focusPeriods: FocusPeriod[];
  note: string | null;
  focusRating: FocusRating | null;
  distractionTags: string[];
}
