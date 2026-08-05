import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { INPUT_LIMITS } from '@pomodash/shared';
import { TextInput } from '@/components/shared/TextInput';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  note: string | null;
  onSave: (note: string | null) => void;
}

export function JournalNoteEditor({ note, onSave }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note ?? '');

  function handleSave() {
    const next = draft.trim() || null;
    if (next !== note) onSave(next);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(note ?? '');
    setEditing(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            styles.sectionLabel,
            { color: theme.mutedForeground, fontFamily: FONTS.sansSemiBold },
          ]}
        >
          메모
        </Text>
        {!editing && (
          <Pressable onPress={() => setEditing(true)} hitSlop={4} style={styles.editButton}>
            <Pencil size={12} color={theme.mutedForeground} />
            <Text
              style={[
                styles.editText,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              편집
            </Text>
          </Pressable>
        )}
      </View>

      {editing ? (
        <View style={styles.editingContainer}>
          <TextInput
            multiline
            numberOfLines={4}
            maxLength={INPUT_LIMITS.NOTE_MAX_LENGTH}
            value={draft}
            onChangeText={setDraft}
            placeholder="세션에 대한 메모를 남겨보세요..."
            style={styles.textInput}
          />
          <View style={styles.editingFooter}>
            <Text
              style={[
                styles.counter,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              {draft.length} / {INPUT_LIMITS.NOTE_MAX_LENGTH}
            </Text>
            <View style={styles.actions}>
              <Pressable onPress={handleCancel} hitSlop={4}>
                <Text
                  style={[
                    styles.actionText,
                    { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                  ]}
                >
                  취소
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
              >
                <Text
                  style={[
                    styles.saveButtonText,
                    { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
                  ]}
                >
                  저장
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => setEditing(true)}
          style={[styles.displayBox, { backgroundColor: withAlpha(theme.muted, 0.4) }]}
        >
          <Text
            style={[
              styles.displayText,
              {
                color: note ? theme.foreground : theme.mutedForeground,
                fontFamily: FONTS.sansRegular,
              },
            ]}
          >
            {note || '메모를 추가하려면 탭하세요...'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 12,
  },
  editingContainer: {
    gap: 8,
  },
  textInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  editingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 12,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 12,
  },
  displayBox: {
    minHeight: 72,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  displayText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
