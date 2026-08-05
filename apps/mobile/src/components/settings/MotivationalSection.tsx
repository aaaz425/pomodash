import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';
import { Check, GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react-native';
import { INPUT_LIMITS } from '@pomodash/shared';
import { useSettingsStore } from '@/store/StoreProvider';
import { TextInput } from '@/components/shared/TextInput';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

function MessageRow({
  message,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  canDelete,
  drag,
  isActive,
}: {
  message: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSaveEdit: (text: string) => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
  drag: () => void;
  isActive: boolean;
}) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const [draft, setDraft] = useState(message);

  if (isEditing) {
    return (
      <View style={[styles.row, { borderBottomColor: withAlpha(theme.border, 0.5) }]}>
        <TextInput
          autoFocus
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => draft.trim() && onSaveEdit(draft.trim())}
          style={styles.input}
        />
        <Pressable
          onPress={() => draft.trim() && onSaveEdit(draft.trim())}
          disabled={!draft.trim()}
          hitSlop={4}
          style={styles.iconButton}
        >
          <Check size={14} color={theme.primary} />
        </Pressable>
        <Pressable onPress={onCancelEdit} hitSlop={4} style={styles.iconButton}>
          <X size={14} color={theme.mutedForeground} />
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: withAlpha(theme.border, 0.5) },
        isActive && styles.dragging,
      ]}
    >
      <Pressable onLongPress={drag} delayLongPress={150} hitSlop={8}>
        <GripVertical size={14} color={withAlpha(theme.mutedForeground, 0.3)} />
      </Pressable>
      <Text
        numberOfLines={1}
        style={[styles.message, { color: theme.foreground, fontFamily: FONTS.sansRegular }]}
      >
        {message}
      </Text>
      <Pressable onPress={onStartEdit} hitSlop={4} style={styles.iconButton}>
        <Pencil size={14} color={theme.mutedForeground} />
      </Pressable>
      <Pressable onPress={onDelete} disabled={!canDelete} hitSlop={4} style={styles.iconButton}>
        <Trash2
          size={14}
          color={canDelete ? theme.mutedForeground : withAlpha(theme.mutedForeground, 0.3)}
        />
      </Pressable>
    </View>
  );
}

export function MotivationalSection() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const messages = useSettingsStore((s) => s.motivationalMessages);
  const addMessage = useSettingsStore((s) => s.addMessage);
  const updateMessage = useSettingsStore((s) => s.updateMessage);
  const deleteMessage = useSettingsStore((s) => s.deleteMessage);
  const reorderMessages = useSettingsStore((s) => s.reorderMessages);

  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const isAtLimit = messages.length >= INPUT_LIMITS.MESSAGE_COUNT_MAX;

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed || isAtLimit) return;
    void addMessage(trimmed);
    setInput('');
  }

  return (
    <View>
      <DraggableFlatList
        data={messages}
        keyExtractor={(item) => item}
        onDragEnd={({ from, to }) => void reorderMessages(from, to)}
        renderItem={({ item, getIndex, drag, isActive }: RenderItemParams<string>) => {
          const index = getIndex() ?? 0;
          return (
            <MessageRow
              message={item}
              isEditing={editingIndex === index}
              onStartEdit={() => setEditingIndex(index)}
              onSaveEdit={(text) => {
                void updateMessage(index, text);
                setEditingIndex(null);
              }}
              onCancelEdit={() => setEditingIndex(null)}
              onDelete={() => void deleteMessage(index)}
              canDelete={messages.length > INPUT_LIMITS.MESSAGE_COUNT_MIN}
              drag={drag}
              isActive={isActive}
            />
          );
        }}
      />

      <View style={styles.addRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
          placeholder="새 동기부여 메시지 입력"
          editable={!isAtLimit}
          style={styles.input}
        />
        <Pressable
          onPress={handleAdd}
          disabled={!input.trim() || isAtLimit}
          style={[styles.addButton, { backgroundColor: theme.muted }]}
        >
          <Plus size={14} color={theme.mutedForeground} />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            { color: withAlpha(theme.mutedForeground, 0.7), fontFamily: FONTS.sansRegular },
          ]}
        >
          최소 1개는 유지해야 합니다.
        </Text>
        <Text
          style={[
            styles.footerText,
            {
              color: isAtLimit
                ? withAlpha(theme.destructive, 0.7)
                : withAlpha(theme.mutedForeground, 0.7),
              fontFamily: FONTS.sansRegular,
            },
          ]}
        >
          {messages.length} / {INPUT_LIMITS.MESSAGE_COUNT_MAX}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  dragging: {
    opacity: 0.5,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  input: {
    flex: 1,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
  },
});
