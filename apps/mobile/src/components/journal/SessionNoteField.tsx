import { StyleSheet, Text, View } from 'react-native';
import { INPUT_LIMITS } from '@pomodash/shared';
import { TextInput } from '@/components/shared/TextInput';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  note: string | null;
  isEditing: boolean;
  draftNote: string;
  onDraftNoteChange: (value: string) => void;
}

export function SessionNoteField({ note, isEditing, draftNote, onDraftNoteChange }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.field}>
      <Text
        style={[
          styles.sectionLabel,
          { color: theme.mutedForeground, fontFamily: FONTS.sansSemiBold },
        ]}
      >
        메모
      </Text>
      {isEditing ? (
        <View style={styles.noteEditing}>
          <TextInput
            multiline
            numberOfLines={4}
            maxLength={INPUT_LIMITS.NOTE_MAX_LENGTH}
            value={draftNote}
            onChangeText={onDraftNoteChange}
            placeholder="세션에 대한 메모를 남겨보세요..."
            style={styles.noteInput}
          />
          <Text
            style={[
              styles.counter,
              { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
            ]}
          >
            {draftNote.length} / {INPUT_LIMITS.NOTE_MAX_LENGTH}
          </Text>
        </View>
      ) : (
        <View style={[styles.noteDisplay, { backgroundColor: withAlpha(theme.muted, 0.4) }]}>
          <Text
            style={[
              styles.noteText,
              {
                color: note ? theme.foreground : theme.mutedForeground,
                fontFamily: FONTS.sansRegular,
              },
            ]}
          >
            {note || '메모가 없어요'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  noteEditing: {
    gap: 8,
  },
  noteInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 11,
    textAlign: 'right',
  },
  noteDisplay: {
    minHeight: 72,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
