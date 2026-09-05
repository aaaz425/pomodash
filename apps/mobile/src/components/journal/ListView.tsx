import { forwardRef, useImperativeHandle, type ReactNode } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { formatDuration, groupSessionsByDate } from '@pomodash/shared';
import { useSessionsPage } from '@/hooks/useSessionsPage';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task, Category } from '@/types/tasks';
import type { Session } from '@/types/sessions';
import { SessionListItem } from './SessionListItem';

export interface SessionSyncHandle {
  updateItem: (id: string, patch: Partial<Session>) => void;
  removeItem: (id: string) => void;
}

interface Props {
  header: ReactNode;
  tasks: Task[];
  categories: Category[];
  selectedId: string | null;
  onSelect: (session: Session) => void;
}

type Row =
  | {
      key: string;
      kind: 'header';
      displayLabel: string;
      totalFocusSeconds: number;
      isFirst: boolean;
    }
  | {
      key: string;
      kind: 'session';
      session: Session;
      sessionIndex: number;
      isFirstInGroup: boolean;
    };

function buildRows(groups: ReturnType<typeof groupSessionsByDate<Session>>): Row[] {
  const rows: Row[] = [];
  groups.forEach((group, groupIdx) => {
    rows.push({
      key: `header-${group.dateKey}`,
      kind: 'header',
      displayLabel: group.displayLabel,
      totalFocusSeconds: group.totalFocusSeconds,
      isFirst: groupIdx === 0,
    });
    group.sessions.forEach((session, displayIdx) => {
      rows.push({
        key: session.id,
        kind: 'session',
        session,
        sessionIndex: group.sessions.length - 1 - displayIdx,
        isFirstInGroup: displayIdx === 0,
      });
    });
  });
  return rows;
}

// 저널 리스트 무한스크롤 — FlatList가 이 화면의 유일한 스크롤 컨테이너가 되어야 onEndReached가 동작한다
// (ScrollView 안에 중첩되면 RN이 경고를 내고 페이지네이션 트리거가 안 먹는다)
export const ListView = forwardRef<SessionSyncHandle, Props>(function ListView(
  { header, tasks, categories, selectedId, onSelect },
  ref,
) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const { items, hasMore, loading, loadMore, updateItem, removeItem } = useSessionsPage();
  useImperativeHandle(ref, () => ({ updateItem, removeItem }), [updateItem, removeItem]);

  if (loading && items.length === 0) {
    return (
      <View style={styles.initialLoading}>
        {header}
        <ActivityIndicator color={theme.mutedForeground} />
      </View>
    );
  }

  const rows = buildRows(groupSessionsByDate(items));

  function renderHeaderRow(item: Extract<Row, { kind: 'header' }>) {
    return (
      <View style={[styles.groupHeader, { marginTop: item.isFirst ? 0 : 20 }]}>
        <Text
          style={[styles.groupLabel, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}
        >
          {item.displayLabel}
        </Text>
        <View style={[styles.groupDivider, { backgroundColor: theme.border }]} />
        <Text
          style={[
            styles.groupTotal,
            { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
          ]}
        >
          {formatDuration(item.totalFocusSeconds)}
        </Text>
      </View>
    );
  }

  function renderSessionRow(item: Extract<Row, { kind: 'session' }>) {
    const { session, sessionIndex, isFirstInGroup } = item;
    const task = tasks.find((t) => t.id === session.taskId) ?? null;
    const category = task ? (categories.find((c) => c.id === task.categoryId) ?? null) : null;
    return (
      <View style={{ marginTop: isFirstInGroup ? 8 : 6 }}>
        <SessionListItem
          session={session}
          task={task}
          category={category}
          sessionIndex={sessionIndex}
          isSelected={session.id === selectedId}
          onPress={() => onSelect(session)}
        />
      </View>
    );
  }

  function renderRow({ item }: { item: Row }) {
    return item.kind === 'header' ? renderHeaderRow(item) : renderSessionRow(item);
  }

  const listHeader = (
    <>
      {header}
      <Text style={[styles.count, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}>
        {items.length}개의 기록
      </Text>
    </>
  );

  const listFooter =
    hasMore && loading ? (
      <ActivityIndicator style={styles.footer} color={theme.mutedForeground} />
    ) : null;

  return (
    <FlatList
      data={rows}
      keyExtractor={(row) => row.key}
      contentContainerStyle={styles.content}
      ListHeaderComponent={listHeader}
      renderItem={renderRow}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={listFooter}
    />
  );
});

const styles = StyleSheet.create({
  initialLoading: {
    padding: 16,
    gap: 20,
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  count: {
    fontSize: 12,
    marginTop: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupLabel: {
    fontSize: 12,
  },
  groupDivider: {
    flex: 1,
    height: 1,
  },
  groupTotal: {
    fontSize: 11,
  },
  footer: {
    paddingVertical: 16,
  },
});
