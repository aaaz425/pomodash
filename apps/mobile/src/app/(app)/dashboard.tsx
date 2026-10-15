import { useAuth } from '@/store/AuthProvider';
import { GuestPrompt } from '@/components/shared/GuestPrompt';
import { EmbeddedWebScreen } from '@/components/webview/EmbeddedWebScreen';

export default function DashboardScreen() {
  const { session } = useAuth();
  if (!session) return <GuestPrompt title="로그인하면 통계를 확인할 수 있어요" />;
  return <EmbeddedWebScreen path="/dashboard" />;
}
