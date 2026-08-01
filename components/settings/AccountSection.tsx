import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/supabase/actions';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  userEmail: string | null;
}

export function AccountSection({ userEmail }: Props) {
  if (!userEmail) {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">로그인이 필요해요</p>
        <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-foreground truncate">{userEmail}</p>
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm" className="gap-1.5">
          <LogOut className="w-3.5 h-3.5" />
          로그아웃
        </Button>
      </form>
    </div>
  );
}
