'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logout, deleteAccountWithPassword, loginWithKakao } from '@/lib/supabase/actions';
import { Button, buttonVariants } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { PasswordField } from '@/components/auth/PasswordField';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { cn } from '@/lib/utils';
import { STORAGE_KEYS } from '@/types';
import type { AuthActionResult } from '@/types';

interface Props {
  user: { email: string | null; provider: string | null } | null;
}

export function AccountSection({ user }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [state, formAction, pending] = useActionState<AuthActionResult, FormData>(
    (_prev, formData) => deleteAccountWithPassword(formData),
    {},
  );

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
  const isKakao = user.provider === 'kakao';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-foreground truncate">{label}</p>
        <form
          action={logout}
          onSubmit={() => {
            // 다음 사용자가 같은 브라우저에서 로그인/가입했을 때 남의 진행 중 타이머가
            // 뜨는 걸 막기 위해, 계정과 무관하게 저장되는 activeTimer를 로그아웃 시 정리한다
            localStorage.removeItem(STORAGE_KEYS.activeTimer);
          }}
        >
          <Button type="submit" variant="outline" size="sm" className="gap-1.5">
            <LogOut className="w-3.5 h-3.5" />
            로그아웃
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setShowPasswordChange((v) => !v)}
          className="text-xs text-muted-foreground hover:underline"
        >
          {isKakao ? '비밀번호 설정' : '비밀번호 변경'}
        </button>
        {!verifying && (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="text-xs text-destructive hover:underline"
          >
            회원탈퇴
          </button>
        )}
      </div>

      {showPasswordChange && (
        <div className="rounded-lg border border-border p-4">
          <ResetPasswordForm />
        </div>
      )}

      {verifying &&
        (isKakao ? (
          <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">
              카카오 계정 확인이 필요해요. 카카오로 다시 인증하면 탈퇴가 진행돼요.
            </p>
            <div className="flex gap-2">
              <form action={loginWithKakao}>
                <input type="hidden" name="redirectTo" value="/settings?confirmDelete=1" />
                <Button type="submit" variant="destructive" size="sm">
                  카카오로 확인하고 탈퇴
                </Button>
              </form>
              <Button type="button" variant="outline" size="sm" onClick={() => setVerifying(false)}>
                취소
              </Button>
            </div>
          </div>
        ) : (
          <form
            action={formAction}
            className="flex flex-col gap-3 rounded-lg border border-border p-4"
          >
            <p className="text-sm text-muted-foreground">
              본인 확인을 위해 비밀번호를 입력해주세요.
            </p>
            <PasswordField
              id="delete-account-password"
              name="password"
              label="비밀번호"
              autoComplete="current-password"
              required
              disabled={pending}
            />
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            <div className="flex gap-2">
              <Button type="submit" variant="destructive" size="sm" disabled={pending}>
                {pending ? '탈퇴 중...' : '탈퇴하기'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setVerifying(false)}>
                취소
              </Button>
            </div>
          </form>
        ))}

      <ConfirmDialog
        open={confirmOpen}
        title="정말 탈퇴하시겠어요?"
        description="모든 작업, 세션 기록, 설정이 영구 삭제되며 복구할 수 없어요."
        confirmLabel="탈퇴 계속하기"
        onConfirm={() => {
          setConfirmOpen(false);
          setVerifying(true);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
