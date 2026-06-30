import type { FocusPeriod } from '@/types';
import { FOCUS_PERIOD_LIMITS } from '@/lib/constants/limits';

const { MIN_FOCUS_SECONDS, MAX_PAUSE_MERGE_SECONDS, MAX_PERIODS } = FOCUS_PERIOD_LIMITS;

/**
 * 저장 전 focusPeriods 배열을 정리한다.
 * - 5초 미만 집중 구간 제거 (노이즈)
 * - 5초 이하 일시정지로 나뉜 인접 구간 병합
 * - 최대 100개 상한 (초과 시 나머지를 마지막 구간으로 합침)
 */
export function normalizeFocusPeriods(periods: FocusPeriod[]): FocusPeriod[] {
  if (periods.length === 0) return [];

  // 1. 5초 미만 집중 구간 제거
  const filtered = periods.filter((p) => {
    const durationMs = new Date(p.end).getTime() - new Date(p.start).getTime();
    return durationMs >= MIN_FOCUS_SECONDS * 1000;
  });

  if (filtered.length === 0) return [];

  // 2. 5초 이하 일시정지로 나뉜 인접 구간 병합
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

  // 3. 최대 100개 상한 — 초과분은 마지막 구간으로 합침
  if (merged.length <= MAX_PERIODS) return merged;

  const capped = merged.slice(0, MAX_PERIODS - 1);
  const last = merged[merged.length - 1];
  capped.push({ start: merged[MAX_PERIODS - 1].start, end: last.end });
  return capped;
}
