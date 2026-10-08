import type { Session } from '@supabase/supabase-js';

export interface WebviewAuthBridgeSource {
  uri: string;
  method: 'POST';
  body: string;
  headers: { 'Content-Type': string };
}

export function buildWebviewAuthBridgeSource(
  webAppUrl: string,
  session: Session,
  redirectTo = '/dashboard?embed=1',
): WebviewAuthBridgeSource {
  return {
    uri: `${webAppUrl}/auth/webview-bridge`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      redirect_to: redirectTo,
    }),
  };
}
