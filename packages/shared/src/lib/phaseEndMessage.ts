import type { TimerPhase } from '../types/timer';

export interface PhaseEndMessageInput {
  phase: TimerPhase;
  cycleCount: number;
  totalCycles: number;
  shortBreakMinutes: number;
}

export function getPhaseEndMessage({
  phase,
  cycleCount,
  totalCycles,
  shortBreakMinutes,
}: PhaseEndMessageInput): { title: string; body: string } {
  if (phase === 'short-break') return { title: '휴식 종료!', body: '다시 집중할 시간이에요.' };
  if (cycleCount + 1 >= totalCycles) {
    return { title: '타이머 완료!', body: '모든 사이클을 마쳤어요. 수고했어요!' };
  }
  if (shortBreakMinutes === 0) return { title: '사이클 완료!', body: '바로 다음 집중을 시작해요.' };
  return { title: '집중 시간 종료!', body: '잠깐 쉬어가세요.' };
}
