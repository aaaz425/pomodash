'use client';

import { useState, useMemo } from 'react';
import { JournalSessionList } from '@/components/journal/JournalSessionList';
import { JournalDetailPanel } from '@/components/journal/JournalDetailPanel';
import { JournalEmptyState } from '@/components/journal/JournalEmptyState';
import { groupSessionsByDate } from '@/lib/sessionUtils';
import { useTaskStore, useHydrated } from '@/store/StoreProvider';

export function JournalView() {
  const hydrated = useHydrated();
  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const groups = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  if (!hydrated) return null;

  if (groups.length === 0) return <JournalEmptyState />;

  // 삭제 등으로 세션이 사라지면 자연스럽게 null로 처리
  const selectedSession = sessions.find((s) => s.id === selectedId) ?? null;
  const selectedTask = selectedSession
    ? (tasks.find((t) => t.id === selectedSession.taskId) ?? null)
    : null;
  const selectedCategory = selectedTask
    ? (categories.find((c) => c.id === selectedTask.categoryId) ?? null)
    : null;

  const list = (
    <JournalSessionList
      groups={groups}
      tasks={tasks}
      categories={categories}
      selectedId={selectedId}
      onSelect={setSelectedId}
    />
  );

  const detail = selectedSession ? (
    <JournalDetailPanel
      key={selectedSession.id}
      session={selectedSession}
      task={selectedTask}
      category={selectedCategory}
      onBack={() => setSelectedId(null)}
      onDeleted={() => setSelectedId(null)}
    />
  ) : null;

  return (
    <>
      {/* 데스크탑: split layout */}
      <div className="hidden lg:flex gap-6 items-start">
        <div className="w-[400px] shrink-0">{list}</div>
        <div className="flex-1 sticky top-6">
          {detail ?? (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              세션을 선택하면 상세 내용을 볼 수 있어요
            </div>
          )}
        </div>
      </div>

      {/* 모바일/태블릿: 리스트 ↔ 디테일 전환 */}
      <div className="lg:hidden">
        {selectedSession ? (
          <JournalDetailPanel
            key={selectedSession.id}
            session={selectedSession}
            task={selectedTask}
            category={selectedCategory}
            onBack={() => setSelectedId(null)}
            onDeleted={() => setSelectedId(null)}
          />
        ) : (
          list
        )}
      </div>
    </>
  );
}
