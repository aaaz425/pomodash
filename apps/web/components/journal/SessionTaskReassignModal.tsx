'use client';

import { Modal } from '@/components/shared/Modal';
import { Badge } from '@/components/shared/Badge';
import { TaskList } from '@/components/tasks/TaskList';

interface Props {
  selectedTaskId: string | null;
  onSelect: (taskId: string | null) => void;
  onClose: () => void;
}

export function SessionTaskReassignModal({ selectedTaskId, onSelect, onClose }: Props) {
  const isUnclassified = selectedTaskId === null;

  function handleSelectTask(id: string) {
    onSelect(id);
    onClose();
  }

  function handleSelectUnclassified() {
    onSelect(null);
    onClose();
  }

  return (
    <Modal title="작업 변경" onClose={onClose}>
      <button
        type="button"
        onClick={handleSelectUnclassified}
        className={[
          'flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left',
          isUnclassified ? 'bg-primary/10' : 'hover:bg-muted/50',
        ].join(' ')}
      >
        <div
          className={[
            'shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors',
            isUnclassified ? 'bg-primary' : 'border-2 border-border',
          ].join(' ')}
        >
          {isUnclassified && (
            <svg viewBox="0 0 10 8" className="w-2.5 h-2.5">
              <path
                d="M1 4l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              />
            </svg>
          )}
        </div>
        <span
          className={[
            'flex-1 text-sm leading-snug',
            isUnclassified ? 'text-primary font-medium' : 'text-foreground',
          ].join(' ')}
        >
          미분류
        </span>
        {isUnclassified && (
          <Badge className="shrink-0 rounded text-[10px] font-semibold bg-primary text-primary-foreground">
            선택됨
          </Badge>
        )}
      </button>

      <TaskList
        mode="select"
        selectedTaskId={selectedTaskId}
        onSelect={handleSelectTask}
        listClassName="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto"
      />
    </Modal>
  );
}
