'use client';

import { Bell, Volume2, Play } from 'lucide-react';
import { useSettingsStore } from '@/store/StoreProvider';
import { playAlarm } from '@/lib/notifications';
import { SOUND_TYPE_LABELS, type SoundType } from '@/types';
import { StepperInput } from '@/components/shared/StepperInput';

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
  const soundType = useSettingsStore((s) => s.soundType);
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const soundRepeatCount = useSettingsStore((s) => s.soundRepeatCount);
  const setBrowserNotification = useSettingsStore((s) => s.setBrowserNotification);
  const setSoundAlert = useSettingsStore((s) => s.setSoundAlert);
  const setSoundType = useSettingsStore((s) => s.setSoundType);
  const setSoundVolume = useSettingsStore((s) => s.setSoundVolume);
  const setSoundRepeatCount = useSettingsStore((s) => s.setSoundRepeatCount);

  async function handleBrowserNotification(enabled: boolean) {
    if (enabled && typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
    }
    setBrowserNotification(enabled);
  }

  function handlePreview() {
    playAlarm({ type: soundType, volume: soundVolume, repeatCount: soundRepeatCount });
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

      <fieldset
        disabled={!soundAlert}
        className={`flex flex-col gap-4 pl-7 m-0 p-0 border-0 transition-opacity ${
          soundAlert ? '' : 'opacity-40 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="sound-type" className="text-sm text-foreground shrink-0">
            소리 종류
          </label>
          <div className="flex items-center gap-2">
            <select
              id="sound-type"
              value={soundType}
              onChange={(e) => setSoundType(e.target.value as SoundType)}
              className="text-sm bg-muted border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed"
            >
              {Object.entries(SOUND_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handlePreview}
              aria-label="미리 듣기"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:cursor-not-allowed shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sound-volume" className="text-sm text-foreground shrink-0 w-16">
            음량
          </label>
          <input
            id="sound-volume"
            type="range"
            min={0}
            max={100}
            step={5}
            value={soundVolume}
            onChange={(e) => setSoundVolume(Number(e.target.value))}
            className="flex-1 accent-primary disabled:cursor-not-allowed"
          />
          <span className="text-xs text-muted-foreground w-8 text-right shrink-0">
            {soundVolume}%
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-foreground shrink-0">반복 횟수</span>
          <StepperInput
            value={soundRepeatCount}
            onChange={setSoundRepeatCount}
            min={1}
            max={5}
            unit="회"
          />
        </div>
      </fieldset>
    </div>
  );
}
