'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  month: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function CalendarMonthNav({ month, onPrev, onNext }: Props) {
  const label = month.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onPrev}
        aria-label="이전 달"
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-semibold text-foreground min-w-[110px] text-center">
        {label}
      </span>
      <button
        onClick={onNext}
        aria-label="다음 달"
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
