import { useEffect } from 'react';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { TimerPhase } from '@pomodash/shared';
import { phaseGlowRgba, THEME } from '@/constants/timerColors';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  phase: TimerPhase;
  isNeutral: boolean;
}

// 웹은 sm/lg에서 더 커지지만(320→380→440px), 앱은 폰 화면 전용이라 모바일 사이즈만 사용
const SIZE = 320;

export function TimerGlow({ phase, isNeutral }: Props) {
  const scheme = useThemeScheme();
  const opacity = useSharedValue(isNeutral ? 0.3 : 0.5);

  useEffect(() => {
    if (isNeutral) {
      opacity.value = withTiming(0.3, { duration: 300 });
      return;
    }
    // 웹의 timer-glow-pulse(5s ease-in-out infinite, 50%↔100% + brightness(2))에 대응 —
    // RN은 filter: brightness()가 없어 opacity만으로 근사하는데, 그대로 1.0까지 올리면
    // 글로우가 정확히 시간/뱃지 텍스트 뒤에서 밝아져 폰 화면에서 텍스트 가독성을 해친다.
    // 웹보다 낮은 상한(0.65)으로 억제해 텍스트 대비를 확보한다.
    opacity.value = 0.5;
    opacity.value = withRepeat(
      withTiming(0.65, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [isNeutral, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const glowColor = isNeutral ? THEME[scheme].mutedForeground : phaseGlowRgba(phase, scheme);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: SIZE,
          height: SIZE,
          left: '50%',
          top: '50%',
          marginLeft: -SIZE / 2,
          marginTop: -SIZE / 2,
        },
        animatedStyle,
      ]}
    >
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={glowColor} stopOpacity={1} />
            <Stop offset="0.7" stopColor={glowColor} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2} fill="url(#glow)" />
      </Svg>
    </Animated.View>
  );
}
