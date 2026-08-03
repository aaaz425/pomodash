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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        본문으로 바로가기
      </a>
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
