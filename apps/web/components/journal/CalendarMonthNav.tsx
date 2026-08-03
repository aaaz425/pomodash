'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Props {
  month: Date;
  onPrevYear: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onNextYear: () => void;
  onToday: () => void;
}

const navButtonClass =
  'p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors';

export function CalendarMonthNav({
  month,
  onPrevYear,
  onPrevMonth,
  onNextMonth,
  onNextYear,
  onToday,
}: Props) {
  const label = month.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  return (
    <div className="flex items-center justify-center gap-1">
      <button onClick={onPrevYear} aria-label="이전 해" className={navButtonClass}>
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button onClick={onPrevMonth} aria-label="이전 달" className={navButtonClass}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-semibold text-foreground min-w-[110px] text-center">
        {label}
      </span>
      <button onClick={onNextMonth} aria-label="다음 달" className={navButtonClass}>
        <ChevronRight className="w-4 h-4" />
      </button>
      <button onClick={onNextYear} aria-label="다음 해" className={navButtonClass}>
        <ChevronsRight className="w-4 h-4" />
      </button>
      <button
        onClick={onToday}
        className="ml-2 px-2.5 py-1 rounded-md text-xs text-muted-foreground border border-border hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        오늘
      </button>
    </div>
  );
}
