'use client';

import { Trash2 } from 'lucide-react';
import { useTaskStore } from '@/store/StoreProvider';
import type { Task } from '@/types';

interface Props {
  task: Task;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function TaskItem({ task, isSelected, onSelect }: Props) {
  const deleteTask = useTaskStore((s) => s.deleteTask);

  return (
    <div
      onClick={() => onSelect(task.id)}
      className={[
        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer group transition-colors',
        isSelected ? 'bg-primary/10' : 'hover:bg-muted/50',
      ].join(' ')}
    >
      {/* 선택 인디케이터 */}
      <div
        className={[
          'shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors',
          isSelected ? 'bg-primary' : 'border-2 border-border',
        ].join(' ')}
      >
        {isSelected && (
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

      {/* 제목 */}
      <span
        className={`flex-1 text-sm leading-snug truncate ${isSelected ? 'text-primary font-medium' : 'text-foreground'}`}
      >
        {task.title}
      </span>

      {/* 현재 세션 뱃지 */}
      {isSelected && (
        <span className="shrink-0 text-[10px] font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded">
          현재 세션
        </span>
      )}

      {/* 삭제 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
        aria-label="삭제"
        className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
