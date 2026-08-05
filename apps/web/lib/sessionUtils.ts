import type { TimerMode } from '@/types';
import {
  formatDuration,
  formatSessionProgressLabel,
  toLocalDateKey,
  groupSessionsByDate,
  getSessionsForDate,
  getSessionOrdinalTitle,
  formatTimeRange,
  formatFullDate,
  formatFocusPeriodRanges,
  hasAbnormalFocusGap,
  formatSessionTimeSummary,
} from '@pomodash/shared';

export {
  formatDuration,
  formatSessionProgressLabel,
  toLocalDateKey,
  groupSessionsByDate,
  getSessionsForDate,
  getSessionOrdinalTitle,
  formatTimeRange,
  formatFullDate,
  formatFocusPeriodRanges,
  hasAbnormalFocusGap,
  formatSessionTimeSummary,
};

export function formatSessionEndSummary(
  mode: TimerMode,
  elapsedMinutes: number,
  cycleCount: number,
  totalCycles: number,
): string {
  return mode === 'free'
    ? `지금까지 ${elapsedMinutes}분 집중했어요`
    : `지금까지 ${elapsedMinutes}분 · ${cycleCount} / ${totalCycles}사이클 진행했어요`;
}
