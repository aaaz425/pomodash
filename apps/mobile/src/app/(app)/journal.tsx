import { useAuth } from '@/store/AuthProvider';
import { GuestPrompt } from '@/components/shared/GuestPrompt';
import { EmbeddedWebScreen } from '@/components/webview/EmbeddedWebScreen';

export default function JournalScreen() {
  const { session } = useAuth();
  if (!session) return <GuestPrompt title="로그인하면 기록을 확인할 수 있어요" />;
  return <EmbeddedWebScreen path="/journal" />;
}
