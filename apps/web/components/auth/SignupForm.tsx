'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { signup } from '@/lib/supabase/actions';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/shared/TextInput';
import { PasswordField } from '@/components/auth/PasswordField';
import { AUTH_LIMITS } from '@/lib/constants/limits';
import type { AuthActionResult } from '@/types';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [state, formAction, pending] = useActionState<AuthActionResult, FormData>(
    (_prev, formData) => signup(formData),
    {},
  );

  if (state.pendingConfirmation) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-foreground">이메일을 확인해주세요</h2>
          <p className="text-sm text-muted-foreground">
            {email}로 인증 메일을 보냈어요.
            <br />
            메일함(스팸함 포함)을 확인해주세요.
          </p>
        </div>
        <Link href="/login" className="text-sm text-primary font-medium hover:underline">
          로그인 페이지로
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-email" className="text-xs font-medium text-muted-foreground">
          이메일
        </label>
        <TextInput
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
      </div>

      <PasswordField
        id="signup-password"
        name="password"
        label={`비밀번호 (${AUTH_LIMITS.PASSWORD_MIN_LENGTH}자 이상)`}
        autoComplete="new-password"
        minLength={AUTH_LIMITS.PASSWORD_MIN_LENGTH}
        required
        disabled={pending}
      />

      <PasswordField
        id="signup-password-confirm"
        name="passwordConfirm"
        label="비밀번호 확인"
        autoComplete="new-password"
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
        {pending ? '가입 중...' : '가입하기'}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
