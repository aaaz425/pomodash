'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { JournalSearchField } from '@/components/journal/JournalSearchField';
import { JournalCategoryFilter } from '@/components/journal/JournalCategoryFilter';
import { JournalDateRangeFilter } from '@/components/journal/JournalDateRangeFilter';
import type { Category } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  searchQuery: string;
  selectedCategoryIds: Set<string>;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (ids: Set<string>) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onReset: () => void;
  markedDates?: Set<string>;
}

export function JournalFilterModal({
  open,
  onClose,
  categories,
  searchQuery,
  selectedCategoryIds,
  dateFrom,
  dateTo,
  onSearchChange,
  onCategoryChange,
  onDateFromChange,
  onDateToChange,
  onReset,
  markedDates,
}: Props) {
  if (!open) return null;

  const hasActiveFilter = !!(searchQuery || selectedCategoryIds.size > 0 || dateFrom || dateTo);

  return (
    <DialogPrimitive.Root
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogPrimitive.Popup
          aria-label="검색 · 필터"
          className="fixed z-51 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[480px] flex flex-col gap-5 p-6 rounded-xl bg-card border border-border shadow-2xl outline-none"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">검색 · 필터</h2>
            <div className="flex items-center gap-3">
              {hasActiveFilter && (
                <button
                  onClick={onReset}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  초기화
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="닫기"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <JournalSearchField value={searchQuery} onChange={onSearchChange} />

          <JournalCategoryFilter
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onChange={onCategoryChange}
          />

          <JournalDateRangeFilter
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
            markedDates={markedDates}
          />
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
