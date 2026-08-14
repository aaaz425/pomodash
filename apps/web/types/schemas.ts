import { z } from 'zod';
import type { Category } from '@/types/models';
import { TIMER_LIMITS, INPUT_LIMITS, SOUND_LIMITS, AUTH_LIMITS } from '@/lib/constants/limits';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().refine((v) => v.startsWith('bg-'), { message: 'Tailwind bg class required' }),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  targetFocusMinutes: z
    .number()
    .min(TIMER_LIMITS.FOCUS_MINUTES_MIN)
    .max(TIMER_LIMITS.FOCUS_MINUTES_MAX)
    .default(25),
  targetCycles: z.number().min(TIMER_LIMITS.CYCLES_MIN).max(TIMER_LIMITS.CYCLES_MAX).default(4),
  targetBreakMinutes: z
    .number()
    .min(TIMER_LIMITS.BREAK_MINUTES_MIN)
    .max(TIMER_LIMITS.BREAK_MINUTES_MAX)
    .default(5),
  completed: z.boolean(),
  createdAt: z.string(),
});

export const FocusPeriodSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const SessionSchema = z.object({
  id: z.string(),
  taskId: z.string().nullable(),
  title: z.string().max(INPUT_LIMITS.TITLE_MAX_LENGTH).nullable(),
  // 기존 localStorage 데이터에는 없는 필드이므로 .default() 필수
  mode: z.enum(['pomodoro', 'free']).default('pomodoro'),
  startedAt: z.string(),
  endedAt: z.string(),
  completedCycles: z.number(),
  totalCycles: z.number(),
  focusSeconds: z.number(),
  pausedSeconds: z.number(),
  focusPeriods: z.array(FocusPeriodSchema),
  note: z.string().max(INPUT_LIMITS.NOTE_MAX_LENGTH).nullable(),
  // 기존 localStorage 데이터에는 없는 필드이므로 .default() 필수
  focusRating: z
    .union([z.literal(1), z.literal(2), z.literal(3)])
    .nullable()
    .default(null),
  distractionTags: z.array(z.string().max(INPUT_LIMITS.DISTRACTION_TAG_MAX_LENGTH)).default([]),
});

export const TimerSettingsSchema = z.object({
  focusMinutes: z.number().min(TIMER_LIMITS.FOCUS_MINUTES_MIN).max(TIMER_LIMITS.FOCUS_MINUTES_MAX),
  shortBreakMinutes: z
    .number()
    .min(TIMER_LIMITS.BREAK_MINUTES_MIN)
    .max(TIMER_LIMITS.BREAK_MINUTES_MAX),
  totalCycles: z.number().min(TIMER_LIMITS.CYCLES_MIN).max(TIMER_LIMITS.CYCLES_MAX),
});

// 새로고침 복구용 — 진행 중이거나 아직 기록 안 한(sessionEnded) 활성 타이머 1개의 스냅샷
export const RawFocusPeriodSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export const ActiveTimerStateSchema = z.object({
  phase: z.enum(['focus', 'short-break']),
  // 기존 localStorage 데이터에는 없는 필드이므로 .default() 필수
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
  // 기존 localStorage 데이터에는 없는 필드이므로 .default() 필수 — 없으면 parse 실패 시 진행 중이던 세션이 전부 초기화됨
  lastActiveAt: z.number().nullable().default(null),
});

export const AppSettingsSchema = z.object({
  nickname: z.string().max(INPUT_LIMITS.NICKNAME_MAX_LENGTH),
  browserNotification: z.boolean(),
  soundAlert: z.boolean(),
  // 기존 localStorage 데이터에는 없는 필드이므로 .default() 필수 — 없으면 parse 실패 시 전체 설정이 초기화됨
  soundType: z.enum(['sine', 'chime', 'bell', 'digital']).default('sine'),
  soundVolume: z.number().min(SOUND_LIMITS.VOLUME_MIN).max(SOUND_LIMITS.VOLUME_MAX).default(70),
  soundRepeatCount: z.number().min(SOUND_LIMITS.REPEAT_MIN).max(SOUND_LIMITS.REPEAT_MAX).default(2),
  motivationalMessages: z
    .array(z.string().min(INPUT_LIMITS.MESSAGE_LENGTH_MIN).max(INPUT_LIMITS.MESSAGE_LENGTH_MAX))
    .min(INPUT_LIMITS.MESSAGE_COUNT_MIN)
    .max(INPUT_LIMITS.MESSAGE_COUNT_MAX),
  defaultTimerSettings: TimerSettingsSchema,
});

export const LoginCredentialsSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 형식이 아니에요' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요' }),
});

export const SignupCredentialsSchema = z
  .object({
    email: z.string().email({ message: '올바른 이메일 형식이 아니에요' }),
    password: z
      .string()
      .min(AUTH_LIMITS.PASSWORD_MIN_LENGTH, { message: '비밀번호는 8자 이상이어야 해요' }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않아요',
    path: ['passwordConfirm'],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 형식이 아니에요' }),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(AUTH_LIMITS.PASSWORD_MIN_LENGTH, { message: '비밀번호는 8자 이상이어야 해요' }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않아요',
    path: ['passwordConfirm'],
  });

export const STORAGE_KEYS = {
  activeTimer: 'pomodash:active-timer',
  version: 'pomodash:version',
  theme: 'theme',
} as const;

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '공부', color: 'bg-blue-500' },
  { id: '2', name: '업무', color: 'bg-green-500' },
  { id: '3', name: '운동', color: 'bg-orange-500' },
  { id: '4', name: '독서', color: 'bg-purple-500' },
  { id: '5', name: '기타', color: 'bg-gray-500' },
];

export { DEFAULT_TIMER_SETTINGS } from '@pomodash/shared';
