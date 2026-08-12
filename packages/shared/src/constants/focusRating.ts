import type { FocusRating } from '../types/session';

export const FOCUS_RATING_OPTIONS: Array<{ value: FocusRating; label: string }> = [
  { value: 1, label: '하' },
  { value: 2, label: '중' },
  { value: 3, label: '상' },
];

export const FOCUS_RATING_LABELS: Record<FocusRating, string> = {
  1: '하',
  2: '중',
  3: '상',
};
