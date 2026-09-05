import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartColumn, CircleCheck, Flame, Share2, Timer } from 'lucide-react-native';
import {
  buildShareCardData,
  formatDuration,
  filterSessionsByTab,
  getAvgSessionSeconds,
  getSessionCount,
  getTotalFocusSeconds,
  type TabType,
} from '@pomodash/shared';
import { useTaskStore, useHydrated } from '@/store/StoreProvider';
import { fetchDashboardSummary } from '@/lib/supabase/dashboard';
import type { DashboardSummary } from '@/types/dashboard';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { StatCard } from '@/components/dashboard/StatCard';
import { FocusChart } from '@/components/dashboard/FocusChart';
import { MonthlyActivityCard } from '@/components/dashboard/MonthlyActivityCard';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { HourlyChart } from '@/components/dashboard/HourlyChart';
import { BadgeGallery } from '@/components/dashboard/badges/BadgeGallery';
import { ShareCardModal } from '@/components/dashboard/ShareCardModal';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

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

const FOCUS_LABELS: Record<TabType, string> = {
  today: '오늘 집중 시간',
  week: '이번 주 집중 시간',
  month: '이번 달 집중 시간',
  all: '전체 집중 시간',
};

const SESSION_LABELS: Record<TabType, string> = {
  today: '오늘 기록',
  week: '이번 주 기록',
  month: '이번 달 기록',
  all: '전체 기록',
};

export default function DashboardScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const hydrated = useHydrated();

  const [tab, setTab] = useState<TabType>('week');
  const [shareOpen, setShareOpen] = useState(false);

  const sessions = useTaskStore((s) => s.sessions);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchDashboardSummary().then((result) => {
      if (!cancelled && result) setSummary(result);
    });
    return () => {
      cancelled = true;
    };
  }, [sessions]);

  // React Compiler(reactCompiler: true, app.config.ts)가 자동으로 메모이제이션 —
  // 수동 useMemo가 불필요함을 eslint-plugin-react-compiler로 확인함
  const filtered = filterSessionsByTab(sessions, tab);
  const shareCardData = buildShareCardData(filtered, sessions, tab);

  const totalFocusSeconds = getTotalFocusSeconds(filtered);
  const sessionCount = getSessionCount(filtered);
  const avgSessionSeconds = getAvgSessionSeconds(filtered);
  const streakDays = summary?.streakDays ?? 0;
  const maxStreakDays = summary?.maxStreakDays ?? 0;
  const monthlyActivity = summary?.monthlyActivity ?? [];
  const monthFocusSeconds = summary?.monthFocusSeconds ?? 0;
  const busiestDay = summary?.busiestDay ?? null;
  const firstSessionDate = summary?.firstSessionDate ? new Date(summary.firstSessionDate) : null;

  const prevDay = summary?.prevDay ?? { focusSeconds: 0, count: 0 };
  const prevWeek = summary?.prevWeek ?? { focusSeconds: 0, count: 0 };
  const prevMonth = summary?.prevMonth ?? { focusSeconds: 0, count: 0 };

  const focusLabel = FOCUS_LABELS[tab];
  const sessionLabel = SESSION_LABELS[tab];

  const focusSub = (() => {
    if (tab === 'today' && prevDay.focusSeconds > 0)
      return makeFocusSub(totalFocusSeconds - prevDay.focusSeconds, '어제 대비');
    if (tab === 'week' && prevWeek.focusSeconds > 0)
      return makeFocusSub(totalFocusSeconds - prevWeek.focusSeconds, '전주 대비');
    if (tab === 'month' && prevMonth.focusSeconds > 0)
      return makeFocusSub(totalFocusSeconds - prevMonth.focusSeconds, '전월 대비');
    if (tab === 'all' && firstSessionDate)
      return `${firstSessionDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}부터`;
    return undefined;
  })();

  const sessionCountSub = (() => {
    if (tab === 'today' && prevDay.count > 0)
      return makeCountSub(sessionCount - prevDay.count, '어제 대비');
    if (tab === 'week' && prevWeek.count > 0)
      return makeCountSub(sessionCount - prevWeek.count, '전주 대비');
    if (tab === 'month' && prevMonth.count > 0)
      return makeCountSub(sessionCount - prevMonth.count, '전월 대비');
    return undefined;
  })();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {!hydrated || !summary ? (
          <DashboardSkeleton />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View>
                <Text
                  style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansBold }]}
                >
                  통계
                </Text>
              </View>
              <View style={styles.controlsRow}>
                <Pressable
                  style={[styles.shareButton, { borderColor: theme.border }]}
                  onPress={() => setShareOpen(true)}
                  hitSlop={8}
                  accessibilityLabel="공유 카드 만들기"
                >
                  <Share2 size={16} color={theme.foreground} />
                </Pressable>
                <View style={styles.tabsWrap}>
                  <DashboardTabs value={tab} onChange={setTab} />
                </View>
              </View>
            </View>

            <View style={styles.statGrid}>
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
            </View>

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

            <CategoryChart sessions={filtered} tasks={tasks} categories={categories} />

            <HourlyChart sessions={filtered} />

            <BadgeGallery sessions={sessions} tasks={tasks} />
          </ScrollView>
        )}
      </SafeAreaView>

      {shareOpen && <ShareCardModal data={shareCardData} onClose={() => setShareOpen(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 20,
  },
  statGrid: {
    gap: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabsWrap: {
    flex: 1,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
