'use client';

import { useMemo, useState } from 'react';
import { TimelineDayNav } from '@/components/journal/TimelineDayNav';
import { TimelineAxis } from '@/components/journal/TimelineAxis';
import { getDayTimelineBlocks } from '@/lib/timelineLayout';
import type { Session } from '@/types';

interface Props {
  sessions: Session[];
  onSelect: (id: string) => void;
}

function addDays(date: Date, delta: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  return next;
}

export function TimelineView({ sessions, onSelect }: Props) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const blocks = useMemo(
    () => getDayTimelineBlocks(sessions, selectedDate),
    [sessions, selectedDate],
  );

  return (
    <div className="flex flex-col gap-4">
      <TimelineDayNav
        date={selectedDate}
        onPrev={() => setSelectedDate((d) => addDays(d, -1))}
        onNext={() => setSelectedDate((d) => addDays(d, 1))}
        onToday={() => setSelectedDate(new Date())}
      />
      {blocks.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          이 날은 기록이 없어요
        </div>
      ) : (
        <TimelineAxis blocks={blocks} onBlockClick={onSelect} />
      )}
    </div>
  );
}
