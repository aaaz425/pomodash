'use client';

import type { ReactNode } from 'react';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { ThemeSection } from '@/components/settings/ThemeSection';
import { TimerDefaultsSection } from '@/components/settings/TimerDefaultsSection';
import { CategorySection } from '@/components/settings/CategorySection';
import { MotivationalSection } from '@/components/settings/MotivationalSection';
import { NotificationSection } from '@/components/settings/NotificationSection';
import { InstallSection } from '@/components/settings/InstallSection';
import { AboutSection } from '@/components/settings/AboutSection';

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
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 pt-8 sm:px-8 sm:pt-10 flex flex-col gap-6 pb-24 standalone:pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-10">
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

        <SettingCard title="타이머 기본값">
          <TimerDefaultsSection />
        </SettingCard>

        <SettingCard title="카테고리 관리">
          <CategorySection />
        </SettingCard>

        <SettingCard title="동기부여 메시지">
          <MotivationalSection />
        </SettingCard>

        <SettingCard title="알림">
          <NotificationSection />
        </SettingCard>

        <SettingCard title="앱 설치">
          <InstallSection />
        </SettingCard>

        <SettingCard title="앱 정보">
          <AboutSection />
        </SettingCard>
      </div>
    </main>
  );
}
