import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimerStore } from '@/store/StoreProvider';
import { TimerRing } from '@/components/timer/TimerRing';
import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { TimerControls } from '@/components/timer/TimerControls';
import { FocusMode } from '@/components/timer/FocusMode';
import { SessionCompleteSheet } from '@/components/timer/SessionCompleteSheet';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export default function TimerScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const focusMinutes = useTimerStore((s) => s.settings.focusMinutes);
  const shortBreakMinutes = useTimerStore((s) => s.settings.shortBreakMinutes);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);

  const settingsPills = [
    { value: `${focusMinutes}분`, label: '집중' },
    { value: `${shortBreakMinutes}분`, label: '휴식' },
    { value: `${totalCycles}회`, label: '사이클' },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* 현재 작업 — 이번 브랜치엔 작업 데이터가 없어 항상 미분류 상태로 표시 (rn-tasks에서 연결) */}
        <Text
          style={[
            styles.taskRow,
            { color: withAlpha(theme.mutedForeground, 0.5), fontFamily: FONTS.sansRegular },
          ]}
        >
          선택된 작업이 없습니다
        </Text>

        <TimerRing />

        <CycleIndicator />

        <View
          style={[styles.settingsPill, { borderColor: theme.border, backgroundColor: theme.card }]}
        >
          {settingsPills.map(({ value, label }, i) => (
            <View
              key={label}
              style={[
                styles.settingsCell,
                i > 0 && { borderLeftWidth: 1, borderLeftColor: theme.border },
              ]}
            >
              <Text
                style={[
                  styles.settingsValue,
                  { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
                ]}
              >
                {value}
              </Text>
              <Text
                style={[
                  styles.settingsLabel,
                  { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                ]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        <TimerControls />
      </SafeAreaView>

      <SessionCompleteSheet />
      <FocusMode />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  taskRow: {
    fontSize: 14,
    height: 20,
  },
  settingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
  },
  settingsCell: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  settingsValue: {
    fontSize: 14,
  },
  settingsLabel: {
    fontSize: 10,
  },
});
