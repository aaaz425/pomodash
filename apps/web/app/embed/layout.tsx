import { StoreProvider } from '@/store/StoreProvider';
import { PageTransition } from '@/components/shared/layout/PageTransition';
import { AppToaster } from '@/components/shared/AppToaster';

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex flex-col h-dvh overflow-hidden bg-background">
        <PageTransition>{children}</PageTransition>
        <AppToaster />
      </div>
    </StoreProvider>
  );
}
