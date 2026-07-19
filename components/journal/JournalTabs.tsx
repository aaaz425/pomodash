'use client';

import { SegmentedControl } from '@/components/shared/SegmentedControl';
import type { JournalTab } from '@/types';

const TABS: { value: JournalTab; label: string }[] = [
  { value: 'list', label: '리스트' },
  { value: 'timeline', label: '타임라인' },
  { value: 'calendar', label: '캘린더' },
];

interface Props {
  value: JournalTab;
  onChange: (tab: JournalTab) => void;
}

export function JournalTabs({ value, onChange }: Props) {
  return <SegmentedControl options={TABS} value={value} onChange={onChange} fullWidth />;
}
