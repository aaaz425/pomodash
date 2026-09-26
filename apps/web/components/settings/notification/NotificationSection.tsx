'use client';

import { BrowserNotificationRow } from '@/components/settings/notification/BrowserNotificationRow';
import { KeepScreenAwakeRow } from '@/components/settings/notification/KeepScreenAwakeRow';
import { SoundAlertSettings } from '@/components/settings/notification/SoundAlertSettings';

export function NotificationSection() {
  return (
    <div className="flex flex-col gap-5">
      <BrowserNotificationRow />
      <KeepScreenAwakeRow />
      <SoundAlertSettings />
    </div>
  );
}
