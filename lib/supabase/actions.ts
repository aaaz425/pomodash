'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginCredentialsSchema, SignupCredentialsSchema } from '@/types/schemas';
import type { AuthActionResult } from '@/types';

function isValidRedirectTarget(value: FormDataEntryValue | null): value is string {
  // 오픈 리다이렉트 방지 — 같은 오리진의 경로만 허용.
  // 두 번째 문자가 '/' 또는 '\'면 브라우저가 스킴 상대 경로(//evil.com, /\evil.com)로 해석할 수 있어 함께 차단.
  if (typeof value !== 'string' || value[0] !== '/') return false;
  return value[1] !== '/' && value[1] !== '\\';
}

export async function login(formData: FormData): Promise<AuthActionResult> {
  const parsed = LoginCredentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '입력값을 확인해주세요' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.message === 'Email not confirmed') {
      return { error: '이메일 인증이 필요해요. 받은 메일함을 확인해주세요' };
    }
    if (error.status === 429) {
      return { error: '잠시 후 다시 시도해주세요' };
    }
    if (error.message === 'Invalid login credentials') {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다' };
    }
    return { error: '로그인에 실패했어요. 잠시 후 다시 시도해주세요' };
  }

  const redirectTarget = formData.get('redirectTo');
  redirect(isValidRedirectTarget(redirectTarget) ? redirectTarget : '/');
}

export async function signup(formData: FormData): Promise<AuthActionResult> {
  const parsed = SignupCredentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    passwordConfirm: formData.get('passwordConfirm'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '입력값을 확인해주세요' };
  }

  const origin = (await headers()).get('origin') ?? '';
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });

  if (error) {
    if (error.status === 429) {
      return { error: '잠시 후 다시 시도해주세요' };
    }
    return { error: '가입에 실패했어요. 잠시 후 다시 시도해주세요' };
  }

  // 이미 가입+인증된 이메일이면 Supabase는 에러 없이 identities가 빈 배열인 응답을 준다
  if (data.user && data.user.identities?.length === 0) {
    return { error: '이미 가입된 이메일이에요. 로그인해주세요' };
  }

  return { pendingConfirmation: true };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
