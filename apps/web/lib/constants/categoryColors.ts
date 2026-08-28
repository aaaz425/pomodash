export const CATEGORY_PRESET_COLORS: { hex: string; label: string }[] = [
  { hex: '#3b82f6', label: '파란색' },
  { hex: '#22c55e', label: '초록색' },
  { hex: '#f97316', label: '주황색' },
  { hex: '#a855f7', label: '보라색' },
  { hex: '#ef4444', label: '빨간색' },
  { hex: '#ec4899', label: '분홍색' },
  { hex: '#eab308', label: '노란색' },
];

// 웹의 Tailwind 알파 표기(예: bg-muted/60)로 표현할 수 없는 임의 hex 색상에 대응 — hex를 rgba 문자열로 변환
export function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
