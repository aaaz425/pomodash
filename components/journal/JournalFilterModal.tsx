'use client';

import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { DatePickerInput } from '@/components/shared/DatePickerInput';
import type { Category } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  searchQuery: string;
  selectedCategoryId: string | null;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (id: string | null) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onReset: () => void;
}

type DatePreset = 'today' | 'week' | 'month';

function getDateRange(preset: DatePreset): { from: string; to: string } {
  const today = new Date();
  const toKey = today.toISOString().slice(0, 10);
  if (preset === 'today') return { from: toKey, to: toKey };
  if (preset === 'week') {
    const mon = new Date(today);
    mon.setDate(today.getDate() - (today.getDay() || 7) + 1);
    return { from: mon.toISOString().slice(0, 10), to: toKey };
  }
  return { from: `${toKey.slice(0, 7)}-01`, to: toKey };
}

const CATEGORY_COLOR_MAP: Record<string, string> = {
  'bg-blue-500': 'bg-blue-500/15 text-blue-400 border-blue-400/40',
  'bg-green-500': 'bg-green-500/15 text-green-400 border-green-400/40',
  'bg-orange-500': 'bg-orange-500/15 text-orange-400 border-orange-400/40',
  'bg-purple-500': 'bg-purple-500/15 text-purple-400 border-purple-400/40',
  'bg-gray-500': 'bg-gray-500/15 text-gray-400 border-gray-400/40',
  'bg-red-500': 'bg-red-500/15 text-red-400 border-red-400/40',
  'bg-pink-500': 'bg-pink-500/15 text-pink-400 border-pink-400/40',
  'bg-yellow-500': 'bg-yellow-500/15 text-yellow-400 border-yellow-400/40',
};

export function JournalFilterModal({
  open,
  onClose,
  categories,
  searchQuery,
  selectedCategoryId,
  dateFrom,
  dateTo,
  onSearchChange,
  onCategoryChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: Props) {
  const searchRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const today = new Date().toISOString().slice(0, 10);
  const hasActiveFilter = !!(searchQuery || selectedCategoryId || dateFrom || dateTo);

  const PRESETS: { label: string; preset: DatePreset }[] = [
    { label: '오늘', preset: 'today' },
    { label: '이번 주', preset: 'week' },
    { label: '이번 달', preset: 'month' },
  ];

  function isPresetActive(preset: DatePreset) {
    const { from, to } = getDateRange(preset);
    return dateFrom === from && dateTo === to;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="검색 · 필터"
        className="fixed z-51 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[480px] flex flex-col gap-5 p-6 rounded-xl bg-card border border-border shadow-2xl"
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

        {/* 검색 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            작업명 검색
          </label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
            <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="작업명 검색..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 카테고리 */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            카테고리
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onCategoryChange(null)}
              className={[
                'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                selectedCategoryId === null
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40',
              ].join(' ')}
            >
              전체
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              const colorClass =
                CATEGORY_COLOR_MAP[cat.color] ?? 'bg-muted text-muted-foreground border-border';
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(isSelected ? null : cat.id)}
                  className={[
                    'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                    isSelected
                      ? colorClass
                      : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40',
                  ].join(' ')}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 기간 */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            기간
          </span>
          <div className="flex gap-1.5">
            {PRESETS.map(({ label, preset }) => (
              <button
                key={preset}
                onClick={() => {
                  const { from, to } = getDateRange(preset);
                  onDateFromChange(from);
                  onDateToChange(to);
                }}
                className={[
                  'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  isPresetActive(preset)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <DatePickerInput
                value={dateFrom}
                onChange={onDateFromChange}
                max={dateTo && dateTo < today ? dateTo : today}
                placeholder="시작일"
              />
            </div>
            <span className="text-muted-foreground text-sm shrink-0">-</span>
            <div className="flex-1">
              <DatePickerInput
                value={dateTo}
                onChange={onDateToChange}
                min={dateFrom || undefined}
                max={today}
                placeholder="종료일"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
