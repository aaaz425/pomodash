import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTimerStore } from '@/store/StoreProvider';
import { useTimer } from '@/hooks/useTimer';
import { phaseBadge, THEME } from '@/constants/timerColors';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

function Dot({
  filled,
  pulsing,
  borderColor,
  dotColor,
}: {
  filled: boolean;
  pulsing: boolean;
  borderColor: string;
  dotColor: string;
}) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!pulsing) {
      opacity.value = 1;
      return;
    }
    // 웹의 Tailwind animate-pulse(2s cubic-bezier, 1↔0.5)에 대응
    opacity.value = withRepeat(
      withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
  }, [pulsing, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.dot,
        filled ? { backgroundColor: dotColor } : { borderWidth: 1.5, borderColor },
        animatedStyle,
      ]}
    />
  );
}

export function CycleIndicator() {
  const scheme = useThemeScheme();
  const { phase, mode } = useTimer();
  const cycleCount = useTimerStore((s) => s.cycleCount);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);

  if (mode === 'free') return null; // 자유 모드는 고정 사이클이 없음

  const dotColor = phaseBadge('focus', scheme).dot;

  return (
    <View style={styles.row}>
      {Array.from({ length: totalCycles }).map((_, i) => {
        const isCompleted = i < cycleCount;
        const isCurrent = !isCompleted && i === cycleCount && phase === 'focus';

        return (
          <Dot
            key={i}
            filled={isCompleted || isCurrent}
            pulsing={isCurrent}
            borderColor={THEME[scheme].border}
            dotColor={dotColor}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
