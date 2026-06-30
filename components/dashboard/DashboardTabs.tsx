'use client';

import type { TabType } from '@/types';

const TABS: { value: TabType; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: 'all', label: '전체' },
];

interface Props {
  value: TabType;
  onChange: (tab: TabType) => void;
}

export function DashboardTabs({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={[
            'px-3 py-1.5 rounded-md text-sm transition-colors',
            value === tab.value
              ? 'bg-card text-foreground font-medium shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
