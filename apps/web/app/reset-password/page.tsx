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
  // 재설정 링크를 거치지 않고 직접 들어온 경우(세션 없음) — /auth/reset-confirm이
  // 코드 교환에 성공해야 이 페이지에 도달할 세션이 생긴다.
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
