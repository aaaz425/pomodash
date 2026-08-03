import type { FocusPeriod } from '@/types';
import { FOCUS_PERIOD_LIMITS } from '@/lib/constants/limits';

const { MIN_FOCUS_SECONDS, MAX_PAUSE_MERGE_SECONDS, MAX_PERIODS } = FOCUS_PERIOD_LIMITS;

export function normalizeFocusPeriods(periods: FocusPeriod[]): FocusPeriod[] {
  if (periods.length === 0) return [];

  // 5초 미만 제거
  const filtered = periods.filter((p) => {
    const durationMs = new Date(p.end).getTime() - new Date(p.start).getTime();
    return durationMs >= MIN_FOCUS_SECONDS * 1000;
  });

  if (filtered.length === 0) return [];

  // 인접 구간 병합
  const merged: FocusPeriod[] = [filtered[0]];
  for (let i = 1; i < filtered.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = filtered[i];
    const pauseMs = new Date(curr.start).getTime() - new Date(prev.end).getTime();
    if (pauseMs <= MAX_PAUSE_MERGE_SECONDS * 1000) {
      merged[merged.length - 1] = { start: prev.start, end: curr.end };
    } else {
      merged.push(curr);
    }
  }

  // 상한 초과: 병합하지 않고 초과분을 그대로 드롭 (병합하면 그 안의 공백까지 집중 구간처럼 보임)
  if (merged.length <= MAX_PERIODS) return merged;
  return merged.slice(0, MAX_PERIODS);
}

// 앱에서 설정 가능한 최대 집중 시간보다 긴 구간은 저장 시점의 버그로 생긴 것 — 소비 시점에 방어적으로 잘라냄
export function clampPeriodDuration(period: FocusPeriod, maxSeconds: number): FocusPeriod {
  const start = new Date(period.start).getTime();
  const end = new Date(period.end).getTime();
  const maxEnd = start + maxSeconds * 1000;
  return end > maxEnd ? { start: period.start, end: new Date(maxEnd).toISOString() } : period;
}
