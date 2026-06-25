'use client';

import { BrowserNotificationRow } from './BrowserNotificationRow';
import { SoundAlertSettings } from './SoundAlertSettings';

export function NotificationSection() {
  return (
    <div className="flex flex-col gap-5">
      <BrowserNotificationRow />
      <SoundAlertSettings />
    </div>
  );
}
