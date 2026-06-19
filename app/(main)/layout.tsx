import { StoreProvider } from '@/store/StoreProvider';
import { Sidebar } from '@/components/shared/layout/Sidebar';
import { IconSidebar } from '@/components/shared/layout/IconSidebar';
import { BottomNav } from '@/components/shared/layout/BottomNav';
import { MiniTimerWidget } from '@/components/timer/MiniTimerWidget';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex flex-col sm:flex-row h-[100dvh] overflow-hidden bg-background pt-[env(safe-area-inset-top)] sm:pt-0">
        <div className="hidden sm:block lg:hidden">
          <IconSidebar />
        </div>
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {children}

        <BottomNav />
        <MiniTimerWidget />
      </div>
    </StoreProvider>
  );
}
