'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { JournalSessionList } from '@/components/journal/JournalSessionList';
import { JournalDetailPanel } from '@/components/journal/JournalDetailPanel';
import { JournalEmptyState } from '@/components/journal/JournalEmptyState';
import { JournalFilterModal } from '@/components/journal/JournalFilterModal';
import { groupSessionsByDate } from '@/lib/sessionUtils';
import { useTaskStore, useHydrated } from '@/store/StoreProvider';

export function JournalView() {
  const hydrated = useHydrated();
  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const hasActiveFilter = !!(searchQuery || selectedCategoryId || dateFrom || dateTo);

  const filteredSessions = useMemo(() => {
    let result = sessions;

    if (selectedCategoryId) {
      const taskIds = new Set(
        tasks.filter((t) => t.categoryId === selectedCategoryId).map((t) => t.id),
      );
      result = result.filter((s) => s.taskId && taskIds.has(s.taskId));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) =>
        tasks
          .find((t) => t.id === s.taskId)
          ?.title.toLowerCase()
          .includes(q),
      );
    }

    if (dateFrom) result = result.filter((s) => s.startedAt.slice(0, 10) >= dateFrom);
    if (dateTo) result = result.filter((s) => s.startedAt.slice(0, 10) <= dateTo);

    return result;
  }, [sessions, tasks, selectedCategoryId, searchQuery, dateFrom, dateTo]);

  const groups = useMemo(() => groupSessionsByDate(filteredSessions), [filteredSessions]);

  const markedDates = useMemo(
    () => new Set(sessions.map((s) => s.startedAt.slice(0, 10))),
    [sessions],
  );

  if (!hydrated) return null;

  if (sessions.length === 0) return <JournalEmptyState />;

  const selectedSession = filteredSessions.find((s) => s.id === selectedId) ?? null;
  const selectedTask = selectedSession
    ? (tasks.find((t) => t.id === selectedSession.taskId) ?? null)
    : null;
  const selectedCategory = selectedTask
    ? (categories.find((c) => c.id === selectedTask.categoryId) ?? null)
    : null;

  const filterButton = (
    <button
      onClick={() => setFilterOpen(true)}
      aria-label="검색 · 필터"
      className={[
        'relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-sm transition-colors',
        hasActiveFilter
          ? 'border-primary text-primary bg-primary/10'
          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30',
      ].join(' ')}
    >
      <SlidersHorizontal className="w-3.5 h-3.5" />
      <span>검색</span>
      {hasActiveFilter && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
      )}
    </button>
  );

  const emptyFiltered = (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <p className="text-sm text-muted-foreground">검색 결과가 없어요</p>
      <button
        onClick={() => {
          setSearchQuery('');
          setSelectedCategoryId(null);
          setDateFrom('');
          setDateTo('');
        }}
        className="text-sm text-primary hover:underline"
      >
        필터 초기화
      </button>
    </div>
  );

  const listPanel = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{filteredSessions.length}개의 세션</span>
        {filterButton}
      </div>
      {groups.length === 0 ? (
        emptyFiltered
      ) : (
        <JournalSessionList
          groups={groups}
          tasks={tasks}
          categories={categories}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}
    </div>
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
        <div className="w-[400px] shrink-0">{listPanel}</div>
        <div className="flex-1 sticky top-6 h-[calc(100vh-3rem)]">
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
          listPanel
        )}
      </div>

      <JournalFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        searchQuery={searchQuery}
        selectedCategoryId={selectedCategoryId}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategoryId}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onReset={() => {
          setSearchQuery('');
          setSelectedCategoryId(null);
          setDateFrom('');
          setDateTo('');
        }}
        markedDates={markedDates}
      />
    </>
  );
}
