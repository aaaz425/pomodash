'use client';

import { StepperInput } from '@/components/shared/StepperInput';

interface Props {
  focusMinutes: number;
  onFocusMinutesChange: (v: number) => void;
  totalCycles: number;
  onTotalCyclesChange: (v: number) => void;
  shortBreakMinutes: number;
  onShortBreakMinutesChange: (v: number) => void;
  cyclesLabel?: string;
}

export function TimerSettingsGroup({
  focusMinutes,
  onFocusMinutesChange,
  totalCycles,
  onTotalCyclesChange,
  shortBreakMinutes,
  onShortBreakMinutesChange,
  cyclesLabel = '횟수',
}: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">집중</span>
        <StepperInput
          value={focusMinutes}
          onChange={onFocusMinutesChange}
          min={5}
          max={120}
          step={5}
          unit="분"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{cyclesLabel}</span>
        <StepperInput
          value={totalCycles}
          onChange={onTotalCyclesChange}
          min={1}
          max={20}
          unit="회"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">휴식</span>
        <StepperInput
          value={shortBreakMinutes}
          onChange={onShortBreakMinutesChange}
          min={0}
          max={60}
          step={5}
          unit="분"
        />
      </div>
    </div>
  );
}
