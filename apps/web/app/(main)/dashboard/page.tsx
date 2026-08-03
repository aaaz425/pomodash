import type { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/DashboardView';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <main id="main-content" className="flex-1 overflow-y-auto">
      <DashboardView />
    </main>
  );
}
