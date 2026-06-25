import { describe, expect, it } from 'vitest';

import type { FocusPeriod } from '@/types';
import { normalizeFocusPeriods } from './focusPeriods';

const BASE = new Date('2024-01-01T00:00:00.000Z').getTime();

function period(startOffsetMs: number, endOffsetMs: number): FocusPeriod {
  return {
    start: new Date(BASE + startOffsetMs).toISOString(),
    end: new Date(BASE + endOffsetMs).toISOString(),
  };
}

describe('normalizeFocusPeriods', () => {
  it('빈 배열이면 빈 배열 반환', () => {
    expect(normalizeFocusPeriods([])).toEqual([]);
  });

  it('5초 미만 구간은 제거됨', () => {
    const result = normalizeFocusPeriods([period(0, 4999)]);
    expect(result).toEqual([]);
  });

  it('정확히 5초인 구간은 유지됨', () => {
    const p = period(0, 5000);
    const result = normalizeFocusPeriods([p]);
    expect(result).toEqual([p]);
  });

  it('모든 구간이 5초 미만이면 빈 배열 반환', () => {
    const result = normalizeFocusPeriods([period(0, 1000), period(10_000, 13_000)]);
    expect(result).toEqual([]);
  });

  it('5초 초과 일시정지로 나뉜 인접 구간은 분리 유지', () => {
    // 0~10s, 다음 구간은 15.001s에 시작 (5001ms 간격), 자체 길이는 5초 이상 유지
    const a = period(0, 10_000);
    const b = period(15_001, 25_000);
    const result = normalizeFocusPeriods([a, b]);
    expect(result).toEqual([a, b]);
  });

  it('정확히 5초 일시정지로 나뉜 인접 구간은 병합됨', () => {
    const a = period(0, 10_000);
    const b = period(15_000, 20_000);
    const result = normalizeFocusPeriods([a, b]);
    expect(result).toEqual([{ start: a.start, end: b.end }]);
  });

  it('5초 미만 일시정지로 나뉜 인접 구간은 병합됨', () => {
    const a = period(0, 10_000);
    const b = period(11_000, 20_000);
    const result = normalizeFocusPeriods([a, b]);
    expect(result).toEqual([{ start: a.start, end: b.end }]);
  });

  it('병합된 구간의 start/end는 각각 첫 구간의 start와 마지막 구간의 end', () => {
    const a = period(0, 10_000);
    const b = period(12_000, 20_000);
    const [merged] = normalizeFocusPeriods([a, b]);
    expect(merged.start).toBe(a.start);
    expect(merged.end).toBe(b.end);
  });

  it('3개 이상 연속 병합 — 모두 하나의 구간으로 합쳐짐', () => {
    const a = period(0, 10_000);
    const b = period(12_000, 20_000);
    const c = period(21_000, 30_000);
    const result = normalizeFocusPeriods([a, b, c]);
    expect(result).toEqual([{ start: a.start, end: c.end }]);
  });

  it('병합 가능 구간과 분리 구간이 섞여 있으면 그룹별로 정확히 나뉨', () => {
    const a = period(0, 10_000);
    const b = period(12_000, 20_000); // a와 2초 간격 → 병합
    const c = period(30_000, 40_000); // b와 10초 간격 → 분리
    const d = period(43_000, 50_000); // c와 3초 간격 → 병합
    const result = normalizeFocusPeriods([a, b, c, d]);
    expect(result).toEqual([
      { start: a.start, end: b.end },
      { start: c.start, end: d.end },
    ]);
  });

  it('필터링 후 남은 구간이 100개 이하면 그대로 반환', () => {
    // 서로 10초씩 떨어진(병합 안 되는) 100개 구간
    const periods = Array.from({ length: 100 }, (_, i) => period(i * 20_000, i * 20_000 + 10_000));
    const result = normalizeFocusPeriods(periods);
    expect(result).toHaveLength(100);
    expect(result).toEqual(periods);
  });

  it('병합 후 구간이 101개면 마지막 구간이 100번째 구간과 합쳐짐', () => {
    const periods = Array.from({ length: 101 }, (_, i) => period(i * 20_000, i * 20_000 + 10_000));
    const result = normalizeFocusPeriods(periods);
    expect(result).toHaveLength(100);
    expect(result[99]).toEqual({ start: periods[99].start, end: periods[100].end });
    // 100번째 이전 구간들은 그대로 유지됨
    expect(result.slice(0, 99)).toEqual(periods.slice(0, 99));
  });

  it('병합 후 정확히 100개면 캡 로직이 적용되지 않음', () => {
    const periods = Array.from({ length: 100 }, (_, i) => period(i * 20_000, i * 20_000 + 10_000));
    const result = normalizeFocusPeriods(periods);
    expect(result).toHaveLength(100);
    expect(result[99]).toEqual(periods[99]);
  });

  it('필터링/병합으로 100개를 초과하지 않게 되면 캡되지 않음', () => {
    // 150개 구간이 모두 인접(1초 간격)하여 병합되면 결과는 1개 — 캡 미적용
    const periods = Array.from({ length: 150 }, (_, i) => period(i * 6_000, i * 6_000 + 5_000));
    const result = normalizeFocusPeriods(periods);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ start: periods[0].start, end: periods[149].end });
  });

  it('필터링(5초 미만 제거)과 병합이 모두 적용된 후 캡이 적용됨', () => {
    // 짝수 인덱스는 4초(필터 제거 대상), 홀수 인덱스는 10초(유지)이며
    // 유지되는 구간들끼리는 서로 분리(20초 간격)되어 102개 입력 중 51개만 남아 캡과 무관
    // → 별도로 분리된(병합 안 되는) 짧은 구간들을 추가로 섞어 필터→병합→캡 순서를 한 번에 검증
    const noisy = period(0, 2000); // 5초 미만 → 제거됨
    const kept = Array.from({ length: 101 }, (_, i) =>
      period(10_000 + i * 20_000, 10_000 + i * 20_000 + 10_000),
    ); // 서로 분리된(병합 안 되는) 101개 유효 구간
    const result = normalizeFocusPeriods([noisy, ...kept]);
    expect(result).toHaveLength(100);
    expect(result[99]).toEqual({ start: kept[99].start, end: kept[100].end });
  });
});
