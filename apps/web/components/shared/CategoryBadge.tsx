import type { Category } from '@/types';
import { withAlpha } from '@/lib/constants/categoryColors';

interface Props {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center max-w-[110px] px-2 py-0.5 rounded-md text-xs font-medium ${className}`}
      style={{ backgroundColor: withAlpha(category.color, 0.15), color: category.color }}
    >
      <span className="min-w-0 truncate">{category.name}</span>
    </span>
  );
}
