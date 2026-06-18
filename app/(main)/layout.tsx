import { StoreProvider } from '@/store/StoreProvider';
import { Sidebar } from '@/components/shared/layout/Sidebar';
import { IconSidebar } from '@/components/shared/layout/IconSidebar';
import { TopBar } from '@/components/shared/layout/TopBar';
import { BottomNav } from '@/components/shared/layout/BottomNav';
import { MiniTimerWidget } from '@/components/timer/MiniTimerWidget';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex flex-col sm:flex-row h-screen overflow-hidden bg-background">
        <div className="sm:hidden">
          <TopBar />
        </div>
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
