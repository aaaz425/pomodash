'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { TaskQuickAddForm } from '@/components/shared/TaskQuickAddForm';
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
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  function handleAddTask(title: string, categoryId: string) {
    onAddTask(title, categoryId);
    setShowNewTaskForm(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">어떤 작업을 하셨나요?</span>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-[11px] text-muted-foreground">
            완료된 사이클 {cycleCount} / {totalCycles}
          </span>
          <CycleIndicator />
        </div>
      </div>

      {activeTasks.length === 0 && !showNewTaskForm ? (
        <p className="text-sm text-muted-foreground/60 py-2">등록된 작업이 없습니다</p>
      ) : !showNewTaskForm ? (
        <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
          {activeTasks.map((t) => {
            const cat = categories.find((c) => c.id === t.categoryId);
            const isSelected = selectedTaskId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelect(isSelected ? null : t.id)}
                className={[
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-left transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:bg-muted',
                ].join(' ')}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />
                ) : (
                  <div className="w-3.5 h-3.5 shrink-0" />
                )}
                {cat && <CategoryBadge category={cat} />}
                <span className="text-sm text-foreground truncate">{t.title}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {showNewTaskForm ? (
        <TaskQuickAddForm
          categories={categories}
          onAdd={handleAddTask}
          onCancel={() => setShowNewTaskForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowNewTaskForm(true)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          <Plus className="w-3.5 h-3.5" />새 작업 만들기
        </button>
      )}

      <p className="text-[11px] text-muted-foreground/60">선택하지 않으면 미분류로 저장됩니다</p>
    </div>
  );
}
