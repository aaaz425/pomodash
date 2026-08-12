import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';
import { AuthShell } from '@/components/auth/AuthShell';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `비밀번호 찾기 — ${siteConfig.name}`,
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/');
  }

  return (
    <AuthShell title="비밀번호 찾기">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
