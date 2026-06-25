'use client';

import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { TaskPickerList } from '@/components/timer/TaskPickerList';
import type { Task, Category } from '@/types';

interface Props {
  activeTasks: Task[];
  categories: Category[];
  selectedTaskId: string | null;
  cycleCount: number;
  totalCycles: number;
  onSelect: (id: string | null) => void;
  onAddTask: (title: string, categoryId: string) => void;
}

export function SessionTaskSelector({
  activeTasks,
  categories,
  selectedTaskId,
  cycleCount,
  totalCycles,
  onSelect,
  onAddTask,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground min-w-0">어떤 작업을 하셨나요?</span>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-[11px] text-muted-foreground">
            완료된 사이클 {cycleCount} / {totalCycles}
          </span>
          <CycleIndicator />
        </div>
      </div>

      <TaskPickerList
        activeTasks={activeTasks}
        categories={categories}
        selectedTaskId={selectedTaskId}
        onSelect={onSelect}
        onAddTask={onAddTask}
      />

      <p className="text-[11px] text-muted-foreground/60">선택하지 않으면 미분류로 저장됩니다</p>
    </div>
  );
}
