import type { BadgeTier } from '@pomodash/shared';
import { withAlpha } from './timerColors';

// 웹 apps/web/lib/constants/badges.ts의 BADGE_TIER_STYLES(Tailwind 그라디언트 클래스)를
// RN용 hex 3-stop 그라디언트로 근사한 것 — 같은 Tailwind 색상 계열의 실제 hex 값을 사용.
export interface BadgeTierStyle {
  medallionColors: [string, string, string]; // expo-linear-gradient용 3-stop
  ring: string;
  ribbon: string;
}

export const BADGE_TIER_STYLES: Record<BadgeTier, BadgeTierStyle> = {
  bronze: {
    medallionColors: ['#b45309', '#f59e0b', '#92400e'],
    ring: withAlpha('#78350f', 0.4),
    ribbon: '#b45309',
  },
  silver: {
    medallionColors: ['#cbd5e1', '#f1f5f9', '#94a3b8'],
    ring: withAlpha('#94a3b8', 0.4),
    ribbon: '#94a3b8',
  },
  gold: {
    medallionColors: ['#fde047', '#fbbf24', '#ca8a04'],
    ring: withAlpha('#ca8a04', 0.4),
    ribbon: '#eab308',
  },
  platinum: {
    medallionColors: ['#a5f3fc', '#7dd3fc', '#818cf8'],
    ring: withAlpha('#6366f1', 0.4),
    ribbon: '#818cf8',
  },
  special: {
    medallionColors: ['#e879f9', '#a855f7', '#4f46e5'],
    ring: withAlpha('#9333ea', 0.4),
    ribbon: '#a855f7',
  },
};
