'use client';

import type { CategoryColorKey } from '@/lib/categoryColors';
import type { Category } from '@/types';

const PILL_COLORS: Record<CategoryColorKey, { selected: string; dot: string; unselected: string }> =
  {
    'bg-blue-500': {
      selected: 'bg-blue-500/20 border border-blue-500 text-blue-500',
      dot: 'bg-blue-500',
      unselected: 'bg-muted border border-transparent text-muted-foreground',
    },
    'bg-green-500': {
      selected: 'bg-green-500/20 border border-green-500 text-green-500',
      dot: 'bg-green-500',
      unselected: 'bg-muted border border-transparent text-muted-foreground',
    },
    'bg-orange-500': {
      selected: 'bg-orange-500/20 border border-orange-500 text-orange-500',
      dot: 'bg-orange-500',
      unselected: 'bg-muted border border-transparent text-muted-foreground',
    },
    'bg-purple-500': {
      selected: 'bg-purple-500/20 border border-purple-500 text-purple-500',
      dot: 'bg-purple-500',
      unselected: 'bg-muted border border-transparent text-muted-foreground',
    },
    'bg-gray-500': {
      selected: 'bg-gray-500/20 border border-gray-500 text-gray-400',
      dot: 'bg-gray-500',
      unselected: 'bg-muted border border-transparent text-muted-foreground',
    },
    'bg-red-500': {
      selected: 'bg-red-500/20 border border-red-500 text-red-500',
      dot: 'bg-red-500',
      unselected: 'bg-muted border border-transparent text-muted-foreground',
    },
    'bg-pink-500': {
      selected: 'bg-pink-500/20 border border-pink-500 text-pink-500',
      dot: 'bg-pink-500',
      unselected: 'bg-muted border border-transparent text-muted-foreground',
    },
    'bg-yellow-500': {
      selected: 'bg-yellow-500/20 border border-yellow-500 text-yellow-500',
      dot: 'bg-yellow-500',
      unselected: 'bg-muted border border-transparent text-muted-foreground',
    },
  };

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
          const colors = PILL_COLORS[cat.color as CategoryColorKey] ?? FALLBACK_PILL;
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
