'use client';

import { useTimerStore, useHydrated } from '@/store/StoreProvider';
import { useTimer } from '@/hooks/useTimer';

export function CycleIndicator() {
  const hydrated = useHydrated();
  const { phase } = useTimer();
  const cycleCount = useTimerStore((s) => s.cycleCount);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);

  return (
    <div
      className={`flex items-center gap-2 transition-opacity duration-300 ${hydrated ? 'opacity-100' : 'opacity-0'}`}
    >
      {Array.from({ length: totalCycles }).map((_, i) => {
        const isCompleted = i < cycleCount;
        const isCurrent = !isCompleted && i === cycleCount && phase === 'focus';

        return (
          <div
            key={i}
            className={[
              'w-2 h-2 rounded-full transition-all duration-300',
              isCompleted ? 'bg-[#10d9a0]' : '',
              isCurrent ? 'bg-[#10d9a0] animate-pulse' : '',
              !isCompleted && !isCurrent ? 'border-[1.5px] border-border' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        );
      })}
    </div>
  );
}
