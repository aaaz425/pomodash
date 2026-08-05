import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/store/AuthProvider';

SplashScreen.preventAutoHideAsync();

// 인증 상태 확인이 끝나기 전엔 스플래시를 계속 띄워둔다 — AnimatedSplashOverlay가
// 자기 onLayout에서 SplashScreen.hideAsync()를 호출하므로, 로그인 화면인지 앱 화면인지
// 정해지기 전에 먼저 마운트되면 안 됨(깜빡임 방지).
function RootContent() {
  const { loading } = useAuth();
  if (loading) return null;

  return (
    <>
      <AnimatedSplashOverlay />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('@/assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.ttf'),
    'GeistMono-Regular': require('@/assets/fonts/GeistMono-Regular.ttf'),
    'GeistMono-SemiBold': require('@/assets/fonts/GeistMono-SemiBold.ttf'),
    'GeistMono-Bold': require('@/assets/fonts/GeistMono-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* expo-router가 자동으로 감싸는 SafeAreaProvider는 네이티브에서 initialMetrics를
          안 넘겨서 콜드 스타트 시 insets가 0으로 시작했다가 비동기로 갱신됨 — 그 갱신
          타이밍이 앱 켜고 첫 모달을 열고 닫는 시점과 겹치면 시트 padding이 한 번 더 튀어
          깜빡이는 문제가 있었음(실측 확인). initialWindowMetrics(네이티브 부트스트랩 시점
          스냅샷)로 한 번 더 감싸서 첫 렌더부터 정확한 값이 잡히게 한다. */}
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthProvider>
            <RootContent />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
