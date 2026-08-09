import { Redirect } from 'expo-router';
import AppTabs from '@/components/app-tabs';
import { StoreProvider } from '@/store/StoreProvider';
import { PortalProvider } from '@/components/shared/Portal';
import { Toaster } from '@/components/shared/Toast';
import { useAuth } from '@/store/AuthProvider';

export default function AppGroupLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Redirect href="/login" />;

  return (
    <StoreProvider>
      <PortalProvider>
        <AppTabs />
        <Toaster />
      </PortalProvider>
    </StoreProvider>
  );
}
