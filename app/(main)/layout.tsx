import { StoreProvider } from '@/store/StoreProvider';
import { Sidebar } from '@/components/shared/layout/Sidebar';
import { IconSidebar } from '@/components/shared/layout/IconSidebar';
import { BottomNav } from '@/components/shared/layout/BottomNav';
import { MiniTimerWidget } from '@/components/timer/MiniTimerWidget';
import { AbandonedSessionDialog } from '@/components/timer/AbandonedSessionDialog';
import { AppToaster } from '@/components/shared/AppToaster';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex flex-col sm:flex-row h-dvh standalone:h-full overflow-hidden bg-background pt-[env(safe-area-inset-top)] sm:pt-0">
        <div className="hidden sm:block lg:hidden">
          <IconSidebar />
        </div>
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {children}

        <BottomNav />
        <MiniTimerWidget />
        <AbandonedSessionDialog />
        <AppToaster />
      </div>
    </StoreProvider>
  );
}
