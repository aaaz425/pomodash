import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { LargeSecureStore } from '@/lib/supabase/secureStore';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    // RN엔 window.location이 없어 웹처럼 URL에서 세션을 읽을 수 없음 — 딥링크 콜백이 없는
    // 이번 브랜치 범위(이메일/비밀번호만)에서는 애초에 불필요
    detectSessionInUrl: false,
  },
});
