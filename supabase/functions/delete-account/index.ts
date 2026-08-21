// 회원탈퇴 — 이메일 계정은 비밀번호 재검증, 카카오 계정은 호출 전에 이미 카카오 재인증
// 라운드트립을 거쳤다는 전제로 별도 재검증 없이 진행한다. 다만 그 전제를 서버에서도
// 검증하기 위해 토큰 발급 시각(iat)이 최근인지 확인한다 (아래 KAKAO_TOKEN_FRESHNESS_SECONDS 참고).
// tasks/sessions/categories/settings는 전부 auth.users를 on delete cascade로 참조하므로
// admin.deleteUser() 한 번으로 관련 데이터가 다 같이 삭제된다(별도 정리 쿼리 불필요).
import { createClient } from 'npm:@supabase/supabase-js@2';

// 카카오 재인증 직후 발급된 토큰만 유효한 것으로 인정하는 기간 — 정상 플로우(재인증 후 바로
// 탈퇴 호출)는 몇 초 안에 끝나므로, 유출된 오래된 토큰으로 이 플로우를 우회하는 것만 막는다.
const KAKAO_TOKEN_FRESHNESS_SECONDS = 300;

function decodeJwtPayload(token: string): { iat?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: '인증이 필요해요' }), { status: 401 });
  }

  const { password } = await req.json().catch(() => ({ password: undefined }));

  // 호출자 본인 확인 — 호출자의 액세스 토큰을 그대로 실어서 getUser() 호출
  const supabaseAsCaller = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseAsCaller.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: '인증이 필요해요' }), { status: 401 });
  }

  const provider = user.user_metadata?.provider as string | undefined;

  if (provider !== 'kakao') {
    if (!password || typeof password !== 'string') {
      return new Response(JSON.stringify({ error: '비밀번호를 입력해주세요' }), { status: 400 });
    }
    const { error: verifyError } = await supabaseAsCaller.auth.signInWithPassword({
      email: user.email!,
      password,
    });
    if (verifyError) {
      return new Response(JSON.stringify({ error: '비밀번호가 올바르지 않아요' }), {
        status: 400,
      });
    }
  } else {
    // getUser()는 토큰의 진위만 검증하고 발급 시점은 안 봐서, 이미 신뢰된 토큰에서
    // iat 클레임만 추가로 읽어 "방금 재인증했다"는 전제를 서버에서도 확인한다.
    const payload = decodeJwtPayload(authHeader.replace(/^Bearer\s+/i, ''));
    const issuedAt = payload?.iat;
    if (!issuedAt || Date.now() / 1000 - issuedAt > KAKAO_TOKEN_FRESHNESS_SECONDS) {
      return new Response(JSON.stringify({ error: '보안을 위해 카카오 로그인을 다시 해주세요' }), {
        status: 401,
      });
    }
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return new Response(JSON.stringify({ error: '탈퇴 처리에 실패했어요' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
