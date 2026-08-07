// Supabase는 카카오를 네이티브 ID 토큰 로그인으로 지원하지 않는다.
// 카카오 accessToken을 카카오 API로 직접 검증한 뒤, magic link 방식으로 세션을 발급하는 우회 경로다.
import { createClient } from 'npm:@supabase/supabase-js@2';

const SYNTHETIC_EMAIL_DOMAIN = 'users.pomodash.app';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405 });
  }

  const { accessToken } = await req.json().catch(() => ({ accessToken: null }));
  if (!accessToken || typeof accessToken !== 'string') {
    return new Response(JSON.stringify({ error: 'accessToken이 필요해요' }), { status: 400 });
  }

  const kakaoUserRes = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!kakaoUserRes.ok) {
    return new Response(JSON.stringify({ error: '카카오 토큰 검증에 실패했어요' }), {
      status: 401,
    });
  }
  const kakaoUser = await kakaoUserRes.json();
  const kakaoId = kakaoUser.id;
  if (!kakaoId) {
    return new Response(JSON.stringify({ error: '카카오 사용자 정보를 가져오지 못했어요' }), {
      status: 401,
    });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const email = `kakao_${kakaoId}@${SYNTHETIC_EMAIL_DOMAIN}`;

  // type: 'magiclink'는 계정이 없으면 새로 생성하고, 있으면 기존 계정으로 링크를 발급한다.
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { data: { kakao_id: String(kakaoId), provider: 'kakao' } },
  });

  if (error || !data.properties?.hashed_token) {
    return new Response(JSON.stringify({ error: '세션 발급에 실패했어요' }), { status: 500 });
  }

  // 신규 사용자는 magiclink로 요청해도 실제 발급 타입이 signup으로 내려온다.
  // verifyOtp는 실제 발급 타입과 일치해야 하므로 그대로 전달한다.
  return new Response(
    JSON.stringify({
      tokenHash: data.properties.hashed_token,
      verificationType: data.properties.verification_type,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
});
