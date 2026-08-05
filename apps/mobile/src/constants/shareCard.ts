import { PHASE_HEX } from './timerColors';

// 웹 apps/web/lib/constants/shareCard.ts와 동일한 팔레트
export const SHARE_CARD_COLORS = {
  backgroundTop: '#0b1120',
  backgroundBottom: '#0f172a',
  accent: PHASE_HEX.focus,
  accentSoft: '#10d9a026',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  divider: '#1e293b',
} as const;
