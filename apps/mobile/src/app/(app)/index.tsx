import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHydrated } from '@/store/StoreProvider';
import { TimerRing } from '@/components/timer/TimerRing';
import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { TimerControls } from '@/components/timer/TimerControls';
import { FocusMode } from '@/components/timer/FocusMode';
import { SessionCompleteSheet } from '@/components/timer/SessionCompleteSheet';
import { AbandonedSessionDialog } from '@/components/timer/AbandonedSessionDialog';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { useCurrentTask } from '@/hooks/useCurrentTask';

export default function TimerScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const hydrated = useHydrated();
  const { task, category } = useCurrentTask();

  // AsyncStorage에서 진행 중이던 타이머 스냅샷을 불러오기 전엔 기본값(25:00 대기중)이
  // 잠깐 보였다가 실제 상태로 바뀌는 깜빡임이 생길 수 있어 hydrate 전까지는 렌더링을 미룬다.
  if (!hydrated) {
    return (
      <View style={[styles.root, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.mutedForeground} />
      </View>
    );
  }

  return (
    <>
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
            <View style={styles.taskRow} />
          )}

          <View style={styles.timerGroup}>
            <TimerRing />
            <CycleIndicator />
          </View>

          <TimerControls />
        </SafeAreaView>

        <SessionCompleteSheet />
        <FocusMode />
        <AbandonedSessionDialog />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  timerGroup: {
    alignItems: 'center',
    gap: 24,
  },
  taskRow: {
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
});
