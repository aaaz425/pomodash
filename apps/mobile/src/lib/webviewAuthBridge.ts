import type { Session } from '@supabase/supabase-js';

export interface WebviewAuthBridgeSource {
  uri: string;
  method: 'POST';
  body: string;
  headers: { 'Content-Type': string };
}

// WebView 최초 네비게이션에 세션 토큰을 POST로 실어 보낸다 — 웹의 /auth/webview-bridge 라우트가
// setSession()으로 검증 후 쿠키를 세팅하므로, @supabase/ssr 쿠키 포맷을 직접 조립할 필요가 없다
export function buildWebviewAuthBridgeSource(
  webAppUrl: string,
  session: Session,
): WebviewAuthBridgeSource {
  return {
    uri: `${webAppUrl}/auth/webview-bridge`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    }),
  };
}
