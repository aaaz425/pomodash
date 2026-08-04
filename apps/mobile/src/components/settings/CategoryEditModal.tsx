import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTaskStore } from '@/store/StoreProvider';
import { Modal } from '@/components/shared/Modal';
import { TextInput } from '@/components/shared/TextInput';
import {
  CATEGORY_COLOR_KEYS,
  CATEGORY_HEX,
  type CategoryColorKey,
} from '@/constants/categoryColors';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Category } from '@/types/tasks';

interface Props {
  category: Category | null; // null = 새 카테고리
  onClose: () => void;
}

export function CategoryEditModal({ category, onClose }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const addCategory = useTaskStore((s) => s.addCategory);
  const updateCategory = useTaskStore((s) => s.updateCategory);

  const [name, setName] = useState(category?.name ?? '');
  const [color, setColor] = useState<CategoryColorKey>(category?.color ?? CATEGORY_COLOR_KEYS[0]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (category) {
      updateCategory(category.id, { name: trimmed, color });
    } else {
      addCategory({ name: trimmed, color });
    }
    onClose();
  }

  return (
    <Modal
      visible
      title={category ? '카테고리 편집' : '카테고리 추가'}
      onClose={onClose}
      footer={
        <>
          <Pressable
            onPress={onClose}
            style={[styles.footerButton, { backgroundColor: theme.muted }]}
          >
            <Text
              style={[
                styles.footerButtonText,
                { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              취소
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={!name.trim()}
            style={[
              styles.footerButton,
              { backgroundColor: theme.primary },
              !name.trim() && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.footerButtonText,
                { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              저장
            </Text>
          </Pressable>
        </>
      }
    >
      <View style={styles.field}>
        <Text
          style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansMedium }]}
        >
          이름
        </Text>
        <TextInput
          autoFocus
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleSave}
          placeholder="카테고리 이름"
        />
      </View>

      <View style={styles.field}>
        <Text
          style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansMedium }]}
        >
          색상
        </Text>
        <View style={styles.swatchRow}>
          {CATEGORY_COLOR_KEYS.map((key) => {
            const selected = color === key;
            return (
              <Pressable
                key={key}
                onPress={() => setColor(key)}
                style={[
                  styles.swatch,
                  { backgroundColor: CATEGORY_HEX[key] },
                  selected && [
                    styles.swatchSelected,
                    { borderColor: theme.foreground, transform: [{ scale: 1.1 }] },
                  ],
                ]}
              />
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 12,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  swatchSelected: {
    borderWidth: 2,
  },
  footerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  footerButtonText: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.4,
  },
});
