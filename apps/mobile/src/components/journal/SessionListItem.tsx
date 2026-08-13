import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  FOCUS_RATING_LABELS,
  formatDuration,
  formatSessionTimeSummary,
  getSessionOrdinalTitle,
} from '@pomodash/shared';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';

interface Props {
  session: Session;
  task: Task | null;
  category: Category | null;
  sessionIndex: number;
  isSelected?: boolean;
  onPress: () => void;
}

export function SessionListItem({
  session,
  task,
  category,
  sessionIndex,
  isSelected = false,
  onPress,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const displayTitle =
    session.title ?? task?.title ?? getSessionOrdinalTitle(session.startedAt, sessionIndex);
  const hasRealTitle = session.title !== null || task !== null;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        isSelected
          ? { backgroundColor: withAlpha(theme.primary, 0.1), borderColor: theme.primary }
          : { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.row}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: hasRealTitle ? theme.foreground : theme.mutedForeground,
              fontFamily: FONTS.sansMedium,
              flex: 1,
            },
          ]}
        >
          {displayTitle}
        </Text>
        <Text
          style={[styles.meta, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          {formatSessionTimeSummary(session.startedAt, session.endedAt, session.focusPeriods)}
        </Text>
      </View>

      <View style={styles.row}>
        {category ? (
          <CategoryBadge category={category} />
        ) : (
          <View style={[styles.plainBadge, { backgroundColor: theme.muted }]}>
            <Text
              style={[
                styles.plainBadgeText,
                { color: theme.mutedForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              기타
            </Text>
          </View>
        )}

        {session.focusRating && (
          <View style={[styles.plainBadge, { backgroundColor: withAlpha(theme.primary, 0.15) }]}>
            <Text
              style={[
                styles.plainBadgeText,
                { color: theme.primary, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              {FOCUS_RATING_LABELS[session.focusRating]}
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.meta,
            { color: theme.mutedForeground, fontFamily: FONTS.sansRegular, marginLeft: 'auto' },
          ]}
        >
          {formatDuration(session.focusSeconds)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
  },
  meta: {
    fontSize: 11,
  },
  plainBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  plainBadgeText: {
    fontSize: 12,
  },
});
