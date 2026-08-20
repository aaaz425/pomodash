// 로그인/가입 실패 메시지를 더 정확하게 보여주기 위한 조회 전용 함수.
// signUp()이 "이미 가입된 이메일" 응답을 줄 때 보안상 기존 계정의 메타데이터를 채워주지 않아서,
// service_role로 직접 조회해야 provider(kakao 등)를 알 수 있다. generateLink는 실제 메일을
// 보내지 않고 계정 존재 여부+메타데이터만 확인하는 용도로 쓴다.
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405 });
  }

  const { email } = await req.json().catch(() => ({ email: null }));
  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({ error: 'email이 필요해요' }), { status: 400 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // 인증 없이 호출 가능한 엔드포인트라 이메일 나열 공격에 노출됨 — IP당 요청 빈도를 제한한다.
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const { data: allowed } = await supabaseAdmin.rpc('check_and_record_email_rate_limit', {
    p_ip: ip,
    p_limit: 8,
    p_window_seconds: 600,
  });
  if (!allowed) {
    return new Response(JSON.stringify({ error: '잠시 후 다시 시도해주세요' }), { status: 429 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
  });

  // 존재하지 않는 이메일이면 에러를 준다 — 계정 없음으로 처리
  if (error || !data.user) {
    return new Response(JSON.stringify({ exists: false, provider: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      exists: true,
      provider: (data.user.user_metadata?.provider as string | undefined) ?? null,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
});
