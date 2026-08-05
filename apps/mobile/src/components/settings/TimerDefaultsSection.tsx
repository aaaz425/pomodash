import { useSettingsStore } from '@/store/StoreProvider';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';

export function TimerDefaultsSection() {
  const defaultTimerSettings = useSettingsStore((s) => s.defaultTimerSettings);
  const setTimerDefaults = useSettingsStore((s) => s.setTimerDefaults);

  return (
    <TimerSettingsGroup
      focusMinutes={defaultTimerSettings.focusMinutes}
      onFocusMinutesChange={(v) =>
        void setTimerDefaults({ ...defaultTimerSettings, focusMinutes: v })
      }
      totalCycles={defaultTimerSettings.totalCycles}
      onTotalCyclesChange={(v) =>
        void setTimerDefaults({ ...defaultTimerSettings, totalCycles: v })
      }
      shortBreakMinutes={defaultTimerSettings.shortBreakMinutes}
      onShortBreakMinutesChange={(v) =>
        void setTimerDefaults({ ...defaultTimerSettings, shortBreakMinutes: v })
      }
    />
  );
}
