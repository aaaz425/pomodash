import { Tabs } from 'expo-router/js-tabs';
import { BottomNav } from '@/components/BottomNav';
import { THEME } from '@/constants/timerColors';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export default function AppTabs() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      // 비활성 탭 detach/freeze가 애니메이션과 겹치면 재방문 시 콘텐츠가 안 그려지는
      // 문제가 있어 둘 다 끔(실측 확인) — 탭 4개짜리 앱이라 비용은 무시할 만함
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        // 전환 중 씬 배경이 네이티브 기본값(흰색)으로 잠깐 보이는 것 방지
        sceneStyle: { backgroundColor: theme.background },
        freezeOnBlur: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="journal" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
