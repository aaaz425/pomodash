'use client';

import { useSettingsStore } from '@/store/StoreProvider';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';

export function TimerDefaultsSection() {
  const defaultTimerSettings = useSettingsStore((s) => s.defaultTimerSettings);
  const setTimerDefaults = useSettingsStore((s) => s.setTimerDefaults);

  return (
    <TimerSettingsGroup
      focusMinutes={defaultTimerSettings.focusMinutes}
      onFocusMinutesChange={(v) => setTimerDefaults({ ...defaultTimerSettings, focusMinutes: v })}
      totalCycles={defaultTimerSettings.totalCycles}
      onTotalCyclesChange={(v) => setTimerDefaults({ ...defaultTimerSettings, totalCycles: v })}
      shortBreakMinutes={defaultTimerSettings.shortBreakMinutes}
      onShortBreakMinutesChange={(v) =>
        setTimerDefaults({ ...defaultTimerSettings, shortBreakMinutes: v })
      }
    />
  );
}
