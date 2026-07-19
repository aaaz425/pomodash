'use client';

import { useState } from 'react';
import { ListView } from '@/components/journal/ListView';
import { TimelineView } from '@/components/journal/TimelineView';
import { CalendarView } from '@/components/journal/CalendarView';
import { InsightsSection } from '@/components/journal/InsightsSection';
import { JournalTabs } from '@/components/journal/JournalTabs';
import { SessionDetailOverlay } from '@/components/journal/SessionDetailOverlay';
import { JournalEmptyState } from '@/components/journal/JournalEmptyState';
import { useTaskStore, useHydrated } from '@/store/StoreProvider';
import type { JournalTab } from '@/types';

export function JournalView() {
  const hydrated = useHydrated();
  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<JournalTab>('list');

  if (!hydrated) return null;

  if (sessions.length === 0) return <JournalEmptyState />;

  const selectedSession = sessions.find((s) => s.id === selectedId) ?? null;
  const selectedTask = selectedSession
    ? (tasks.find((t) => t.id === selectedSession.taskId) ?? null)
    : null;
  const selectedCategory = selectedTask
    ? (categories.find((c) => c.id === selectedTask.categoryId) ?? null)
    : null;

  return (
    <div className="flex flex-col gap-4">
      <InsightsSection sessions={sessions} tasks={tasks} categories={categories} />

      <JournalTabs value={activeTab} onChange={setActiveTab} />

      {activeTab === 'list' && (
        <ListView
          sessions={sessions}
          tasks={tasks}
          categories={categories}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}
      {activeTab === 'timeline' && <TimelineView sessions={sessions} onSelect={setSelectedId} />}
      {activeTab === 'calendar' && (
        <CalendarView
          sessions={sessions}
          tasks={tasks}
          categories={categories}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}

      <SessionDetailOverlay
        session={selectedSession}
        task={selectedTask}
        category={selectedCategory}
        onClose={() => setSelectedId(null)}
        onDeleted={() => setSelectedId(null)}
      />
    </div>
  );
}
