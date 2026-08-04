import { Redirect } from 'expo-router';
import AppTabs from '@/components/app-tabs';
import { StoreProvider } from '@/store/StoreProvider';
import { useAuth } from '@/store/AuthProvider';

export default function AppGroupLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Redirect href="/login" />;

  return (
    <StoreProvider>
      <AppTabs />
    </StoreProvider>
  );
}
