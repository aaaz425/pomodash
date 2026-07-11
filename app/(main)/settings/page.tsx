'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Bell, ListChecks, ListTodo, Sparkles, Timer } from 'lucide-react';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { ThemeSection } from '@/components/settings/ThemeSection';
import { InstallSection } from '@/components/settings/InstallSection';
import { AboutSection } from '@/components/settings/AboutSection';
import { TimerDefaultsModal } from '@/components/settings/timer-defaults/TimerDefaultsModal';
import { CategoryModal } from '@/components/settings/category/CategoryModal';
import { TaskManageModal } from '@/components/settings/task/TaskManageModal';
import { MotivationalModal } from '@/components/settings/motivational/MotivationalModal';
import { NotificationModal } from '@/components/settings/notification/NotificationModal';
import { SettingsMenuRow } from '@/components/shared/SettingsMenuRow';
import { useSettingsStore, useTaskStore } from '@/store/StoreProvider';

type MenuKey = 'timer' | 'task' | 'category' | 'motivational' | 'notification';

function SettingCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);

  const defaultTimerSettings = useSettingsStore((s) => s.defaultTimerSettings);
  const taskCount = useTaskStore((s) => s.tasks.length);
  const categoryCount = useTaskStore((s) => s.categories.length);
  const motivationalCount = useSettingsStore((s) => s.motivationalMessages.length);
  const browserNotification = useSettingsStore((s) => s.browserNotification);
  const soundAlert = useSettingsStore((s) => s.soundAlert);

  return (
    <main id="main-content" className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 lg:px-0 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">설정</h1>
          <p className="mt-1 text-sm text-muted-foreground">프로필과 앱 설정을 관리합니다.</p>
        </div>

        <SettingCard title="프로필">
          <ProfileSection />
        </SettingCard>

        <SettingCard title="테마">
          <ThemeSection />
        </SettingCard>

        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          <SettingsMenuRow
            Icon={Timer}
            label="타이머 기본값"
            value={`${defaultTimerSettings.focusMinutes}분 / ${defaultTimerSettings.totalCycles}회 / ${defaultTimerSettings.shortBreakMinutes}분`}
            onClick={() => setOpenMenu('timer')}
          />
          <SettingsMenuRow
            Icon={ListChecks}
            label="작업 관리"
            value={`${taskCount}개`}
            onClick={() => setOpenMenu('task')}
          />
          <SettingsMenuRow
            Icon={ListTodo}
            label="카테고리 관리"
            value={`${categoryCount}개`}
            onClick={() => setOpenMenu('category')}
          />
          <SettingsMenuRow
            Icon={Sparkles}
            label="동기부여 메시지"
            value={`${motivationalCount}개`}
            onClick={() => setOpenMenu('motivational')}
          />
          <SettingsMenuRow
            Icon={Bell}
            label="알림"
            value={browserNotification || soundAlert ? '켜짐' : '꺼짐'}
            onClick={() => setOpenMenu('notification')}
          />
        </div>

        <SettingCard title="앱 설치">
          <InstallSection />
        </SettingCard>

        <SettingCard title="앱 정보">
          <AboutSection />
        </SettingCard>
      </div>

      {openMenu === 'timer' && <TimerDefaultsModal onClose={() => setOpenMenu(null)} />}
      {openMenu === 'task' && <TaskManageModal onClose={() => setOpenMenu(null)} />}
      {openMenu === 'category' && <CategoryModal onClose={() => setOpenMenu(null)} />}
      {openMenu === 'motivational' && <MotivationalModal onClose={() => setOpenMenu(null)} />}
      {openMenu === 'notification' && <NotificationModal onClose={() => setOpenMenu(null)} />}
    </main>
  );
}
