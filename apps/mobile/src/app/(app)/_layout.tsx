import AppTabs from '@/components/app-tabs';
import { StoreProvider } from '@/store/StoreProvider';
import { PortalProvider, Portal } from '@/components/shared/Portal';
import { Toaster } from '@/components/shared/Toast';
import { MiniTimerWidget } from '@/components/timer/MiniTimerWidget';
import { TimerEngine } from '@/components/timer/TimerEngine';
import { useAuth } from '@/store/AuthProvider';

export default function AppGroupLayout() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <StoreProvider>
      <PortalProvider>
        <AppTabs />
        <Portal>
          <MiniTimerWidget />
        </Portal>
        <TimerEngine />
        <Toaster />
      </PortalProvider>
    </StoreProvider>
  );
}
