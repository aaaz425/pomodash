'use client';

import { ChartColumn, CircleCheck, Flame, Timer } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { HourlyChart } from '@/components/dashboard/HourlyChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { formatDuration } from '@/lib/sessionUtils';
import {
  filterSessionsByTab,
  getAvgSessionSeconds,
  getPrevWeekSessionCount,
  getSessionCount,
  getStreakDays,
  getTotalFocusSeconds,
  type TabType,
} from '@/lib/dashboard';
import { useTaskStore } from '@/store/StoreProvider';

export default function DashboardPage() {
  const [tab, setTab] = useState<TabType>('week');

  const sessions = useTaskStore((s) => s.sessions);
  const filtered = useMemo(() => filterSessionsByTab(sessions, tab), [sessions, tab]);

  const totalFocusSeconds = useMemo(() => getTotalFocusSeconds(filtered), [filtered]);
  const sessionCount = useMemo(() => getSessionCount(filtered), [filtered]);
  const avgSessionSeconds = useMemo(() => getAvgSessionSeconds(filtered), [filtered]);
  const streakDays = useMemo(() => getStreakDays(sessions), [sessions]);
  const prevWeekCount = useMemo(() => getPrevWeekSessionCount(sessions), [sessions]);

  const sessionCountSub =
    tab === 'week'
      ? prevWeekCount === 0
        ? undefined
        : `전주 대비 ${sessionCount - prevWeekCount >= 0 ? '+' : ''}${sessionCount - prevWeekCount}`
      : undefined;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-6 p-8 md:p-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">통계</h1>
          <DashboardTabs value={tab} onChange={setTab} />
        </div>

        {/* Stat Cards */}
        <div className="flex gap-3">
          <StatCard
            label={
              tab === 'today'
                ? '오늘 집중 시간'
                : tab === 'week'
                  ? '이번 주 집중 시간'
                  : '이번 달 집중 시간'
            }
            Icon={Timer}
            value={totalFocusSeconds === 0 ? '0분' : formatDuration(totalFocusSeconds)}
          />
          <StatCard
            label={tab === 'today' ? '오늘 세션' : tab === 'week' ? '이번 주 세션' : '이번 달 세션'}
            Icon={CircleCheck}
            value={`${sessionCount}세션`}
            sub={sessionCountSub}
          />
          <StatCard
            label="연속 집중일"
            Icon={Flame}
            value={`${streakDays}일`}
            sub="현재 연속 기록"
          />
          <StatCard
            label="세션 평균"
            Icon={ChartColumn}
            value={avgSessionSeconds === 0 ? '-' : formatDuration(avgSessionSeconds)}
            sub="세션당 평균 시간"
          />
        </div>

        {/* Chart Row — placeholder */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 p-5 rounded-lg border border-border bg-card min-h-[200px]">
            <p className="text-sm font-semibold text-foreground">이번 주 집중 시간</p>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">차트 준비 중</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-lg border border-border bg-card min-h-[200px]">
            <p className="text-sm font-semibold text-foreground">이달의 잔디</p>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">준비 중</p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Category chart placeholder */}
          <div className="flex flex-col gap-3 p-5 rounded-lg border border-border bg-card min-h-[180px]">
            <p className="text-sm font-semibold text-foreground">카테고리별 집중</p>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">차트 준비 중</p>
            </div>
          </div>

          {/* Hourly Chart */}
          <HourlyChart sessions={sessions} />
        </div>
      </div>
    </main>
  );
}
