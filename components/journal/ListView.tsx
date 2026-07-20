'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { JournalSessionList } from '@/components/journal/JournalSessionList';
import { JournalFilterModal } from '@/components/journal/JournalFilterModal';
import { useJournalFilters } from '@/hooks/useJournalFilters';
import type { Category, Session, Task } from '@/types';

interface Props {
  sessions: Session[];
  tasks: Task[];
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ListView({ sessions, tasks, categories, selectedId, onSelect }: Props) {
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{filteredSessions.length}개의 세션</span>
        {filterButton}
      </div>
      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-muted-foreground">검색 결과가 없어요</p>
          <button onClick={resetFilters} className="text-sm text-primary hover:underline">
            필터 초기화
          </button>
        </div>
      ) : (
        <JournalSessionList
          groups={groups}
          tasks={tasks}
          categories={categories}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )}

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
