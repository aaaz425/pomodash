import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import {
  BADGE_CATEGORY_LABELS,
  BADGE_DEFINITIONS,
  getEarnedBadgeIds,
  type BadgeCategory,
} from '@pomodash/shared';
import { BadgeMedal } from './BadgeMedal';
import { EmptyState } from '@/components/shared/EmptyState';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task } from '@/types/tasks';
import type { Session } from '@/types/sessions';

interface Props {
  sessions: Session[];
  tasks: Task[];
}

const CATEGORY_ORDER: BadgeCategory[] = ['streak', 'total-time', 'diversity', 'special'];

export function BadgeGallery({ sessions, tasks }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const [expanded, setExpanded] = useState(false);

  const earnedIds = useMemo(() => getEarnedBadgeIds(sessions, tasks), [sessions, tasks]);
  const earnedCount = earnedIds.size;
  const earnedBadges = useMemo(
    () => BADGE_DEFINITIONS.filter((b) => earnedIds.has(b.id)),
    [earnedIds],
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
          뱃지 컬렉션
        </Text>
        <Text
          style={[styles.count, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
        >
          {earnedCount}/{BADGE_DEFINITIONS.length} 획득
        </Text>
      </View>

      {expanded ? (
        <View style={styles.groups}>
          {CATEGORY_ORDER.map((category) => (
            <View key={category} style={styles.group}>
              <Text
                style={[
                  styles.groupLabel,
                  { color: theme.mutedForeground, fontFamily: FONTS.sansMedium },
                ]}
              >
                {BADGE_CATEGORY_LABELS[category]}
              </Text>
              <View style={styles.badgeRow}>
                {BADGE_DEFINITIONS.filter((b) => b.category === category).map((badge) => (
                  <BadgeMedal key={badge.id} badge={badge} earned={earnedIds.has(badge.id)} />
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : earnedBadges.length > 0 ? (
        <View style={styles.badgeRow}>
          {earnedBadges.map((badge) => (
            <BadgeMedal key={badge.id} badge={badge} earned />
          ))}
        </View>
      ) : (
        <EmptyState message="아직 획득한 뱃지가 없어요" />
      )}

      <Pressable style={styles.toggle} onPress={() => setExpanded((v) => !v)} hitSlop={8}>
        <Text
          style={[
            styles.toggleText,
            { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
          ]}
        >
          {expanded ? '접기' : '뱃지 모두 보기'}
        </Text>
        {expanded ? (
          <ChevronUp size={14} color={theme.mutedForeground} />
        ) : (
          <ChevronDown size={14} color={theme.mutedForeground} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
  },
  count: {
    fontSize: 11,
  },
  groups: {
    gap: 16,
  },
  group: {
    gap: 10,
  },
  groupLabel: {
    fontSize: 11,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    alignSelf: 'center',
  },
  toggleText: {
    fontSize: 11,
  },
});
