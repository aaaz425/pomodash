'use client';

import { type CategoryColorKey, CATEGORY_FILTER_STYLES } from '@/lib/constants/categoryColors';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  selectedCategoryIds: Set<string>;
  onChange: (ids: Set<string>) => void;
}

export function JournalCategoryFilter({ categories, selectedCategoryIds, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        카테고리
      </span>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onChange(new Set())}
          className={[
            'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
            selectedCategoryIds.size === 0
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40',
          ].join(' ')}
        >
          전체
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategoryIds.has(cat.id);
          const colorClass =
            CATEGORY_FILTER_STYLES[cat.color as CategoryColorKey] ??
            'bg-muted text-muted-foreground border-border';
          return (
            <button
              key={cat.id}
              onClick={() => {
                const next = new Set(selectedCategoryIds);
                if (next.has(cat.id)) next.delete(cat.id);
                else next.add(cat.id);
                onChange(next);
              }}
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
  );
}
