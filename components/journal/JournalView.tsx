'use client';

import { useState } from 'react';
import { ListView } from '@/components/journal/ListView';
import { SessionDetailOverlay } from '@/components/journal/SessionDetailOverlay';
import { JournalEmptyState } from '@/components/journal/JournalEmptyState';
import { useTaskStore, useHydrated } from '@/store/StoreProvider';

export function JournalView() {
  const hydrated = useHydrated();
  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    <div className="flex flex-col">
      <ListView
        sessions={sessions}
        tasks={tasks}
        categories={categories}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

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
