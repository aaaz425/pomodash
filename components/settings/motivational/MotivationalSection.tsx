'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Pencil, Check, X } from 'lucide-react';
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
  useSortable,
} from '@dnd-kit/sortable';
import { useSettingsStore } from '@/store/StoreProvider';
import { TextInput } from '@/components/shared/TextInput';

import { INPUT_LIMITS } from '@/lib/constants/limits';

interface MessageRowProps {
  id: string;
  message: string;
  isEditing: boolean;
  dragDisabled: boolean;
  onStartEdit: () => void;
  onSaveEdit: (text: string) => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

function MessageRow({
  id,
  message,
  isEditing,
  dragDisabled,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  canDelete,
}: MessageRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: dragDisabled,
  });
  const [draft, setDraft] = useState(message);
  const [prevIsEditing, setPrevIsEditing] = useState(isEditing);

  if (isEditing !== prevIsEditing) {
    setPrevIsEditing(isEditing);
    if (isEditing) setDraft(message);
  }

  const style = {
    transform: transform ? `translate3d(0px, ${transform.y}px, 0px)` : undefined,
    transition,
  };

  function handleSave() {
    if (draft.trim()) onSaveEdit(draft.trim());
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2 py-2 px-1 border-b border-border/50 last:border-0"
      >
        <TextInput
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              e.stopPropagation();
              onCancelEdit();
            }
          }}
          className="flex-1 min-w-0 py-1.5"
        />
        <button
          onClick={handleSave}
          disabled={!draft.trim()}
          aria-label="메시지 저장"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-primary hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-40 transition-colors shrink-0"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onCancelEdit}
          aria-label="편집 취소"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'flex items-center gap-2 py-2.5 px-1 group border-b border-border/50 last:border-0',
        isDragging ? 'opacity-50' : '',
      ].join(' ')}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="순서 조정"
        className="shrink-0 text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors touch-none"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>
      <span className="text-sm text-foreground flex-1 min-w-0 truncate pr-2">{message}</span>
      <button
        onClick={onStartEdit}
        aria-label="메시지 편집"
        className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-muted hover:text-foreground transition-all shrink-0"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onDelete}
        disabled={!canDelete}
        aria-label="메시지 삭제"
        className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-20 transition-all shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function MotivationalSection() {
  const messages = useSettingsStore((s) => s.motivationalMessages);
  const addMessage = useSettingsStore((s) => s.addMessage);
  const updateMessage = useSettingsStore((s) => s.updateMessage);
  const deleteMessage = useSettingsStore((s) => s.deleteMessage);
  const reorderMessages = useSettingsStore((s) => s.reorderMessages);

  const [input, setInput] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const isAtLimit = messages.length >= INPUT_LIMITS.MESSAGE_COUNT_MAX;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderMessages(String(active.id), String(over.id));
    }
  }

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed || isAtLimit) return;
    addMessage(trimmed);
    setInput('');
  }

  return (
    <div className="flex flex-col gap-4">
      <DndContext
        id="motivational-messages"
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={messages.map((_, i) => String(i))}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {messages.map((msg, i) => (
              <MessageRow
                key={msg}
                id={String(i)}
                message={msg}
                isEditing={editingMessage === msg}
                dragDisabled={editingMessage !== null}
                onStartEdit={() => setEditingMessage(msg)}
                onSaveEdit={(text) => {
                  updateMessage(i, text);
                  setEditingMessage(null);
                }}
                onCancelEdit={() => setEditingMessage(null)}
                onDelete={() => deleteMessage(i)}
                canDelete={messages.length > 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex items-center gap-2">
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="새 동기부여 메시지 입력"
          disabled={isAtLimit}
          className="flex-1 min-w-0 py-2 disabled:opacity-50"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim() || isAtLimit}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground/70">최소 1개는 유지해야 합니다.</p>
        <p className={`text-xs ${isAtLimit ? 'text-destructive/70' : 'text-muted-foreground/70'}`}>
          {messages.length} / {INPUT_LIMITS.MESSAGE_COUNT_MAX}
        </p>
      </div>
    </div>
  );
}
