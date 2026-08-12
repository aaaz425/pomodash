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
    // RN엔 window.location이 없어 SDK가 URL을 자동으로 못 읽는다 — 이메일 인증 딥링크는
    // app/auth/confirm.tsx에서 code 파라미터를 직접 꺼내 exchangeCodeForSession()으로 처리한다
    detectSessionInUrl: false,
  },
});
