import { Timer, BarChart3, BookOpen, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', icon: Timer, label: '타이머' },
  { href: '/dashboard', icon: BarChart3, label: '통계' },
  { href: '/journal', icon: BookOpen, label: '기록' },
  { href: '/settings', icon: Settings, label: '설정' },
];
