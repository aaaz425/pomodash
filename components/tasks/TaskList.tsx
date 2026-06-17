'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTaskStore } from '@/store/StoreProvider';
import { TaskItem } from './TaskItem';

interface Props {
  selectedTaskId: string | null;
  onSelect: (id: string) => void;
}

export function TaskList({ selectedTaskId, onSelect }: Props) {
  const tasks = useTaskStore((s) => s.tasks);
  const reorderTasks = useTaskStore((s) => s.reorderTasks);
  const active = tasks.filter((t) => !t.completed);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active: dragActive, over } = event;
    if (over && dragActive.id !== over.id) {
      reorderTasks(String(dragActive.id), String(over.id));
    }
  }

  if (active.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 text-center py-10">
        <p className="text-sm text-muted-foreground">아직 작업이 없어요</p>
        <p className="text-xs text-muted-foreground/60">아래에서 작업을 추가해보세요</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={active.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="overflow-y-auto flex-1 py-1">
          {active.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={task.id === selectedTaskId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
