import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore, useHydrated } from '@/store/StoreProvider';
import { JournalTabs, type JournalTab } from '@/components/journal/JournalTabs';
import { ListView } from '@/components/journal/ListView';
import { CalendarView } from '@/components/journal/CalendarView';
import { JournalEmptyState } from '@/components/journal/JournalEmptyState';
import { JournalSkeleton } from '@/components/journal/JournalSkeleton';
import { SessionDetailPanel } from '@/components/journal/SessionDetailPanel';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export default function JournalScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const hydrated = useHydrated();

  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<JournalTab>('list');

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {!hydrated ? (
          <JournalSkeleton />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View>
                <Text
                  style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansBold }]}
                >
                  기록
                </Text>
              </View>
              {sessions.length > 0 && <JournalTabs value={activeTab} onChange={setActiveTab} />}
            </View>

            {sessions.length === 0 ? (
              <JournalEmptyState />
            ) : activeTab === 'list' ? (
              <ListView
                sessions={sessions}
                tasks={tasks}
                categories={categories}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ) : (
              <CalendarView
                sessions={sessions}
                tasks={tasks}
                categories={categories}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </ScrollView>
        )}
      </SafeAreaView>

      <SessionDetailPanel sessionId={selectedId} onClose={() => setSelectedId(null)} />
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
