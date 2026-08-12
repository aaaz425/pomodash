'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { requestPasswordReset } from '@/lib/supabase/actions';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/shared/TextInput';
import type { AuthActionResult } from '@/types';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [state, formAction, pending] = useActionState<AuthActionResult, FormData>(
    (_prev, formData) => requestPasswordReset(formData),
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
            {email}로 비밀번호 재설정 링크를 보냈어요.
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
        <label htmlFor="forgot-email" className="text-xs font-medium text-muted-foreground">
          이메일
        </label>
        <TextInput
          id="forgot-email"
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

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button
        type="submit"
        disabled={pending}
        variant="default"
        size="lg"
        className="w-full font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pending ? '전송 중...' : '재설정 링크 보내기'}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        <Link href="/login" className="text-primary font-medium hover:underline">
          로그인 페이지로 돌아가기
        </Link>
      </p>
    </form>
  );
}
