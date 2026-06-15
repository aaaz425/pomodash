import type { Category } from '@/types'

const COLOR_MAP: Record<string, string> = {
  'bg-blue-500':   'bg-blue-500/15 text-blue-400',
  'bg-green-500':  'bg-green-500/15 text-green-400',
  'bg-orange-500': 'bg-orange-500/15 text-orange-400',
  'bg-purple-500': 'bg-purple-500/15 text-purple-400',
  'bg-gray-500':   'bg-gray-500/15 text-gray-400',
  'bg-red-500':    'bg-red-500/15 text-red-400',
  'bg-pink-500':   'bg-pink-500/15 text-pink-400',
  'bg-yellow-500': 'bg-yellow-500/15 text-yellow-400',
}

interface Props {
  category: Category
  className?: string
}

export function CategoryBadge({ category, className = '' }: Props) {
  const colorClass = COLOR_MAP[category.color] ?? 'bg-muted text-muted-foreground'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colorClass} ${className}`}>
      {category.name}
    </span>
  )
}
