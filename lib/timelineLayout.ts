import type { Session, TimelineBlock } from '@/types';
import { getSessionsForDate } from '@/lib/sessionUtils';

const MINUTES_PER_DAY = 24 * 60;
// 짧은 집중 구간도 화면에서 탭 가능한 크기로 보이도록 하는 최소 시각적 높이(%)
const MIN_HEIGHT_PERCENT = 2;

function formatHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function getDayTimelineBlocks(sessions: Session[], date: Date): TimelineBlock[] {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayEnd = new Date(dayStart.getTime() + MINUTES_PER_DAY * 60 * 1000);

  const daySessions = getSessionsForDate(sessions, date);
  const blocks: TimelineBlock[] = [];

  for (const session of daySessions) {
    for (const period of session.focusPeriods) {
      const start = new Date(period.start);
      const end = new Date(period.end);
      // 자정을 넘나드는 구간은 해당 날짜 범위로 잘라서 배치 — 시간 라벨은 실제 시작/종료 시각 그대로 표시
      const clampedStart = start < dayStart ? dayStart : start;
      const clampedEnd = end > dayEnd ? dayEnd : end;
      if (clampedEnd <= clampedStart) continue;

      const startMinutes = (clampedStart.getTime() - dayStart.getTime()) / 60_000;
      const endMinutes = (clampedEnd.getTime() - dayStart.getTime()) / 60_000;

      const top = (startMinutes / MINUTES_PER_DAY) * 100;
      const rawHeight = ((endMinutes - startMinutes) / MINUTES_PER_DAY) * 100;
      const height = Math.min(Math.max(rawHeight, MIN_HEIGHT_PERCENT), 100 - top);

      blocks.push({
        sessionId: session.id,
        taskId: session.taskId,
        top,
        height,
        startLabel: formatHHMM(start),
        endLabel: formatHHMM(end),
      });
    }
  }

  return blocks.sort((a, b) => a.top - b.top);
}
