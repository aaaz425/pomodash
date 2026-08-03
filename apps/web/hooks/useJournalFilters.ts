'use client';

import { useMemo, useState } from 'react';
import { groupSessionsByDate } from '@/lib/sessionUtils';
import type { Session, Task } from '@/types';

// JournalView의 검색/카테고리/기간 필터 상태와 파생값(필터링된 세션, 날짜별 그룹,
// 세션 있는 날짜 마킹)을 묶어서 관리한다.
export function useJournalFilters(sessions: Session[], tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const hasActiveFilter = !!(searchQuery || selectedCategoryIds.size > 0 || dateFrom || dateTo);

  const filteredSessions = useMemo(() => {
    let result = sessions;

    if (selectedCategoryIds.size > 0) {
      const taskIds = new Set(
        tasks.filter((t) => selectedCategoryIds.has(t.categoryId)).map((t) => t.id),
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
  }, [sessions, tasks, selectedCategoryIds, searchQuery, dateFrom, dateTo]);

  const groups = useMemo(() => groupSessionsByDate(filteredSessions), [filteredSessions]);

  const markedDates = useMemo(
    () => new Set(sessions.map((s) => s.startedAt.slice(0, 10))),
    [sessions],
  );

  function reset() {
    setSearchQuery('');
    setSelectedCategoryIds(new Set());
    setDateFrom('');
    setDateTo('');
  }

  return {
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
    reset,
  };
}
