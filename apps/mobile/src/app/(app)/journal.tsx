import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore, useHydrated } from '@/store/StoreProvider';
import { JournalTabs, type JournalTab } from '@/components/journal/JournalTabs';
import { ListView, type SessionSyncHandle } from '@/components/journal/ListView';
import { CalendarView } from '@/components/journal/CalendarView';
import { JournalEmptyState } from '@/components/journal/JournalEmptyState';
import { JournalSkeleton } from '@/components/journal/JournalSkeleton';
import { SessionDetailPanel } from '@/components/journal/SessionDetailPanel';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Session } from '@/types/sessions';

export default function JournalScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const hydrated = useHydrated();

  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<JournalTab>('list');

  // 리스트/캘린더 각자 페이지네이션·월별로 세션을 따로 들고 있어, 상세 패널에서 수정/삭제하면
  // 활성 탭 쪽 로컬 상태에 직접 반영해줘야 한다(전역 store만 바꿔선 화면에 안 보임)
  const listViewRef = useRef<SessionSyncHandle>(null);
  const calendarViewRef = useRef<SessionSyncHandle>(null);
  const activeSyncHandle = activeTab === 'list' ? listViewRef.current : calendarViewRef.current;

  const header = (
    <View style={styles.header}>
      <View>
        <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansBold }]}>
          기록
        </Text>
      </View>
      <JournalTabs value={activeTab} onChange={setActiveTab} />
    </View>
  );

  function handleSessionUpdated(patch: Partial<Session>) {
    if (!selectedSession) return;
    setSelectedSession({ ...selectedSession, ...patch });
    activeSyncHandle?.updateItem(selectedSession.id, patch);
  }

  function handleSessionDeleted() {
    if (selectedSession) activeSyncHandle?.removeItem(selectedSession.id);
    setSelectedSession(null);
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {!hydrated ? (
          <JournalSkeleton />
        ) : sessions.length === 0 ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {header}
            <JournalEmptyState />
          </ScrollView>
        ) : activeTab === 'list' ? (
          <ListView
            ref={listViewRef}
            header={header}
            tasks={tasks}
            categories={categories}
            selectedId={selectedSession?.id ?? null}
            onSelect={setSelectedSession}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {header}
            <CalendarView
              ref={calendarViewRef}
              tasks={tasks}
              categories={categories}
              selectedId={selectedSession?.id ?? null}
              onSelect={setSelectedSession}
            />
          </ScrollView>
        )}
      </SafeAreaView>

      <SessionDetailPanel
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onUpdated={handleSessionUpdated}
        onDeleted={handleSessionDeleted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 20,
  },
});
