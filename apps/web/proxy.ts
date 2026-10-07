import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { isEmbedParam } from '@/lib/embed';

// RN WebView가 로드하는 경로만 — (main)/layout.tsx의 정적 생성을 건드리지 않기 위해
// /embed/* 라우트로 내부 rewrite한다. 브라우저/WebView에 보이는 URL은 그대로 유지된다.
const EMBED_ROUTES = ['/dashboard', '/journal'];

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  const { pathname, search } = request.nextUrl;
  const isRedirect = response.status >= 300 && response.status < 400;
  if (
    !isRedirect &&
    EMBED_ROUTES.includes(pathname) &&
    isEmbedParam(request.nextUrl.searchParams.get('embed'))
  ) {
    const rewriteUrl = new URL(`/embed${pathname}${search}`, request.url);
    const rewriteResponse = NextResponse.rewrite(rewriteUrl);
    response.cookies.getAll().forEach((cookie) => rewriteResponse.cookies.set(cookie));
    return rewriteResponse;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-touch-icon.png|manifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
