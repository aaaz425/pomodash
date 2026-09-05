import { z } from 'zod';
import type { DayActivity, PeriodStats } from '@pomodash/shared';

export interface FocusTrendItem {
  label: string;
  [key: string]: number | string;
}

export interface FocusTrendMeta {
  data: FocusTrendItem[];
  categories: { name: string; color: string }[];
}

export interface CategoryFocusItem {
  name: string;
  minutes: number;
  percent: number;
  color: string;
}

// get_dashboard_summary RPC 응답 — 전체 히스토리를 스캔해야 하는 통계만 담는다 (docs/guides/data-models.md 참고)
export interface DashboardSummary {
  streakDays: number;
  maxStreakDays: number;
  monthlyActivity: DayActivity[];
  monthFocusSeconds: number;
  busiestDay: string | null;
  firstSessionDate: string | null; // ISO 8601
  prevDay: PeriodStats;
  prevWeek: PeriodStats;
  prevMonth: PeriodStats;
}

// Supabase RPC 응답도 외부 입력이므로 반드시 검증 후 사용 — lib/supabase/dashboard.ts에서만 사용
const PeriodStatsSchema = z.object({
  focusSeconds: z.number(),
  count: z.number(),
});

const DayActivitySchema = z.object({
  date: z.string(),
  focusMinutes: z.number(),
});

export const DashboardSummarySchema = z.object({
  streakDays: z.number(),
  maxStreakDays: z.number(),
  monthlyActivity: z.array(DayActivitySchema),
  monthFocusSeconds: z.number(),
  busiestDay: z.string().nullable(),
  firstSessionDate: z.string().nullable(),
  prevDay: PeriodStatsSchema,
  prevWeek: PeriodStatsSchema,
  prevMonth: PeriodStatsSchema,
});
