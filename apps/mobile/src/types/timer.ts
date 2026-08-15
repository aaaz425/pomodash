import { z } from 'zod';
import { TIMER_LIMITS } from '@pomodash/shared';

const TimerSettingsSchema = z.object({
  focusMinutes: z.number().min(TIMER_LIMITS.FOCUS_MINUTES_MIN).max(TIMER_LIMITS.FOCUS_MINUTES_MAX),
  shortBreakMinutes: z
    .number()
    .min(TIMER_LIMITS.BREAK_MINUTES_MIN)
    .max(TIMER_LIMITS.BREAK_MINUTES_MAX),
  totalCycles: z.number().min(TIMER_LIMITS.CYCLES_MIN).max(TIMER_LIMITS.CYCLES_MAX),
});

const RawFocusPeriodSchema = z.object({
  start: z.number(),
  end: z.number(),
});

// AsyncStorage 새로고침/재시작 복구용 스냅샷 — 웹 types/schemas.ts의 ActiveTimerStateSchema 대응
export const ActiveTimerStateSchema = z.object({
  phase: z.enum(['focus', 'short-break']),
  // 기존 저장 데이터에는 없는 필드이므로 .default() 필수
  mode: z.enum(['pomodoro', 'free']).default('pomodoro'),
  remainingSeconds: z.number(),
  startedAt: z.number().nullable(),
  cycleCount: z.number(),
  currentTaskId: z.string().nullable(),
  settings: TimerSettingsSchema,
  sessionEnded: z.boolean(),
  sessionStarted: z.boolean(),
  sessionStartedAt: z.number().nullable(),
  sessionEndedAt: z.number().nullable(),
  accFocusSeconds: z.number(),
  rawFocusPeriods: z.array(RawFocusPeriodSchema),
  // 기존 저장 데이터에는 없는 필드이므로 .default() 필수 — 없으면 파싱 실패 시 진행 중이던 세션이 전부 초기화됨
  lastActiveAt: z.number().nullable().default(null),
});
