'use client';

import { ChartColumn, CircleCheck, Flame, Share2, Timer } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

import { BadgeGallery } from '@/components/dashboard/BadgeGallery';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { FocusChart } from '@/components/dashboard/FocusChart';
import { HourlyChart } from '@/components/dashboard/HourlyChart';
import { MonthlyActivityCard } from '@/components/dashboard/MonthlyActivityCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import {
  filterSessionsByTab,
  getAvgSessionSeconds,
  getBusiestDayOfWeek,
  getFirstSessionDate,
  getMaxStreakDays,
  getMonthlyActivityData,
  getPrevDayFocusSeconds,
  getPrevDaySessionCount,
  getPrevMonthFocusSeconds,
  getPrevMonthSessionCount,
  getPrevWeekFocusSeconds,
  getPrevWeekSessionCount,
  getSessionCount,
  getStreakDays,
  getTotalFocusSeconds,
} from '@/lib/dashboard';
import { buildShareCardData } from '@/lib/shareCard';
import type { TabType } from '@/types';
import { formatDuration } from '@/lib/sessionUtils';
import { useTaskStore } from '@/store/StoreProvider';
import { useDelayedHydration } from '@/hooks/useDelayedHydration';

// 캔버스 렌더링 로직이 무거운데 공유 버튼을 눌러야만 열리므로 초기 대시보드 번들에서 제외
const ShareCardModal = dynamic(() =>
  import('@/components/dashboard/ShareCardModal').then((mod) => mod.ShareCardModal),
);

function makeFocusSub(diff: number, label: string): string | undefined {
  if (diff === 0) return undefined;
  const sign = diff > 0 ? '+' : '-';
  return `${label} ${sign}${formatDuration(Math.abs(diff))}`;
}

function makeCountSub(diff: number, label: string): string | undefined {
  if (diff === 0) return undefined;
  const sign = diff > 0 ? '+' : '-';
  return `${label} ${sign}${Math.abs(diff)}`;
}

export function DashboardView() {
  const { hydrated, showSkeleton } = useDelayedHydration();
  const [tab, setTab] = useState<TabType>('week');
  const [shareOpen, setShareOpen] = useState(false);

  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const filtered = filterSessionsByTab(sessions, tab);
  const monthSessions = filterSessionsByTab(sessions, 'month');
  const shareCardData = buildShareCardData(filtered, sessions, tab);

  const totalFocusSeconds = getTotalFocusSeconds(filtered);
  const sessionCount = getSessionCount(filtered);
  const avgSessionSeconds = getAvgSessionSeconds(filtered);
  const streakDays = getStreakDays(sessions);
  const maxStreakDays = getMaxStreakDays(sessions);
  const monthlyActivity = getMonthlyActivityData(sessions);
  const monthFocusSeconds = getTotalFocusSeconds(monthSessions);
  const busiestDay = getBusiestDayOfWeek(sessions);
  const firstSessionDate = getFirstSessionDate(sessions);

  const prevDayFocusSec = getPrevDayFocusSeconds(sessions);
  const prevDayCount = getPrevDaySessionCount(sessions);
  const prevWeekFocusSec = getPrevWeekFocusSeconds(sessions);
  const prevWeekCount = getPrevWeekSessionCount(sessions);
  const prevMonthFocusSec = getPrevMonthFocusSeconds(sessions);
  const prevMonthCount = getPrevMonthSessionCount(sessions);

  const focusLabel =
    tab === 'today'
      ? '오늘 집중 시간'
      : tab === 'week'
        ? '이번 주 집중 시간'
        : tab === 'month'
          ? '이번 달 집중 시간'
          : '전체 집중 시간';

  const sessionLabel =
    tab === 'today'
      ? '오늘 기록'
      : tab === 'week'
        ? '이번 주 기록'
        : tab === 'month'
          ? '이번 달 기록'
          : '전체 기록';

  const focusSub: string | undefined = (() => {
    if (tab === 'today' && prevDayFocusSec > 0)
      return makeFocusSub(totalFocusSeconds - prevDayFocusSec, '어제 대비');
    if (tab === 'week' && prevWeekFocusSec > 0)
      return makeFocusSub(totalFocusSeconds - prevWeekFocusSec, '전주 대비');
    if (tab === 'month' && prevMonthFocusSec > 0)
      return makeFocusSub(totalFocusSeconds - prevMonthFocusSec, '전월 대비');
    if (tab === 'all' && firstSessionDate)
      return `${firstSessionDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}부터`;
    return undefined;
  })();

  const sessionCountSub: string | undefined = (() => {
    if (tab === 'today' && prevDayCount > 0)
      return makeCountSub(sessionCount - prevDayCount, '어제 대비');
    if (tab === 'week' && prevWeekCount > 0)
      return makeCountSub(sessionCount - prevWeekCount, '전주 대비');
    if (tab === 'month' && prevMonthCount > 0)
      return makeCountSub(sessionCount - prevMonthCount, '전월 대비');
    return undefined;
  })();

  if (!hydrated) return showSkeleton ? <DashboardSkeleton /> : null;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">통계</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShareOpen(true)}
            aria-label="공유 카드 만들기"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <DashboardTabs value={tab} onChange={setTab} />
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label={focusLabel}
          Icon={Timer}
          value={totalFocusSeconds === 0 ? '0분' : formatDuration(totalFocusSeconds)}
          sub={focusSub}
        />
        <StatCard
          label={sessionLabel}
          Icon={CircleCheck}
          value={`${sessionCount}건`}
          sub={sessionCountSub}
        />
        <StatCard
          label="연속 집중일"
          Icon={Flame}
          value={`${streakDays}일`}
          sub={maxStreakDays > streakDays ? `최장 ${maxStreakDays}일` : '현재 연속 기록'}
        />
        <StatCard
          label="기록 평균"
          Icon={ChartColumn}
          value={avgSessionSeconds === 0 ? '-' : formatDuration(avgSessionSeconds)}
          sub="기록당 평균 시간"
        />
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FocusChart
          sessions={filtered}
          tasks={tasks}
          categories={categories}
          tab={tab}
          focusLabel={focusLabel}
        />

        <MonthlyActivityCard
          monthlyActivity={monthlyActivity}
          monthFocusSeconds={monthFocusSeconds}
          maxStreakDays={maxStreakDays}
          busiestDay={busiestDay}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CategoryChart sessions={filtered} tasks={tasks} categories={categories} />
        <HourlyChart sessions={filtered} />
      </div>

      {/* Badge Gallery */}
      <BadgeGallery sessions={sessions} tasks={tasks} />

      {shareOpen && <ShareCardModal data={shareCardData} onClose={() => setShareOpen(false)} />}
    </div>
  );
}
