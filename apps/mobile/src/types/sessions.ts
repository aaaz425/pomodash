import { z } from 'zod';
import { INPUT_LIMITS, type FocusRating, type TimerMode } from '@pomodash/shared';

export interface FocusPeriod {
  start: string; // ISO 8601
  end: string; // ISO 8601
}

export interface Session {
  id: string;
  taskId: string | null;
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

// Supabase 응답도 외부 입력이므로 반드시 검증 후 사용 — lib/supabase/sessions.ts에서만 사용
export const FocusPeriodSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const SessionSchema = z.object({
  id: z.string(),
  taskId: z.string().nullable(),
  mode: z.enum(['pomodoro', 'free']),
  startedAt: z.string(),
  endedAt: z.string(),
  completedCycles: z.number(),
  totalCycles: z.number(),
  focusSeconds: z.number(),
  pausedSeconds: z.number(),
  focusPeriods: z.array(FocusPeriodSchema),
  note: z.string().max(INPUT_LIMITS.NOTE_MAX_LENGTH).nullable(),
  focusRating: z.union([z.literal(1), z.literal(2), z.literal(3)]).nullable(),
  distractionTags: z.array(z.string().max(INPUT_LIMITS.DISTRACTION_TAG_MAX_LENGTH)),
});
