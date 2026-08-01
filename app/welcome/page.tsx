import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/supabase/server';
import { AuthShell } from '@/components/auth/AuthShell';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `환영해요 — ${siteConfig.name}`,
};

export default async function WelcomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
          <CheckCircle2 className="w-7 h-7 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-foreground">이메일 인증이 완료됐어요</h1>
          <p className="text-sm text-muted-foreground">
            환영해요! 이제 Pomodash를 시작할 수 있어요.
          </p>
        </div>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'w-full font-semibold')}
        >
          시작하기
        </Link>
      </div>
    </AuthShell>
  );
}
