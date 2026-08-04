import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Maximize2, Pause, Play, Square } from 'lucide-react-native';
import { useTimerStore } from '@/store/StoreProvider';
import { StartSessionSheet } from '@/components/timer/StartSessionSheet';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export function TimerControls() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const sessionStarted = useTimerStore((s) => s.sessionStarted);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const enterFocusMode = useTimerStore((s) => s.enterFocusMode);
  const endSession = useTimerStore((s) => s.endSession);

  const [showStartSheet, setShowStartSheet] = useState(false);

  function handleStartPress() {
    if (isRunning) {
      pause();
      return;
    }
    if (!sessionStarted) {
      setShowStartSheet(true);
      return;
    }
    // 이미 세션이 시작된 상태의 재개는 시트를 다시 열지 않고 바로 재개 (웹의 sessionStarted 게이트와 동일)
    start();
  }

  return (
    <>
      <View style={styles.row}>
        <Pressable
          disabled={!isRunning}
          onPress={enterFocusMode}
          style={[
            styles.outlineButton,
            { borderColor: theme.border, backgroundColor: theme.background },
            !isRunning && styles.disabled,
          ]}
        >
          <Maximize2 size={14} color={theme.mutedForeground} />
          <Text
            style={[
              styles.outlineText,
              { color: theme.mutedForeground, fontFamily: FONTS.sansMedium },
            ]}
          >
            집중
          </Text>
        </Pressable>

        <Pressable
          onPress={handleStartPress}
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
          disabled={!sessionStarted}
          onPress={endSession}
          style={[
            styles.outlineButton,
            { borderColor: theme.border, backgroundColor: theme.background },
            !sessionStarted && styles.disabled,
          ]}
        >
          <Square size={14} color={theme.mutedForeground} fill={theme.mutedForeground} />
          <Text
            style={[
              styles.outlineText,
              { color: theme.mutedForeground, fontFamily: FONTS.sansMedium },
            ]}
          >
            세션 종료
          </Text>
        </Pressable>
      </View>
      <StartSessionSheet visible={showStartSheet} onClose={() => setShowStartSheet(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  outlineText: {
    fontSize: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
});
