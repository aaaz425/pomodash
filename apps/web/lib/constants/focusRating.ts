import type { FocusRating } from '@/types/models';

export const FOCUS_RATING_OPTIONS: Array<{ value: FocusRating; label: string }> = [
  { value: 1, label: '흐트러짐' },
  { value: 2, label: '보통' },
  { value: 3, label: '몰입' },
];

export const FOCUS_RATING_LABELS: Record<FocusRating, string> = {
  1: '흐트러짐',
  2: '보통',
  3: '몰입',
};
