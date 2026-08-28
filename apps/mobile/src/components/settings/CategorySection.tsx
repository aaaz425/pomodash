import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { CATEGORY_LIMITS } from '@pomodash/shared';
import { useTaskStore } from '@/store/StoreProvider';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { CategoryEditModal } from '@/components/settings/CategoryEditModal';
import { CATEGORY_HEX } from '@/constants/categoryColors';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Category } from '@/types/tasks';

function CategoryRow({
  category,
  onEdit,
  onDelete,
  drag,
  isActive,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  drag: () => void;
  isActive: boolean;
}) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: withAlpha(theme.border, 0.5) },
        isActive && styles.dragging,
      ]}
    >
      <View style={styles.left}>
        <Pressable onLongPress={drag} delayLongPress={150} hitSlop={8}>
          <GripVertical size={14} color={withAlpha(theme.mutedForeground, 0.3)} />
        </Pressable>
        <View style={[styles.dot, { backgroundColor: CATEGORY_HEX[category.color] }]} />
        <Text style={[styles.name, { color: theme.foreground, fontFamily: FONTS.sansRegular }]}>
          {category.name}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={onEdit} hitSlop={4} style={styles.iconButton}>
          <Pencil size={14} color={theme.mutedForeground} />
        </Pressable>
        <Pressable onPress={onDelete} hitSlop={4} style={styles.iconButton}>
          <Trash2 size={14} color={theme.mutedForeground} />
        </Pressable>
      </View>
    </View>
  );
}

export function CategorySection() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const categories = useTaskStore((s) => s.categories);
  const tasks = useTaskStore((s) => s.tasks);
  const deleteCategory = useTaskStore((s) => s.deleteCategory);
  const reorderCategories = useTaskStore((s) => s.reorderCategories);
  const isAtLimit = categories.length >= CATEGORY_LIMITS.COUNT_MAX;

  const [editTarget, setEditTarget] = useState<Category | 'new' | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [blockedName, setBlockedName] = useState<string | null>(null);

  function requestDelete(category: Category) {
    if (tasks.some((t) => t.categoryId === category.id)) {
      setBlockedName(category.name);
      return;
    }
    setDeleteTargetId(category.id);
  }

  function handleDelete() {
    if (!deleteTargetId) return;
    void deleteCategory(deleteTargetId);
    setDeleteTargetId(null);
  }

  return (
    <View>
      <DraggableFlatList
        data={categories}
        keyExtractor={(c) => c.id}
        style={styles.scrollList}
        onDragEnd={({ from, to }) => void reorderCategories(from, to)}
        renderItem={({ item, drag, isActive }: RenderItemParams<Category>) => (
          <CategoryRow
            category={item}
            onEdit={() => setEditTarget(item)}
            onDelete={() => requestDelete(item)}
            drag={drag}
            isActive={isActive}
          />
        )}
      />

      <View style={styles.footer}>
        <Pressable
          onPress={() => !isAtLimit && setEditTarget('new')}
          disabled={isAtLimit}
          style={[styles.addButton, isAtLimit && styles.disabled]}
        >
          <Plus size={16} color={theme.mutedForeground} />
          <Text
            style={[
              styles.addLabel,
              { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
            ]}
          >
            카테고리 추가
          </Text>
        </Pressable>
        <Text
          style={[
            styles.counter,
            {
              color: isAtLimit
                ? withAlpha(theme.destructive, 0.7)
                : withAlpha(theme.mutedForeground, 0.7),
              fontFamily: FONTS.sansRegular,
            },
          ]}
        >
          {categories.length} / {CATEGORY_LIMITS.COUNT_MAX}
        </Text>
      </View>

      {editTarget !== null && (
        <CategoryEditModal
          category={editTarget === 'new' ? null : editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      <ConfirmModal
        visible={deleteTargetId !== null}
        title="카테고리 삭제"
        description="삭제한 카테고리는 복구할 수 없습니다. 해당 카테고리를 사용 중인 작업에서는 카테고리가 표시되지 않습니다."
        confirmLabel="삭제"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ConfirmModal
        visible={blockedName !== null}
        title="삭제할 수 없어요"
        description={`'${blockedName}' 카테고리를 쓰는 작업이 있어요. 작업을 먼저 옮기거나 삭제해주세요`}
        confirmLabel="확인"
        onConfirm={() => setBlockedName(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollList: {
    maxHeight: 312, // 행(52px) 6개 근사값
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  dragging: {
    opacity: 0.5,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  name: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addLabel: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.4,
  },
  counter: {
    fontSize: 12,
  },
});
