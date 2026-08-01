'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/supabase/actions';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/shared/TextInput';
import { PasswordField } from '@/components/auth/PasswordField';
import type { AuthActionResult } from '@/types';

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const confirmFailed = searchParams.get('error') === 'confirm_failed';

  const [state, formAction, pending] = useActionState<AuthActionResult, FormData>(
    (_prev, formData) => login(formData),
    confirmFailed ? { error: '이메일 인증 확인에 실패했어요. 다시 시도해주세요' } : {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-xs font-medium text-muted-foreground">
          이메일
        </label>
        <TextInput
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
          className="w-full"
        />
      </div>

      <PasswordField
        id="login-password"
        name="password"
        label="비밀번호"
        autoComplete="current-password"
        required
        disabled={pending}
      />

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button
        type="submit"
        disabled={pending}
        variant="default"
        size="lg"
        className="w-full font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pending ? '로그인 중...' : '로그인'}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
