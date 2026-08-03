import { PHASE_GLOW, NEUTRAL_GLOW } from '@/lib/constants/timerColors';
import type { TimerPhase } from '@/types/models';

interface Props {
  phase: TimerPhase;
  isNeutral: boolean;
}

export function TimerGlow({ phase, isNeutral }: Props) {
  const glow = isNeutral ? NEUTRAL_GLOW : PHASE_GLOW[phase];

  return (
    <div
      className={`absolute pointer-events-none rounded-full w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${glow} ${!isNeutral ? 'timer-glow-pulse' : ''}`}
    />
  );
}
