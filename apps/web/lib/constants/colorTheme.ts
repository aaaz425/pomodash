import type { ColorThemeKey } from '@pomodash/shared';

// Tailwind JIT는 동적 템플릿 문자열을 스캔하지 못해 리터럴 클래스가 필요함 —
// COLOR_THEMES(@pomodash/shared)의 accent 값과 반드시 동일하게 유지
export const COLOR_THEME_SWATCH_CLASS: Record<ColorThemeKey, { light: string; dark: string }> = {
  midnight: { light: 'bg-[#0aaa7d]', dark: 'bg-[#10d9a0]' },
  sunset: { light: 'bg-[#ff8a4c]', dark: 'bg-[#ff8a4c]' },
  ocean: { light: 'bg-[#38bdf8]', dark: 'bg-[#38bdf8]' },
  mono: { light: 'bg-[#27272a]', dark: 'bg-[#f4f4f5]' },
};
