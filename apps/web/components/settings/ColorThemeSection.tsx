'use client';

import { COLOR_THEME_KEYS, COLOR_THEMES } from '@pomodash/shared';
import { COLOR_THEME_SWATCH_CLASS } from '@/lib/constants/colorTheme';
import { useAccentTheme } from '@/hooks/useAccentTheme';

export function ColorThemeSection() {
  const { colorTheme, setColorTheme, isDark } = useAccentTheme();

  return (
    <div className="flex gap-3 flex-wrap" role="group" aria-label="컬러 테마">
      {COLOR_THEME_KEYS.map((key) => {
        const theme = COLOR_THEMES[key];
        const swatchClass = isDark
          ? COLOR_THEME_SWATCH_CLASS[key].dark
          : COLOR_THEME_SWATCH_CLASS[key].light;
        const isSelected = colorTheme === key;
        return (
          <button
            key={key}
            onClick={() => setColorTheme(key)}
            aria-label={theme.label}
            aria-pressed={isSelected}
            className="flex flex-col items-center gap-1.5"
          >
            <span
              className={`w-9 h-9 rounded-full transition-all ${swatchClass} ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-offset-card ring-foreground/30 scale-110'
                  : 'hover:scale-110'
              }`}
            />
            <span className="text-xs text-muted-foreground">{theme.label}</span>
          </button>
        );
      })}
    </div>
  );
}
