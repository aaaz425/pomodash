import { StyleSheet, Text, View } from 'react-native';
import { TIMER_LIMITS } from '@pomodash/shared';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { StepperInput } from './StepperInput';

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
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const rows = [
    {
      label: '집중',
      value: focusMinutes,
      onChange: onFocusMinutesChange,
      min: TIMER_LIMITS.FOCUS_MINUTES_MIN,
      max: TIMER_LIMITS.FOCUS_MINUTES_MAX,
      step: 5,
      unit: '분',
    },
    {
      label: cyclesLabel,
      value: totalCycles,
      onChange: onTotalCyclesChange,
      min: TIMER_LIMITS.CYCLES_MIN,
      max: TIMER_LIMITS.CYCLES_MAX,
      step: 1,
      unit: '회',
    },
    {
      label: '휴식',
      value: shortBreakMinutes,
      onChange: onShortBreakMinutesChange,
      min: TIMER_LIMITS.BREAK_MINUTES_MIN,
      max: TIMER_LIMITS.BREAK_MINUTES_MAX,
      step: 5,
      unit: '분',
    },
  ];

  return (
    <View style={styles.group}>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text
            style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
          >
            {row.label}
          </Text>
          <StepperInput
            value={row.value}
            onChange={row.onChange}
            min={row.min}
            max={row.max}
            step={row.step}
            unit={row.unit}
            disabled={disabled}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
});
