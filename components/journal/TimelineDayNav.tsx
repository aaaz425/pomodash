'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function TimelineDayNav({ date, onPrev, onNext, onToday }: Props) {
  const label = date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          aria-label="이전 날짜"
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-foreground min-w-[110px] text-center">
          {label}
        </span>
        <button
          onClick={onNext}
          aria-label="다음 날짜"
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={onToday}
        className="px-2.5 py-1 rounded-md text-xs text-muted-foreground border border-border hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        오늘
      </button>
    </div>
  );
}
