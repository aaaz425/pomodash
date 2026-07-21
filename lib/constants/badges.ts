export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'special';

export type BadgeIconKey =
  | 'flame'
  | 'clock'
  | 'layers'
  | 'sparkles'
  | 'moon'
  | 'sun'
  | 'trophy'
  | 'rocket';

interface BaseBadge {
  id: string;
  tier: BadgeTier;
  name: string;
  description: string;
  icon: BadgeIconKey;
}

interface StreakBadge extends BaseBadge {
  category: 'streak';
  days: number; // getMaxStreakDays 기준
}

interface TotalTimeBadge extends BaseBadge {
  category: 'total-time';
  hours: number; // getTotalFocusSeconds(전체 세션) 기준
}

interface DiversityBadge extends BaseBadge {
  category: 'diversity';
  categoryCount: number; // 세션에서 실제 사용된 서로 다른 카테고리 수
}

export type SpecialEventId =
  | 'first-session'
  | 'night-owl'
  | 'weekend-warrior'
  | 'perfect-session'
  | 'marathon';

interface SpecialBadge extends BaseBadge {
  category: 'special';
  eventId: SpecialEventId;
}

export type BadgeDefinition = StreakBadge | TotalTimeBadge | DiversityBadge | SpecialBadge;

export type BadgeCategory = BadgeDefinition['category'];

export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, string> = {
  streak: '연속 기록',
  'total-time': '누적 시간',
  diversity: '다양성',
  special: '특별 이벤트',
};

// 등급별 메달 색상 — 실제 금속/보석 톤을 흉내낸 그라디언트 조합
export const BADGE_TIER_STYLES: Record<
  BadgeTier,
  { medallion: string; ring: string; ribbon: string }
> = {
  bronze: {
    medallion: 'from-amber-700 via-amber-500 to-amber-800',
    ring: 'ring-amber-900/40',
    ribbon: 'bg-amber-700',
  },
  silver: {
    medallion: 'from-slate-300 via-slate-100 to-slate-400',
    ring: 'ring-slate-400/40',
    ribbon: 'bg-slate-400',
  },
  gold: {
    medallion: 'from-yellow-300 via-amber-400 to-yellow-600',
    ring: 'ring-yellow-600/40',
    ribbon: 'bg-yellow-500',
  },
  platinum: {
    medallion: 'from-cyan-200 via-sky-300 to-indigo-400',
    ring: 'ring-indigo-500/40',
    ribbon: 'bg-indigo-400',
  },
  special: {
    medallion: 'from-fuchsia-400 via-purple-500 to-indigo-600',
    ring: 'ring-purple-600/40',
    ribbon: 'bg-purple-500',
  },
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'streak-3',
    category: 'streak',
    tier: 'bronze',
    days: 3,
    name: '점화',
    description: '3일 연속 집중',
    icon: 'flame',
  },
  {
    id: 'streak-7',
    category: 'streak',
    tier: 'silver',
    days: 7,
    name: '일주일 개근',
    description: '7일 연속 집중',
    icon: 'flame',
  },
  {
    id: 'streak-30',
    category: 'streak',
    tier: 'gold',
    days: 30,
    name: '한 달의 약속',
    description: '30일 연속 집중',
    icon: 'flame',
  },
  {
    id: 'streak-100',
    category: 'streak',
    tier: 'platinum',
    days: 100,
    name: '백일의 기적',
    description: '100일 연속 집중',
    icon: 'flame',
  },
  {
    id: 'total-time-1h',
    category: 'total-time',
    tier: 'bronze',
    hours: 1,
    name: '첫 시간',
    description: '누적 집중 시간 1시간',
    icon: 'clock',
  },
  {
    id: 'total-time-10h',
    category: 'total-time',
    tier: 'silver',
    hours: 10,
    name: '꾸준함',
    description: '누적 집중 시간 10시간',
    icon: 'clock',
  },
  {
    id: 'total-time-50h',
    category: 'total-time',
    tier: 'gold',
    hours: 50,
    name: '몰입의 달인',
    description: '누적 집중 시간 50시간',
    icon: 'clock',
  },
  {
    id: 'total-time-100h',
    category: 'total-time',
    tier: 'platinum',
    hours: 100,
    name: '백 시간의 기록',
    description: '누적 집중 시간 100시간',
    icon: 'clock',
  },
  {
    id: 'diversity-2',
    category: 'diversity',
    tier: 'bronze',
    categoryCount: 2,
    name: '새로운 시도',
    description: '서로 다른 카테고리 2개에서 집중',
    icon: 'layers',
  },
  {
    id: 'diversity-3',
    category: 'diversity',
    tier: 'silver',
    categoryCount: 3,
    name: '다재다능',
    description: '서로 다른 카테고리 3개에서 집중',
    icon: 'layers',
  },
  {
    id: 'diversity-5',
    category: 'diversity',
    tier: 'gold',
    categoryCount: 5,
    name: '만물박사',
    description: '서로 다른 카테고리 5개에서 집중',
    icon: 'layers',
  },
  {
    id: 'diversity-7',
    category: 'diversity',
    tier: 'platinum',
    categoryCount: 7,
    name: '올라운더',
    description: '서로 다른 카테고리 7개에서 집중',
    icon: 'layers',
  },
  {
    id: 'first-session',
    category: 'special',
    tier: 'special',
    eventId: 'first-session',
    name: '첫 발걸음',
    description: '첫 세션 완료',
    icon: 'sparkles',
  },
  {
    id: 'night-owl',
    category: 'special',
    tier: 'special',
    eventId: 'night-owl',
    name: '올빼미',
    description: '새벽 시간대(00~05시)에 집중',
    icon: 'moon',
  },
  {
    id: 'weekend-warrior',
    category: 'special',
    tier: 'special',
    eventId: 'weekend-warrior',
    name: '주말 전사',
    description: '주말에 집중',
    icon: 'sun',
  },
  {
    id: 'perfect-session',
    category: 'special',
    tier: 'special',
    eventId: 'perfect-session',
    name: '완주',
    description: '계획한 사이클을 모두 완료',
    icon: 'trophy',
  },
  {
    id: 'marathon',
    category: 'special',
    tier: 'special',
    eventId: 'marathon',
    name: '마라토너',
    description: '한 세션에서 2시간 이상 집중',
    icon: 'rocket',
  },
];
