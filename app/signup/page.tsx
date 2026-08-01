import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignupForm } from '@/components/auth/SignupForm';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `회원가입 — ${siteConfig.name}`,
};

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <AuthShell title="회원가입">
      <SignupForm />
    </AuthShell>
  );
}
