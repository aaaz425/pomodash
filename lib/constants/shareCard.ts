import { PHASE_HEX_COLORS } from '@/lib/constants/timerColors';

export const SHARE_CARD_SIZE = 1080;

export const SHARE_CARD_COLORS = {
  backgroundTop: '#0b1120',
  backgroundBottom: '#0f172a', // app/manifest.ts의 background_color와 통일
  accent: PHASE_HEX_COLORS.focus,
  accentSoft: '#10d9a026',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  divider: '#1e293b',
} as const;
