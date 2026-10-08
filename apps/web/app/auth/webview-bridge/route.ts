import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// RN WebView 최초 네비게이션(POST)으로 네이티브 세션을 받아 쿠키로 전환한다
// 1회성 전용 — 토큰은 로그에 남기지 않는다
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const accessToken = body?.access_token;
  const refreshToken = body?.refresh_token;

  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    return NextResponse.json({ error: 'session_failed' }, { status: 401 });
  }

  return NextResponse.redirect(new URL('/dashboard?embed=1', request.url), 303);
}
