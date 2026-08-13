'use client';

import { FOCUS_RATING_OPTIONS } from '@/lib/constants';
import type { FocusRating } from '@/types';

interface Props {
  value: FocusRating | null;
  onChange: (value: FocusRating | null) => void;
  disabled?: boolean;
}

export function FocusRatingPicker({ value, onChange, disabled = false }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      {FOCUS_RATING_OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(isSelected ? null : option.value)}
            className={[
              'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-border/50',
              disabled ? 'opacity-60 cursor-not-allowed hover:bg-muted' : '',
            ].join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
