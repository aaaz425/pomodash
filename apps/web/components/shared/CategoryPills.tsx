'use client';

import type { Category } from '@/types';
import { type CategoryColorKey, CATEGORY_PILL_STYLES } from '@/lib/constants/categoryColors';

const FALLBACK_PILL = {
  selected: 'bg-muted border border-primary text-primary',
  dot: 'bg-primary',
  unselected: 'bg-muted border border-transparent text-muted-foreground',
};

interface Props {
  categories: Category[];
  selectedId: string;
  onChange: (id: string) => void;
  /** rich: 색상 점 + 카테고리 색상 배경 (작업 추가 폼용)
   *  simple: primary 단색 accent (빠른 추가 폼용, 기본값) */
  variant?: 'rich' | 'simple';
}

export function CategoryPills({ categories, selectedId, onChange, variant = 'simple' }: Props) {
  if (variant === 'rich') {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const colors = CATEGORY_PILL_STYLES[cat.color as CategoryColorKey] ?? FALLBACK_PILL;
          const isActive = cat.id === selectedId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive ? colors.selected : colors.unselected}`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
              {cat.name}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={[
            'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
            selectedId === cat.id
              ? 'bg-primary/20 border border-primary text-primary'
              : 'bg-muted border border-transparent text-muted-foreground hover:bg-border/50',
          ].join(' ')}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
