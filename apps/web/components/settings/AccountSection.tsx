import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/supabase/actions';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  user: { email: string | null } | null;
}

export function AccountSection({ user }: Props) {
  if (!user) {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">로그인이 필요해요</p>
        <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          로그인
        </Link>
      </div>
    );
  }

  // 카카오 로그인은 이메일 동의 없이 가입될 수 있어 email이 없을 수 있다
  const label = user.email ?? '카카오 계정';

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-foreground truncate">{label}</p>
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm" className="gap-1.5">
          <LogOut className="w-3.5 h-3.5" />
          로그아웃
        </Button>
      </form>
    </div>
  );
}
