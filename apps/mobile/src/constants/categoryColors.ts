// apps/web/lib/constants/categoryColors.ts와 값은 동일하되, 웹은 Tailwind 클래스 문자열('bg-blue-500')을
// 색상 키로 쓰는 반면 여기선 hex 매핑용 시맨틱 키를 쓴다(Tailwind가 없는 RN이라 클래스 문자열은 의미가 없음).
export const CATEGORY_COLOR_KEYS = [
  'blue',
  'green',
  'orange',
  'purple',
  'gray',
  'red',
  'pink',
  'yellow',
  'teal',
  'indigo',
] as const;

export type CategoryColorKey = (typeof CATEGORY_COLOR_KEYS)[number];

// 웹 CATEGORY_HEX_COLORS와 동일한 값(표준 Tailwind 500 팔레트)
export const CATEGORY_HEX: Record<CategoryColorKey, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  orange: '#f97316',
  purple: '#a855f7',
  gray: '#6b7280',
  red: '#ef4444',
  pink: '#ec4899',
  yellow: '#eab308',
  teal: '#14b8a6',
  indigo: '#6366f1',
};

export const CATEGORY_COLOR_LABELS: Record<CategoryColorKey, string> = {
  blue: '파란색',
  green: '초록색',
  orange: '주황색',
  purple: '보라색',
  gray: '회색',
  red: '빨간색',
  pink: '분홍색',
  yellow: '노란색',
  teal: '청록색',
  indigo: '남색',
};
