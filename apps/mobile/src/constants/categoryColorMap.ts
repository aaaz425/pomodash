import { CATEGORY_COLOR_KEYS, type CategoryColorKey } from '@/constants/categoryColors';

// DB categories.color는 CHECK 제약으로 'bg-{key}-500' 형태만 허용(웹 CATEGORY_COLOR_KEYS와 동일 10개)

export function toMobileColorKey(dbColor: string): CategoryColorKey {
  const match = CATEGORY_COLOR_KEYS.find((key) => dbColor === `bg-${key}-500`);
  return match ?? 'gray'; // 알 수 없는 값(수동 DB 조작 등)은 안전하게 회색으로 폴백
}

export function toDbColor(key: CategoryColorKey): string {
  return `bg-${key}-500`;
}
