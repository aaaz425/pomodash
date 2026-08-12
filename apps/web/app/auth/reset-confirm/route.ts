import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 비밀번호 재설정 전용 콜백 — auth/confirm/route.ts의 첫가입 판별 로직과는 무관하다.
// 재설정은 항상 기존 계정이라 그 로직이 안 맞고, 섞이면 오히려 헷갈린다.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/reset-password`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
