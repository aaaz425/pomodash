'use client';

import { useTimerStore, useHydrated } from '@/store/StoreProvider';
import { useCurrentTask } from '@/hooks/useCurrentTask';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { TimerRing } from '@/components/timer/TimerRing';
import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { TimerControls } from '@/components/timer/TimerControls';

export function TimerSection() {
  const hydrated = useHydrated();
  const focusMinutes = useTimerStore((s) => s.settings.focusMinutes);
  const shortBreakMinutes = useTimerStore((s) => s.settings.shortBreakMinutes);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);
  const { task, category } = useCurrentTask();

  return (
    <section className="flex flex-col items-center justify-center gap-6 flex-1 py-8 sm:py-0 px-4">
      {/* 현재 작업 */}
      <div className="flex items-center gap-2 h-5 text-sm text-muted-foreground">
        {task ? (
          <>
            {category && <CategoryBadge category={category} />}
            <span>{task.title}</span>
          </>
        ) : (
          <span className="text-muted-foreground/50">선택된 작업이 없습니다</span>
        )}
      </div>

      {/* 타이머 링 */}
      <TimerRing />

      {/* 사이클 */}
      <CycleIndicator />

      {/* 세션 설정 카드 */}
      <div
        className={`flex items-center rounded-lg border border-border bg-card divide-x divide-border transition-opacity duration-300 ${hydrated ? 'opacity-100' : 'opacity-0'}`}
      >
        {[
          { value: `${focusMinutes}분`, label: '집중' },
          { value: `${shortBreakMinutes}분`, label: '휴식' },
          { value: `${totalCycles}회`, label: '사이클' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5 px-4 py-2.5">
            <span className="text-sm font-semibold text-foreground">{value}</span>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* 컨트롤 */}
      <TimerControls />
    </section>
  );
}
