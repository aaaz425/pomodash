'use client';

import { useTimerStore } from '@/store/StoreProvider';
import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { TaskList } from '@/components/tasks/TaskList';
import { formatDuration } from '@/lib/sessionUtils';

interface Props {
  selectedTaskId: string | null;
  cycleCount: number;
  totalCycles: number;
  onSelect: (id: string) => void;
}

export function SessionTaskSelector({ selectedTaskId, cycleCount, totalCycles, onSelect }: Props) {
  const mode = useTimerStore((s) => s.mode);
  const accFocusSeconds = useTimerStore((s) => s.accFocusSeconds);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground min-w-0">어떤 작업을 하셨나요?</span>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {mode === 'free' ? (
            <span className="text-[11px] text-muted-foreground">
              자유 집중 {formatDuration(accFocusSeconds)}
            </span>
          ) : (
            <>
              <span className="text-[11px] text-muted-foreground">
                완료된 사이클 {cycleCount} / {totalCycles}
              </span>
              <CycleIndicator />
            </>
          )}
        </div>
      </div>

      <TaskList
        mode="select"
        selectedTaskId={selectedTaskId}
        onSelect={onSelect}
        listClassName="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto"
      />

      <p className="text-[11px] text-muted-foreground/60">선택하지 않으면 미분류로 저장됩니다</p>
    </div>
  );
}
