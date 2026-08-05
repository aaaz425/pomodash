import type { TabType } from '@pomodash/shared';
import { SegmentedControl } from '@/components/shared/SegmentedControl';

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
  return <SegmentedControl options={TABS} value={value} onChange={onChange} />;
}
