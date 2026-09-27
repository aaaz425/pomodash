import { useEffect } from 'react';
import { type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { THEME } from '@/constants/timerColors';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 14, borderRadius = 6, style }: Props) {
  const scheme = useThemeScheme();
  const reducedMotion = useReducedMotion();
  const theme = THEME[scheme];
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = withTiming(0.75, { duration: 300 });
      return;
    }
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: theme.muted }, animatedStyle, style]}
    />
  );
}
