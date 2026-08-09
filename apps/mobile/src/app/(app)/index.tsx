import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimerStore } from '@/store/StoreProvider';
import { TimerRing } from '@/components/timer/TimerRing';
import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { TimerControls } from '@/components/timer/TimerControls';
import { FocusMode } from '@/components/timer/FocusMode';
import { SessionCompleteSheet } from '@/components/timer/SessionCompleteSheet';
import { AbandonedSessionDialog } from '@/components/timer/AbandonedSessionDialog';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { ThemeSchemeOverride } from '@/hooks/use-theme-scheme';
import { useCurrentTask } from '@/hooks/useCurrentTask';

// 웹처럼 시스템 설정과 무관하게 항상 dark 테마를 강제한다 (PHASE_BADGE 등
// 타이머 관련 상수가 dark 배경 기준으로만 튜닝돼 있어 라이트 테마에서 가독성이 떨어짐)
const theme = THEME.dark;

export default function TimerScreen() {
  const { task, category } = useCurrentTask();

  const focusMinutes = useTimerStore((s) => s.settings.focusMinutes);
  const shortBreakMinutes = useTimerStore((s) => s.settings.shortBreakMinutes);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);

  const settingsPills = [
    { value: `${focusMinutes}분`, label: '집중' },
    { value: `${shortBreakMinutes}분`, label: '휴식' },
    { value: `${totalCycles}회`, label: '사이클' },
  ];

  return (
    <ThemeSchemeOverride scheme="dark">
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          {/* 현재 작업 */}
          {task ? (
            <View style={styles.taskRowFilled}>
              {category && <CategoryBadge category={category} />}
              <Text
                style={[
                  styles.taskTitle,
                  { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                ]}
              >
                {task.title}
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.taskRow,
                { color: withAlpha(theme.mutedForeground, 0.5), fontFamily: FONTS.sansRegular },
              ]}
            >
              선택된 작업이 없습니다
            </Text>
          )}

          <TimerRing />

          <CycleIndicator />

          <View
            style={[
              styles.settingsPill,
              { borderColor: theme.border, backgroundColor: theme.card },
            ]}
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
        <AbandonedSessionDialog />
      </View>
    </ThemeSchemeOverride>
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
  taskRowFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 20,
  },
  taskTitle: {
    fontSize: 14,
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
