import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';
import { Plus } from 'lucide-react-native';
import { useTaskStore } from '@/store/StoreProvider';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { TaskItem } from './TaskItem';
import { TaskFormModal } from './TaskFormModal';
import type { Task } from '@/types/tasks';

interface Props {
  mode: 'select' | 'manage';
  selectedTaskId?: string | null;
  onSelect?: (id: string) => void;
  maxHeight?: number;
  emptyStatePaddingVertical?: number;
}

export function TaskList({
  mode,
  selectedTaskId = null,
  onSelect,
  maxHeight,
  emptyStatePaddingVertical,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const tasks = useTaskStore((s) => s.tasks);
  const reorderTasks = useTaskStore((s) => s.reorderTasks);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const [editTarget, setEditTarget] = useState<Task | 'new' | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleTasks = tasks.filter((t) => !t.completed);

  async function handleDelete() {
    if (!deleteTargetId || isDeleting) return;
    setIsDeleting(true);
    await deleteTask(deleteTargetId);
    setIsDeleting(false);
    setDeleteTargetId(null);
  }

  function handleCreated(id: string) {
    if (mode === 'select') onSelect?.(id);
  }

  function renderRow(task: Task, dragProps?: { drag: () => void; isActive: boolean }) {
    return (
      <TaskItem
        key={task.id}
        task={task}
        mode={mode}
        isSelected={task.id === selectedTaskId}
        onSelect={onSelect}
        onEdit={setEditTarget}
        onDeleteRequest={setDeleteTargetId}
        onDrag={dragProps?.drag}
        isDragging={dragProps?.isActive}
      />
    );
  }

  return (
    <View>
      {visibleTasks.length === 0 ? (
        <EmptyState
          message="아직 작업이 없어요"
          subMessage="아래에서 작업을 추가해보세요"
          paddingVertical={emptyStatePaddingVertical}
        />
      ) : mode === 'manage' ? (
        <DraggableFlatList
          data={visibleTasks}
          keyExtractor={(t) => t.id}
          scrollEnabled={false}
          onDragEnd={({ from, to }) => void reorderTasks(from, to)}
          renderItem={({ item, drag, isActive }: RenderItemParams<Task>) =>
            renderRow(item, { drag, isActive })
          }
          contentContainerStyle={styles.list}
        />
      ) : (
        <ScrollView style={maxHeight ? { maxHeight } : undefined}>
          <View style={styles.list}>{visibleTasks.map((t) => renderRow(t))}</View>
        </ScrollView>
      )}

      <Pressable onPress={() => setEditTarget('new')} style={styles.addButton}>
        <Plus size={14} color={theme.mutedForeground} />
        <Text
          style={[styles.addLabel, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          새 작업 추가
        </Text>
      </Pressable>

      {editTarget !== null && (
        <TaskFormModal
          task={editTarget === 'new' ? null : editTarget}
          onClose={() => setEditTarget(null)}
          onCreated={handleCreated}
        />
      )}

      <ConfirmModal
        visible={deleteTargetId !== null}
        title="작업 삭제"
        description="삭제한 작업은 복구할 수 없습니다."
        confirmLabel="삭제"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={isDeleting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  addLabel: {
    fontSize: 14,
  },
});
