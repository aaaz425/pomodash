'use client';

import { useState } from 'react';

export function useJournalFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const hasActiveFilter = !!(searchQuery || selectedCategoryIds.size > 0 || dateFrom || dateTo);

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
    reset,
  };
}
