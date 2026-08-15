import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import {
  formatFocusPeriodRanges,
  formatFullDate,
  formatTimeRange,
  hasAbnormalFocusGap,
} from '@pomodash/shared';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { SessionTitleInput } from '@/components/journal/SessionTitleInput';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Session } from '@/types/sessions';
import type { Category } from '@/types/tasks';

interface Props {
  session: Session;
  category: Category | null;
  displayTitle: string;
  hasRealTitle: boolean;
  taskTitles: string[];
  isEditing: boolean;
  isSubmitting: boolean;
  draftTitle: string;
  onDraftTitleChange: (value: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export function SessionDetailHeader({
  session,
  category,
  displayTitle,
  hasRealTitle,
  taskTitles,
  isEditing,
  isSubmitting,
  draftTitle,
  onDraftTitleChange,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        {category && <CategoryBadge category={category} style={styles.categoryBadge} />}
        <View style={styles.editControls}>
          {isEditing ? (
            <>
              <Pressable
                onPress={onCancelEdit}
                disabled={isSubmitting}
                hitSlop={4}
                style={[isSubmitting && styles.disabled]}
              >
                <Text
                  style={[
                    styles.editText,
                    { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                  ]}
                >
                  취소
                </Text>
              </Pressable>
              <Pressable
                onPress={onSaveEdit}
                disabled={isSubmitting}
                style={[
                  styles.saveButton,
                  { backgroundColor: theme.primary },
                  isSubmitting && styles.disabled,
                ]}
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
            </>
          ) : (
            <>
              <Pressable onPress={onEdit} hitSlop={4} accessibilityLabel="편집">
                <Pencil size={14} color={theme.mutedForeground} />
              </Pressable>
              <Pressable onPress={onDelete} hitSlop={4} accessibilityLabel="기록 삭제">
                <Trash2 size={14} color={theme.mutedForeground} />
              </Pressable>
            </>
          )}
        </View>
      </View>

      {isEditing ? (
        <SessionTitleInput
          value={draftTitle}
          onChange={onDraftTitleChange}
          taskTitles={taskTitles}
        />
      ) : (
        <Text
          style={[
            styles.title,
            {
              color: hasRealTitle ? theme.foreground : theme.mutedForeground,
              fontFamily: FONTS.sansBold,
            },
          ]}
        >
          {displayTitle}
        </Text>
      )}

      <View style={styles.metaRow}>
        <Text
          style={[styles.meta, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          {formatFullDate(session.startedAt)}
        </Text>
        <Text style={[styles.metaDot, { color: theme.mutedForeground }]}>·</Text>
        <Text
          style={[styles.meta, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          {hasAbnormalFocusGap(session.focusPeriods)
            ? formatFocusPeriodRanges(session.focusPeriods)
            : formatTimeRange(session.startedAt, session.endedAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  disabled: {
    opacity: 0.4,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  editControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editText: {
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
  title: {
    fontSize: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  meta: {
    fontSize: 13,
  },
  metaDot: {
    fontSize: 13,
  },
});
