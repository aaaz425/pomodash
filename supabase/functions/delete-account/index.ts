// 회원탈퇴 — 이메일 계정은 비밀번호 재검증, 카카오 계정은 호출 전에 이미 카카오 재인증
// 라운드트립을 거쳤다는 전제로 별도 재검증 없이 진행한다.
// tasks/sessions/categories/settings는 전부 auth.users를 on delete cascade로 참조하므로
// admin.deleteUser() 한 번으로 관련 데이터가 다 같이 삭제된다(별도 정리 쿼리 불필요).
import { createClient } from 'npm:@supabase/supabase-js@2';

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
