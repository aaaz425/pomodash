import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 화이트리스트 방식 — 새 라우트를 깜빡해 게이팅이 빠지는 사고를 막기 위해 "공개 경로만 나열"한다
const PUBLIC_PATHS = ['/landing', '/login', '/signup', '/privacy', '/terms', '/forgot-password'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/auth/');
}

export async function updateSession(request: NextRequest) {
  // env 미설정 시 게이팅 생략 — 서비스 전체가 먹통되는 것보다 로그인 강제가 풀리는 쪽이 낫다는 판단
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // createServerClient와 이 호출 사이에 다른 로직을 두면 세션 갱신이 깨질 수 있음
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    // 루트('/')는 랜딩부터 보여주고, 그 외 딥링크는 로그인 후 원래 경로로 복귀시킨다
    const redirectUrl =
      pathname === '/' ? new URL('/landing', request.url) : new URL('/login', request.url);
    if (pathname !== '/') {
      redirectUrl.searchParams.set('redirectTo', pathname + search);
    }
    const redirectResponse = NextResponse.redirect(redirectUrl);
    // getUser() 중 갱신된 세션 쿠키는 supabaseResponse에 담기므로, 리다이렉트 응답에도 옮겨야 유실되지 않음
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
