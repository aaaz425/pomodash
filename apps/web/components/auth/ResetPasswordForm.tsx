'use client';

import { useActionState } from 'react';
import { updatePassword } from '@/lib/supabase/actions';
import { Button } from '@/components/ui/button';
import { PasswordField } from '@/components/auth/PasswordField';
import { AUTH_LIMITS } from '@/lib/constants/limits';
import type { AuthActionResult } from '@/types';

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthActionResult, FormData>(
    (_prev, formData) => updatePassword(formData),
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <PasswordField
        id="reset-password"
        name="password"
        label={`새 비밀번호 (${AUTH_LIMITS.PASSWORD_MIN_LENGTH}자 이상)`}
        autoComplete="new-password"
        minLength={AUTH_LIMITS.PASSWORD_MIN_LENGTH}
        required
        disabled={pending}
      />

      <PasswordField
        id="reset-password-confirm"
        name="passwordConfirm"
        label="새 비밀번호 확인"
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
        {pending ? '변경 중...' : '비밀번호 변경'}
      </Button>
    </form>
  );
}
