'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useTaskStore } from '@/store/StoreProvider';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import type { Task } from '@/types';

interface Props {
  mode: 'select' | 'manage';
  selectedTaskId?: string | null;
  onSelect?: (id: string) => void;
  listClassName?: string;
}

export function TaskList({ mode, selectedTaskId = null, onSelect, listClassName }: Props) {
  const tasks = useTaskStore((s) => s.tasks);
  const reorderTasks = useTaskStore((s) => s.reorderTasks);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const [editTarget, setEditTarget] = useState<Task | 'new' | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const visibleTasks = tasks.filter((t) => !t.completed);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTasks(String(active.id), String(over.id));
    }
  }

  function handleDelete() {
    if (!deleteTargetId) return;
    deleteTask(deleteTargetId);
    setDeleteTargetId(null);
  }

  function handleCreated(id: string) {
    if (mode === 'select') onSelect?.(id);
  }

  return (
    <>
      {visibleTasks.length === 0 ? (
        <EmptyState
          message="아직 작업이 없어요"
          subMessage="아래에서 작업을 추가해보세요"
          className="py-10"
        />
      ) : (
        <DndContext
          id="task-list"
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={listClassName ?? 'flex flex-col gap-1'}>
              {visibleTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  mode={mode}
                  isSelected={task.id === selectedTaskId}
                  onSelect={onSelect}
                  onEdit={setEditTarget}
                  onDeleteRequest={setDeleteTargetId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <button
        type="button"
        onClick={() => setEditTarget('new')}
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <Plus className="w-3.5 h-3.5" />새 작업 추가
      </button>

      {editTarget !== null && (
        <TaskFormModal
          task={editTarget === 'new' ? null : editTarget}
          onClose={() => setEditTarget(null)}
          onCreated={handleCreated}
        />
      )}

      <ConfirmDialog
        open={deleteTargetId !== null}
        title="작업 삭제"
        description="삭제한 작업은 복구할 수 없습니다."
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  );
}
