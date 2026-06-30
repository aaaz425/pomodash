'use client';

import { StepperInput } from '@/components/shared/StepperInput';
import { TIMER_LIMITS } from '@/lib/constants/limits';

interface Props {
  focusMinutes: number;
  onFocusMinutesChange: (v: number) => void;
  totalCycles: number;
  onTotalCyclesChange: (v: number) => void;
  shortBreakMinutes: number;
  onShortBreakMinutesChange: (v: number) => void;
  cyclesLabel?: string;
  disabled?: boolean;
}

export function TimerSettingsGroup({
  focusMinutes,
  onFocusMinutesChange,
  totalCycles,
  onTotalCyclesChange,
  shortBreakMinutes,
  onShortBreakMinutesChange,
  cyclesLabel = '횟수',
  disabled = false,
}: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">집중</span>
        <StepperInput
          value={focusMinutes}
          onChange={onFocusMinutesChange}
          min={TIMER_LIMITS.FOCUS_MINUTES_MIN}
          max={TIMER_LIMITS.FOCUS_MINUTES_MAX}
          step={5}
          unit="분"
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{cyclesLabel}</span>
        <StepperInput
          value={totalCycles}
          onChange={onTotalCyclesChange}
          min={TIMER_LIMITS.CYCLES_MIN}
          max={TIMER_LIMITS.CYCLES_MAX}
          unit="회"
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">휴식</span>
        <StepperInput
          value={shortBreakMinutes}
          onChange={onShortBreakMinutesChange}
          min={TIMER_LIMITS.BREAK_MINUTES_MIN}
          max={TIMER_LIMITS.BREAK_MINUTES_MAX}
          step={5}
          unit="분"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
