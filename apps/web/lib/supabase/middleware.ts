import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 화이트리스트 방식 — 여기 없는 경로는 전부 로그인 필요. 새 라우트를 깜빡하고
// 게이팅 안 되는 사고를 막기 위해 "보호 경로 나열" 대신 "공개 경로만 나열"한다.
const PUBLIC_PATHS = ['/landing', '/login', '/signup', '/privacy', '/terms', '/forgot-password'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/auth/');
}

export async function updateSession(request: NextRequest) {
  // Supabase 프로젝트 연결 전(.env.local 미설정)에는 그냥 통과시킨다(게이팅 생략) —
  // env 실수 하나로 서비스 전체가 먹통되는 것보다, 로그인 강제가 잠깐 풀리는 쪽이 낫다는 판단.
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
    // 루트('/')는 마케팅 랜딩을 못 보고 로그인부터 강제당하는 걸 막기 위해 랜딩으로,
    // 그 외 딥링크는 의도가 명확하므로 로그인 후 원래 경로로 복귀시킨다.
    const redirectUrl =
      pathname === '/' ? new URL('/landing', request.url) : new URL('/login', request.url);
    if (pathname !== '/') {
      redirectUrl.searchParams.set('redirectTo', pathname + search);
    }
    const redirectResponse = NextResponse.redirect(redirectUrl);
    // getUser() 도중 세션이 갱신됐다면 그 쿠키가 supabaseResponse에 담겨있는데,
    // 그냥 리다이렉트하면 이게 유실된다 — 리다이렉트 응답에도 옮겨줘야 함
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
