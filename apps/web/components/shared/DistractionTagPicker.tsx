'use client';

import { DISTRACTION_TAGS } from '@/lib/constants';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

export function DistractionTagPicker({ value, onChange }: Props) {
  function toggle(tagId: string) {
    onChange(value.includes(tagId) ? value.filter((id) => id !== tagId) : [...value, tagId]);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {DISTRACTION_TAGS.map((tag) => {
        const isSelected = value.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={[
              'px-2.5 py-1 rounded-full text-xs font-medium transition-colors border',
              isSelected
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border text-muted-foreground hover:bg-border/50',
            ].join(' ')}
          >
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
