import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/store/AuthProvider';
import { PortalProvider } from '@/components/shared/Portal';

export default function AuthGroupLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (session) return <Redirect href="/" />;

  return (
    <PortalProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PortalProvider>
  );
}
