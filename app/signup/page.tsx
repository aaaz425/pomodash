import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { KakaoButton } from '@/components/auth/KakaoButton';
import { SignupForm } from '@/components/auth/SignupForm';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `회원가입 — ${siteConfig.name}`,
};

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/');
  }

  return (
    <AuthShell title="회원가입">
      <SignupForm />
      <AuthDivider />
      <KakaoButton />
    </AuthShell>
  );
}
