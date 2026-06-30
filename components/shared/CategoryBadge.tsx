import type { Category } from '@/types';
import { type CategoryColorKey, CATEGORY_BADGE_STYLES } from '@/lib/constants/categoryColors';

interface Props {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className = '' }: Props) {
  const colorClass =
    CATEGORY_BADGE_STYLES[category.color as CategoryColorKey] ?? 'bg-muted text-muted-foreground';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colorClass} ${className}`}
    >
      {category.name}
    </span>
  );
}
