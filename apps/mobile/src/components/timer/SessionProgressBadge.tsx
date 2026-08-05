import { StyleSheet, Text, View } from 'react-native';
import { formatSessionProgressLabel } from '@pomodash/shared';
import { useTimerStore } from '@/store/StoreProvider';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { CycleIndicator } from './CycleIndicator';

// CycleIndicator는 free 모드에서 스스로 숨으므로 여기서 별도 분기하지 않는다
export function SessionProgressBadge() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const mode = useTimerStore((s) => s.mode);
  const cycleCount = useTimerStore((s) => s.cycleCount);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);
  const accFocusSeconds = useTimerStore((s) => s.accFocusSeconds);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}>
        {formatSessionProgressLabel(mode, {
          cycleCount,
          totalCycles,
          focusSeconds: accFocusSeconds,
        })}
      </Text>
      <CycleIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    gap: 6,
  },
  label: {
    fontSize: 11,
  },
});
