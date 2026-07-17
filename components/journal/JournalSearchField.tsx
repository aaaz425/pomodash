'use client';

import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function JournalSearchField({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="journal-search-input"
        className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
      >
        작업명 검색
      </label>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
        <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
        <input
          id="journal-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="작업명 검색..."
          className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
