'use client';

import type { TimelineBlock } from '@/types';

interface Props {
  blocks: TimelineBlock[];
  onBlockClick: (sessionId: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function TimelineAxis({ blocks, onBlockClick }: Props) {
  return (
    <div className="relative min-h-[960px] overflow-y-auto rounded-lg border border-border bg-card">
      {HOURS.map((hour) => (
        <div
          key={hour}
          className="absolute left-0 right-0 border-t border-border/60"
          style={{ top: `${(hour / 24) * 100}%` }}
        >
          <span className="absolute -top-2.5 left-2 text-[10px] text-muted-foreground bg-card px-1">
            {String(hour).padStart(2, '0')}:00
          </span>
        </div>
      ))}

      {blocks.map((block, i) => (
        <button
          key={`${block.sessionId}-${i}`}
          onClick={() => onBlockClick(block.sessionId)}
          aria-label={`${block.startLabel} — ${block.endLabel} 세션`}
          className="absolute left-14 right-2 rounded-md bg-primary/80 hover:bg-primary text-primary-foreground text-[11px] px-2 py-0.5 text-left overflow-hidden transition-colors"
          style={{ top: `${block.top}%`, height: `${block.height}%` }}
        >
          {block.startLabel}–{block.endLabel}
        </button>
      ))}
    </div>
  );
}
