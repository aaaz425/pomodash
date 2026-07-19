'use client';

import type { FocusRating } from '@/types';

const OPTIONS: Array<{ value: FocusRating; label: string }> = [
  { value: 1, label: '흐트러짐' },
  { value: 2, label: '보통' },
  { value: 3, label: '몰입' },
];

interface Props {
  value: FocusRating | null;
  onChange: (value: FocusRating | null) => void;
}

export function FocusRatingPicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      {OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(isSelected ? null : option.value)}
            className={[
              'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-border/50',
            ].join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
