import type { TimerMode } from '@pomodash/shared';

// 웹 apps/web/lib/sessionUtils.ts 대응
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
