import { Tabs } from 'expo-router/js-tabs';
import { BottomNav } from '@/components/BottomNav';

export default function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="journal" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
