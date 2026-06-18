'use client';

import { Bell, Volume2 } from 'lucide-react';
import { useSettingsStore } from '@/store/StoreProvider';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-muted-foreground/30'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function NotificationSection() {
  const browserNotification = useSettingsStore((s) => s.browserNotification);
  const soundAlert = useSettingsStore((s) => s.soundAlert);
  const setBrowserNotification = useSettingsStore((s) => s.setBrowserNotification);
  const setSoundAlert = useSettingsStore((s) => s.setSoundAlert);

  async function handleBrowserNotification(enabled: boolean) {
    if (enabled && typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
    }
    setBrowserNotification(enabled);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Bell className="w-4 h-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm text-foreground">브라우저 알림</p>
            <p className="text-xs text-muted-foreground mt-0.5">타이머 종료 시 알림 표시</p>
          </div>
        </div>
        <Toggle checked={browserNotification} onChange={handleBrowserNotification} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm text-foreground">소리 알림</p>
            <p className="text-xs text-muted-foreground mt-0.5">타이머 종료 시 소리 재생</p>
          </div>
        </div>
        <Toggle checked={soundAlert} onChange={setSoundAlert} />
      </div>
    </div>
  );
}
