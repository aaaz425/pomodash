// apps/web/lib/constants/categoryColors.ts의 CATEGORY_PRESET_COLORS와 값이 동일한 프리셋 단축 버튼 목록.
// 실제 카테고리 색상은 이 목록에 없는 임의의 hex도 저장될 수 있다(컬러피커로 직접 선택).
export const CATEGORY_PRESET_COLORS: { hex: string; label: string }[] = [
  { hex: '#3b82f6', label: '파란색' },
  { hex: '#22c55e', label: '초록색' },
  { hex: '#f97316', label: '주황색' },
  { hex: '#a855f7', label: '보라색' },
  { hex: '#ef4444', label: '빨간색' },
  { hex: '#ec4899', label: '분홍색' },
  { hex: '#eab308', label: '노란색' },
];
