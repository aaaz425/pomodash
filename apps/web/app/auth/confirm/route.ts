import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidRedirectTarget } from '@/lib/supabase/redirect';

// auth.users 행 자체가 방금(이 오차 이내) 생성됐으면 진짜 신규가입으로 본다.
// 카카오(로그인/가입이 이 라우트를 공유)의 첫 가입 여부 판별에만 쓴다 — 이메일 인증은 사람이
// 메일함을 열고 링크를 누르기까지 시간이 걸려서 next 유무로 먼저 걸러낸다(아래 참고).
// last_sign_in_at은 안 쓴다 — 기존 계정에 카카오 identity가 새로 연결되는 경우(계정 자체는
// 오래됐지만 이 로그인수단으론 처음) last_sign_in_at 갱신 타이밍에 기대면 오판할 수 있어서,
// 계정이 실제로 방금 생성됐는지(=진짜 신규가입인지)만 본다.
const FIRST_SIGN_IN_TOLERANCE_MS = 5000;

function isFirstSignIn(user: { created_at: string }): boolean {
  const createdAt = new Date(user.created_at).getTime();
  return Date.now() - createdAt < FIRST_SIGN_IN_TOLERANCE_MS;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // next가 없으면 이메일 인증 링크다 — 코드가 1회용이라 교환에 성공했다는 것 자체가
      // 곧 첫 가입 확정이므로(재사용 시 코드 만료 에러) 무조건 /welcome.
      // next가 있으면 카카오(로그인/가입 공용 라우트) — 첫 가입일 때만 /welcome, 재로그인은 next로.
      const destination = !next
        ? '/welcome'
        : isFirstSignIn(data.user)
          ? '/welcome'
          : isValidRedirectTarget(next)
            ? next
            : '/';
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
