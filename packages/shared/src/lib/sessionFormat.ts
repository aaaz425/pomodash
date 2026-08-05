import type { TimerMode } from '../types/timer';

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}초`;
  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hours === 0) return `${mins}분`;
  if (remMins === 0) return `${hours}시간`;
  return `${hours}시간 ${remMins}분`;
}

export function formatSessionProgressLabel(
  mode: TimerMode,
  {
    cycleCount,
    totalCycles,
    focusSeconds,
  }: { cycleCount: number; totalCycles: number; focusSeconds: number },
): string {
  return mode === 'free'
    ? `자유 집중 ${formatDuration(focusSeconds)}`
    : `완료된 사이클 ${cycleCount} / ${totalCycles}`;
}
