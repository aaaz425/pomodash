'use client';

import { SessionProgressBadge } from '@/components/timer/SessionProgressBadge';
import { TaskList } from '@/components/tasks/TaskList';

interface Props {
  selectedTaskId: string | null;
  onSelect: (id: string) => void;
}

export function SessionTaskSelector({ selectedTaskId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground min-w-0">어떤 작업을 하셨나요?</span>
        <SessionProgressBadge />
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
