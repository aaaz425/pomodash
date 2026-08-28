'use client';

import { useRef, useState } from 'react';
import { ListView, type SessionSyncHandle } from '@/components/journal/ListView';
import { CalendarView } from '@/components/journal/CalendarView';
import { InsightsSection } from '@/components/journal/InsightsSection';
import { JournalTabs } from '@/components/journal/JournalTabs';
import { SessionDetailOverlay } from '@/components/journal/SessionDetailOverlay';
import { JournalEmptyState } from '@/components/journal/JournalEmptyState';
import { JournalSkeleton } from '@/components/journal/JournalSkeleton';
import { useTaskStore } from '@/store/StoreProvider';
import { useDelayedHydration } from '@/hooks/useDelayedHydration';
import { useSessionsHydrated } from '@/hooks/useSessionsHydrated';
import type { JournalTab, Session } from '@/types';

export function JournalView() {
  const { hydrated, showSkeleton } = useDelayedHydration();
  const { sessionsHydrated } = useSessionsHydrated();
  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<JournalTab>('list');
  const listViewRef = useRef<SessionSyncHandle>(null);
  const calendarViewRef = useRef<SessionSyncHandle>(null);

  if (!hydrated) return showSkeleton ? <JournalSkeleton /> : null;

  const selectedTask = selectedSession
    ? (tasks.find((t) => t.id === selectedSession.taskId) ?? null)
    : null;
  const selectedCategory = selectedTask
    ? (categories.find((c) => c.id === selectedTask.categoryId) ?? null)
    : null;

  const activeSyncHandle = activeTab === 'list' ? listViewRef.current : calendarViewRef.current;

  function handleUpdated(patch: Partial<Session>) {
    if (!selectedSession) return;
    setSelectedSession({ ...selectedSession, ...patch });
    activeSyncHandle?.updateItem(selectedSession.id, patch);
  }

  function handleDeleted() {
    if (selectedSession) activeSyncHandle?.removeItem(selectedSession.id);
    setSelectedSession(null);
  }

  if (sessionsHydrated && sessions.length === 0) return <JournalEmptyState />;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">기록</h1>
        </div>
        <JournalTabs value={activeTab} onChange={setActiveTab} />
      </header>

      <InsightsSection sessions={sessions} tasks={tasks} categories={categories} />

      {activeTab === 'list' && (
        <ListView
          ref={listViewRef}
          tasks={tasks}
          categories={categories}
          selectedId={selectedSession?.id ?? null}
          onSelect={setSelectedSession}
        />
      )}
      {activeTab === 'calendar' && (
        <CalendarView
          ref={calendarViewRef}
          tasks={tasks}
          categories={categories}
          selectedId={selectedSession?.id ?? null}
          onSelect={setSelectedSession}
        />
      )}

      <SessionDetailOverlay
        session={selectedSession}
        task={selectedTask}
        category={selectedCategory}
        onClose={() => setSelectedSession(null)}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
