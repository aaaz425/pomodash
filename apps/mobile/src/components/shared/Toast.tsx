import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { subscribeToast } from '@/lib/toast';
import { Portal } from './Portal';

// 웹 AppToaster(sonner, position="top-center") 대응 — 화면 상단에 잠깐 떴다 사라짐
export function Toaster() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => subscribeToast(setMessage), []);

  if (!message) return null;

  return (
    <Portal>
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutUp}
        pointerEvents="none"
        style={[
          styles.container,
          { top: insets.top + 12, backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.text, { color: theme.foreground, fontFamily: FONTS.sansMedium }]}>
          {message}
        </Text>
      </Animated.View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
