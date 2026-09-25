'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  Icon: LucideIcon;
  label: string;
  value: string;
  onClick: () => void;
  destructive?: boolean;
}

export function SettingsMenuRow({ Icon, label, value, onClick, destructive = false }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn('w-4 h-4', destructive ? 'text-destructive' : 'text-muted-foreground')}
        />
        <span className={cn('text-sm', destructive ? 'text-destructive' : 'text-foreground')}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span className="text-xs">{value}</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );
}
