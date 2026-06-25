'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { JournalSessionList } from '@/components/journal/JournalSessionList';
import { JournalDetailPanel } from '@/components/journal/JournalDetailPanel';
import { JournalEmptyState } from '@/components/journal/JournalEmptyState';
import { JournalFilterModal } from '@/components/journal/JournalFilterModal';
import { useJournalFilters } from '@/hooks/useJournalFilters';
import { useTaskStore, useHydrated } from '@/store/StoreProvider';

export function JournalView() {
  const hydrated = useHydrated();
  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategoryIds,
    setSelectedCategoryIds,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    hasActiveFilter,
    filteredSessions,
    groups,
    markedDates,
    reset: resetFilters,
  } = useJournalFilters(sessions, tasks);

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
      <button onClick={resetFilters} className="text-sm text-primary hover:underline">
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
    <div className="lg:flex lg:flex-col lg:flex-1 lg:min-h-0">
      {/* 데스크탑: split layout */}
      <div className="hidden lg:flex flex-1 min-h-0 gap-6">
        <div className="w-[400px] shrink-0 h-full overflow-y-auto">{listPanel}</div>
        <div className="flex-1 h-full">
          {detail ?? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
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
        selectedCategoryIds={selectedCategoryIds}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategoryIds}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onReset={resetFilters}
        markedDates={markedDates}
      />
    </div>
  );
}
