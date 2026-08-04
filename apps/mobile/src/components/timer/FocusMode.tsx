import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Pause, Play, Square, X } from 'lucide-react-native';
import { useTimerStore } from '@/store/StoreProvider';
import { useTimer } from '@/hooks/useTimer';
import { useRotatingMessage } from '@/hooks/useRotatingMessage';
import { ThemeSchemeOverride } from '@/hooks/use-theme-scheme';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { MESSAGE_ROTATE_INTERVAL_MS, MOTIVATIONAL_MESSAGES } from '@/constants/messages';
import { TimerRing } from './TimerRing';
import { CycleIndicator } from './CycleIndicator';

// 웹처럼 시스템 설정과 무관하게 항상 dark 테마를 강제한다
const theme = THEME.dark;

export function FocusMode() {
  const isFocusMode = useTimerStore((s) => s.isFocusMode);
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const exitFocusMode = useTimerStore((s) => s.exitFocusMode);
  const endSession = useTimerStore((s) => s.endSession);
  const { cycleCount, mode } = useTimer();

  const message = useRotatingMessage(
    MOTIVATIONAL_MESSAGES,
    MESSAGE_ROTATE_INTERVAL_MS,
    isFocusMode,
  );

  return (
    <Modal visible={isFocusMode} animationType="fade" onRequestClose={exitFocusMode}>
      <ThemeSchemeOverride scheme="dark">
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Pressable onPress={exitFocusMode} style={styles.exitButton}>
            <X size={14} color={theme.mutedForeground} />
            <Text
              style={[
                styles.exitText,
                { color: theme.mutedForeground, fontFamily: FONTS.sansMedium },
              ]}
            >
              나가기
            </Text>
          </Pressable>

          <View style={styles.taskSection}>
            <Text
              style={[
                styles.taskEyebrow,
                { color: withAlpha(theme.mutedForeground, 0.6), fontFamily: FONTS.sansRegular },
              ]}
            >
              {mode === 'free' ? '자유 집중' : `${cycleCount + 1}번째 집중 세션`}
            </Text>
            <Text
              style={[
                styles.taskTitle,
                { color: withAlpha(theme.mutedForeground, 0.5), fontFamily: FONTS.sansSemiBold },
              ]}
            >
              작업 없음
            </Text>
          </View>

          <Text
            style={[
              styles.message,
              { color: withAlpha(theme.mutedForeground, 0.8), fontFamily: FONTS.sansRegular },
            ]}
          >
            {message}
          </Text>

          <TimerRing />
          <CycleIndicator />

          <View style={styles.controls}>
            <Pressable
              onPress={isRunning ? pause : start}
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            >
              {isRunning ? (
                <Pause size={14} color={theme.primaryForeground} fill={theme.primaryForeground} />
              ) : (
                <Play size={14} color={theme.primaryForeground} fill={theme.primaryForeground} />
              )}
              <Text
                style={[
                  styles.primaryText,
                  { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
                ]}
              >
                {isRunning ? '일시정지' : '시작'}
              </Text>
            </Pressable>

            <Pressable
              onPress={endSession}
              style={[styles.outlineButton, { borderColor: theme.border }]}
            >
              <Square size={14} color={theme.mutedForeground} fill={theme.mutedForeground} />
              <Text
                style={[
                  styles.outlineText,
                  { color: theme.mutedForeground, fontFamily: FONTS.sansMedium },
                ]}
              >
                세션종료
              </Text>
            </Pressable>
          </View>
        </View>
      </ThemeSchemeOverride>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 16,
  },
  exitButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  exitText: {
    fontSize: 14,
  },
  taskSection: {
    alignItems: 'center',
    gap: 8,
  },
  taskEyebrow: {
    fontSize: 14,
  },
  taskTitle: {
    fontSize: 20,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 320,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 14,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  outlineText: {
    fontSize: 14,
  },
});
