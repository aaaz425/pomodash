// 카테고리에 지정 가능한 색상 키 — CategoryBadge/CategoryPills/JournalFilterModal이
// 각자 이 키 집합을 기준으로 스타일을 정의한다. 새 키 추가 시 Record<CategoryColorKey, ...>
// 타입 체크가 누락된 곳을 컴파일 에러로 잡아준다.
export const CATEGORY_COLOR_KEYS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-gray-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-yellow-500',
] as const;

export type CategoryColorKey = (typeof CATEGORY_COLOR_KEYS)[number];
