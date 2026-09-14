import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';
import { AuthShell } from '@/components/auth/AuthShell';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `비밀번호 재설정 — ${siteConfig.name}`,
};

export default async function ResetPasswordPage() {
  // /auth/reset-confirm의 코드 교환에 성공해야 세션이 생김 — 링크 없이 직접 들어오면 user는 null
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <AuthShell title="새 비밀번호 설정">
      <ResetPasswordForm />
    </AuthShell>
  );
}
