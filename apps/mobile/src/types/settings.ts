import { z } from 'zod';
import {
  INPUT_LIMITS,
  SOUND_LIMITS,
  TIMER_LIMITS,
  type AppSettings,
  type SoundType,
} from '@pomodash/shared';

export type { AppSettings, SoundType };

const TimerSettingsSchema = z.object({
  focusMinutes: z.number().min(TIMER_LIMITS.FOCUS_MINUTES_MIN).max(TIMER_LIMITS.FOCUS_MINUTES_MAX),
  shortBreakMinutes: z
    .number()
    .min(TIMER_LIMITS.BREAK_MINUTES_MIN)
    .max(TIMER_LIMITS.BREAK_MINUTES_MAX),
  totalCycles: z.number().min(TIMER_LIMITS.CYCLES_MIN).max(TIMER_LIMITS.CYCLES_MAX),
});

// Supabase 응답도 외부 입력이므로 반드시 검증 후 사용 — lib/supabase/settings.ts에서만 사용
export const AppSettingsSchema = z.object({
  nickname: z.string().max(INPUT_LIMITS.NICKNAME_MAX_LENGTH),
  browserNotification: z.boolean(),
  soundAlert: z.boolean(),
  soundType: z.enum(['sine', 'chime', 'bell', 'digital']).default('sine'),
  soundVolume: z.number().min(SOUND_LIMITS.VOLUME_MIN).max(SOUND_LIMITS.VOLUME_MAX).default(70),
  soundRepeatCount: z.number().min(SOUND_LIMITS.REPEAT_MIN).max(SOUND_LIMITS.REPEAT_MAX).default(2),
  motivationalMessages: z
    .array(z.string().min(INPUT_LIMITS.MESSAGE_LENGTH_MIN).max(INPUT_LIMITS.MESSAGE_LENGTH_MAX))
    .min(INPUT_LIMITS.MESSAGE_COUNT_MIN)
    .max(INPUT_LIMITS.MESSAGE_COUNT_MAX),
  defaultTimerSettings: TimerSettingsSchema,
});
