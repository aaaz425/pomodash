import { BarChart3, BookOpen, Settings, Timer, type LucideIcon } from 'lucide-react-native';

// 웹 apps/web/components/shared/layout/navItems.ts 미러링
export interface NavItem {
  name: string; // (app)/ 라우트 파일명과 일치
  icon: LucideIcon;
  label: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { name: 'index', icon: Timer, label: '타이머' },
  { name: 'dashboard', icon: BarChart3, label: '통계' },
  { name: 'journal', icon: BookOpen, label: '기록' },
  { name: 'settings', icon: Settings, label: '설정' },
];

// 웹 BottomNav.tsx의 h-16(64px)과 동일 — safe area bottom inset은 별도로 더한다
export const BOTTOM_NAV_HEIGHT = 64;
