export const COLOR_THEME_KEYS = ['midnight', 'sunset', 'ocean', 'mono'] as const;
export type ColorThemeKey = (typeof COLOR_THEME_KEYS)[number];

export interface AccentPair {
  color: string;
  foreground: string;
}

export interface ColorThemeAccent {
  light: AccentPair;
  dark: AccentPair;
}

// 공유 카드는 앱 라이트/다크 설정과 무관하게 항상 다크 톤 고정
export interface ShareCardPalette {
  bgTop: string;
  bgBottom: string;
  accent: string;
  accentSoft: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  divider: string;
}

export interface ColorThemeDefinition {
  key: ColorThemeKey;
  label: string;
  accent: ColorThemeAccent;
  shareCard: ShareCardPalette;
}

export const COLOR_THEMES: Record<ColorThemeKey, ColorThemeDefinition> = {
  midnight: {
    key: 'midnight',
    label: '미드나잇',
    accent: {
      light: { color: '#0aaa7d', foreground: '#07090f' },
      dark: { color: '#10d9a0', foreground: '#07090f' },
    },
    shareCard: {
      bgTop: '#0b1120',
      bgBottom: '#0f172a',
      accent: '#10d9a0',
      accentSoft: 'rgba(16,217,160,0.16)',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      divider: '#1e293b',
    },
  },
  sunset: {
    key: 'sunset',
    label: '선셋',
    accent: {
      light: { color: '#ff8a4c', foreground: '#2a1220' },
      dark: { color: '#ff8a4c', foreground: '#2a1220' },
    },
    shareCard: {
      bgTop: '#2a1220',
      bgBottom: '#170a12',
      accent: '#ff8a4c',
      accentSoft: 'rgba(255,138,76,0.16)',
      textPrimary: '#fdf3ea',
      textSecondary: '#d8b8ab',
      textMuted: '#8f6f66',
      divider: '#3a1f28',
    },
  },
  ocean: {
    key: 'ocean',
    label: '오션',
    accent: {
      light: { color: '#38bdf8', foreground: '#071a2e' },
      dark: { color: '#38bdf8', foreground: '#071a2e' },
    },
    shareCard: {
      bgTop: '#071a2e',
      bgBottom: '#041121',
      accent: '#38bdf8',
      accentSoft: 'rgba(56,189,248,0.16)',
      textPrimary: '#eef7ff',
      textSecondary: '#9fc3dd',
      textMuted: '#5f7f95',
      divider: '#12314a',
    },
  },
  mono: {
    key: 'mono',
    label: '모노',
    accent: {
      light: { color: '#27272a', foreground: '#fafafa' }, // near-white는 흰 배경에서 안 보여서 별도 지정
      dark: { color: '#f4f4f5', foreground: '#18181b' },
    },
    shareCard: {
      bgTop: '#1a1a1c',
      bgBottom: '#0c0c0d',
      accent: '#f4f4f5',
      accentSoft: 'rgba(244,244,245,0.12)',
      textPrimary: '#fafafa',
      textSecondary: '#a3a3a3',
      textMuted: '#6b6b6b',
      divider: '#2a2a2c',
    },
  },
};

export const DEFAULT_COLOR_THEME: ColorThemeKey = 'midnight';
