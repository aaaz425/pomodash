import {
  Clock,
  Flame,
  Layers,
  Moon,
  Rocket,
  Sparkles,
  Sun,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { BADGE_TIER_STYLES, type BadgeDefinition, type BadgeIconKey } from '@/lib/constants/badges';

const BADGE_ICONS: Record<BadgeIconKey, LucideIcon> = {
  flame: Flame,
  clock: Clock,
  layers: Layers,
  sparkles: Sparkles,
  moon: Moon,
  sun: Sun,
  trophy: Trophy,
  rocket: Rocket,
};

interface Props {
  badge: BadgeDefinition;
  earned: boolean;
}

export function BadgeMedal({ badge, earned }: Props) {
  const Icon = BADGE_ICONS[badge.icon];
  const tier = BADGE_TIER_STYLES[badge.tier];

  return (
    <div
      tabIndex={0}
      className="group relative flex flex-col items-center gap-1 w-[76px] outline-none"
    >
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-max max-w-[160px] -translate-x-1/2 flex-col items-center gap-0.5 rounded-md border border-border bg-popover px-2.5 py-1.5 text-center shadow-md group-hover:flex group-focus:flex"
      >
        <span className="text-xs font-semibold text-popover-foreground">{badge.name}</span>
        <span className="text-[11px] text-muted-foreground">
          {badge.description}
          {!earned && ' (미획득)'}
        </span>
      </div>
      <div
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-background shadow-md bg-gradient-to-br',
          earned ? tier.medallion : 'from-muted to-muted grayscale',
          earned ? tier.ring : 'ring-border',
        )}
      >
        <div className="absolute inset-1 rounded-full ring-1 ring-inset ring-white/40" />
        <Icon
          className={cn(
            'h-6 w-6 drop-shadow-sm',
            earned ? 'text-white' : 'text-muted-foreground/60',
          )}
          strokeWidth={2.25}
        />
      </div>
      <div className="flex -mt-1 gap-0.5" aria-hidden="true">
        <div
          className={cn(
            'h-2.5 w-2.5 [clip-path:polygon(0_0,100%_0,50%_100%)]',
            earned ? tier.ribbon : 'bg-muted',
          )}
        />
        <div
          className={cn(
            'h-2.5 w-2.5 [clip-path:polygon(0_0,100%_0,50%_100%)]',
            earned ? tier.ribbon : 'bg-muted',
          )}
        />
      </div>
      <span
        className={cn(
          'text-[11px] font-medium text-center leading-tight break-keep',
          earned ? 'text-foreground' : 'text-muted-foreground/60',
        )}
      >
        {badge.name}
      </span>
    </div>
  );
}
