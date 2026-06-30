export const CATEGORY_COLOR_KEYS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-gray-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-teal-500',
  'bg-indigo-500',
] as const;

export type CategoryColorKey = (typeof CATEGORY_COLOR_KEYS)[number];

export const CATEGORY_BADGE_STYLES: Record<CategoryColorKey, string> = {
  'bg-blue-500': 'bg-blue-500/15 text-blue-400',
  'bg-green-500': 'bg-green-500/15 text-green-400',
  'bg-orange-500': 'bg-orange-500/15 text-orange-400',
  'bg-purple-500': 'bg-purple-500/15 text-purple-400',
  'bg-gray-500': 'bg-gray-500/15 text-gray-400',
  'bg-red-500': 'bg-red-500/15 text-red-400',
  'bg-pink-500': 'bg-pink-500/15 text-pink-400',
  'bg-yellow-500': 'bg-yellow-500/15 text-yellow-400',
  'bg-teal-500': 'bg-teal-500/15 text-teal-400',
  'bg-indigo-500': 'bg-indigo-500/15 text-indigo-400',
};

export const CATEGORY_FILTER_STYLES: Record<CategoryColorKey, string> = {
  'bg-blue-500': 'bg-blue-500/15 text-blue-400 border-blue-400/40',
  'bg-green-500': 'bg-green-500/15 text-green-400 border-green-400/40',
  'bg-orange-500': 'bg-orange-500/15 text-orange-400 border-orange-400/40',
  'bg-purple-500': 'bg-purple-500/15 text-purple-400 border-purple-400/40',
  'bg-gray-500': 'bg-gray-500/15 text-gray-400 border-gray-400/40',
  'bg-red-500': 'bg-red-500/15 text-red-400 border-red-400/40',
  'bg-pink-500': 'bg-pink-500/15 text-pink-400 border-pink-400/40',
  'bg-yellow-500': 'bg-yellow-500/15 text-yellow-400 border-yellow-400/40',
  'bg-teal-500': 'bg-teal-500/15 text-teal-400 border-teal-400/40',
  'bg-indigo-500': 'bg-indigo-500/15 text-indigo-400 border-indigo-400/40',
};

export const CATEGORY_PILL_STYLES: Record<
  CategoryColorKey,
  { selected: string; dot: string; unselected: string }
> = {
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
  'bg-teal-500': {
    selected: 'bg-teal-500/20 border border-teal-500 text-teal-500',
    dot: 'bg-teal-500',
    unselected: 'bg-muted border border-transparent text-muted-foreground',
  },
  'bg-indigo-500': {
    selected: 'bg-indigo-500/20 border border-indigo-500 text-indigo-500',
    dot: 'bg-indigo-500',
    unselected: 'bg-muted border border-transparent text-muted-foreground',
  },
};

export const CATEGORY_HEX_COLORS: Record<CategoryColorKey, string> = {
  'bg-blue-500': '#3b82f6',
  'bg-green-500': '#22c55e',
  'bg-orange-500': '#f97316',
  'bg-purple-500': '#a855f7',
  'bg-gray-500': '#6b7280',
  'bg-red-500': '#ef4444',
  'bg-pink-500': '#ec4899',
  'bg-yellow-500': '#eab308',
  'bg-teal-500': '#14b8a6',
  'bg-indigo-500': '#6366f1',
};
