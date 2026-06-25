'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { TaskQuickAddForm } from '@/components/shared/TaskQuickAddForm';
import type { Task, Category } from '@/types';

interface Props {
  activeTasks: Task[];
  categories: Category[];
  selectedTaskId: string | null;
  onSelect: (id: string | null) => void;
  onAddTask: (title: string, categoryId: string) => void;
  emptyMessageClassName?: string;
}

export function TaskPickerList({
  activeTasks,
  categories,
  selectedTaskId,
  onSelect,
  onAddTask,
  emptyMessageClassName = 'text-sm text-muted-foreground/60 py-2',
}: Props) {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  function handleAddTask(title: string, categoryId: string) {
    onAddTask(title, categoryId);
    setShowNewTaskForm(false);
  }

  return (
    <>
      {activeTasks.length === 0 && !showNewTaskForm ? (
        <p className={emptyMessageClassName}>등록된 작업이 없습니다</p>
      ) : !showNewTaskForm ? (
        <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
          {activeTasks.map((t) => {
            const cat = categories.find((c) => c.id === t.categoryId);
            const isSelected = selectedTaskId === t.id;
            return (
              <button
                key={t.id}
                type="button"
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
          type="button"
          onClick={() => setShowNewTaskForm(true)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          <Plus className="w-3.5 h-3.5" />새 작업 만들기
        </button>
      )}
    </>
  );
}
