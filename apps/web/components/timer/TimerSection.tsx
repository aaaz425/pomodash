'use client';

import { useCurrentTask } from '@/hooks/useCurrentTask';
import { useDelayedHydration } from '@/hooks/useDelayedHydration';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { TimerRing } from '@/components/timer/TimerRing';
import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { TimerControls } from '@/components/timer/TimerControls';

export function TimerSection() {
  const { hydrated, showSkeleton } = useDelayedHydration();
  const { task, category } = useCurrentTask();

  return (
    <section className="flex flex-col items-center justify-center gap-6 flex-1 py-8 sm:py-0 px-4">
      {/* 현재 작업 */}
      <div className="flex items-center gap-2 h-5 text-sm text-muted-foreground">
        {!hydrated ? (
          showSkeleton && <Skeleton className="h-4 w-24" />
        ) : task ? (
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

      {/* 컨트롤 */}
      <TimerControls />
    </section>
  );
}
