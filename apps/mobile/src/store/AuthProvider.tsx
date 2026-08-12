import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { EmailOtpType, Session, User } from '@supabase/supabase-js';
import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import { supabase } from '@/lib/supabase/client';
import {
  LoginCredentialsSchema,
  SignupCredentialsSchema,
  type AuthActionResult,
} from '@/types/auth';

// 이메일 인증 링크는 앱의 커스텀 스킴(pomodash://auth/confirm)으로 보낸다 — 웹으로 새지 않고
// 메일함에서 링크를 누르면 앱이 바로 열려 app/auth/confirm.tsx가 세션 교환을 마무리한다.
export const WEB_APP_URL = 'https://pomodash-three.vercel.app';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  loginWithKakao: () => Promise<AuthActionResult>;
  signup: (email: string, password: string, passwordConfirm: string) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// signUp()이 "이미 가입된 이메일" 응답을 줄 때 보안상 기존 계정의 메타데이터를 안 채워주기 때문에,
// Edge Function(service_role)으로 직접 조회해야 카카오 가입 여부를 알 수 있다.
async function getExistingProvider(email: string): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke<{
    exists: boolean;
    provider: string | null;
  }>('check-email-provider', { body: { email } });
  if (error || !data?.exists) return null;
  return data.provider;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<AuthActionResult> {
    const parsed = LoginCredentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? '입력값을 확인해주세요' };
    }

    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
      if (error.message === 'Email not confirmed') {
        return { error: '이메일 인증이 필요해요. 받은 메일함을 확인해주세요' };
      }
      if (error.status === 429) {
        return { error: '잠시 후 다시 시도해주세요' };
      }
      if (error.message === 'Invalid login credentials') {
        const provider = await getExistingProvider(parsed.data.email);
        if (provider === 'kakao') {
          return { error: '카카오로 가입됐어요. 카카오 로그인을 이용해주세요' };
        }
        return { error: '이메일 또는 비밀번호가 올바르지 않습니다' };
      }
      return { error: '로그인에 실패했어요. 잠시 후 다시 시도해주세요' };
    }

    return {};
  }

  async function loginWithKakao(): Promise<AuthActionResult> {
    let accessToken: string;
    try {
      const token = await kakaoLogin();
      accessToken = token.accessToken;
    } catch (err) {
      // 사용자가 로그인 취소 시(카카오톡 앱 전환 후 뒤로가기 등) 에러로 던져지므로 조용히 무시
      if (err instanceof Error && err.message.includes('CANCEL')) {
        return {};
      }
      console.error('[kakao] login() failed', err);
      return { error: '카카오 로그인에 실패했어요. 잠시 후 다시 시도해주세요' };
    }

    const { data, error: invokeError } = await supabase.functions.invoke<{
      tokenHash?: string;
      verificationType?: EmailOtpType;
      error?: string;
    }>('kakao-login', { body: { accessToken } });

    if (invokeError || !data?.tokenHash || !data.verificationType) {
      console.error('[kakao] edge function failed', invokeError, data);
      return { error: '카카오 로그인에 실패했어요. 잠시 후 다시 시도해주세요' };
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: data.tokenHash,
      type: data.verificationType,
    });

    if (verifyError) {
      console.error('[kakao] verifyOtp failed', verifyError);
      return { error: '카카오 로그인에 실패했어요. 잠시 후 다시 시도해주세요' };
    }

    return {};
  }

  async function signup(
    email: string,
    password: string,
    passwordConfirm: string,
  ): Promise<AuthActionResult> {
    const parsed = SignupCredentialsSchema.safeParse({ email, password, passwordConfirm });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? '입력값을 확인해주세요' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: 'pomodash://auth/confirm' },
    });

    if (error) {
      if (error.status === 429) {
        return { error: '잠시 후 다시 시도해주세요' };
      }
      return { error: '가입에 실패했어요. 잠시 후 다시 시도해주세요' };
    }

    // 이미 가입+인증된 이메일이면 Supabase는 에러 없이 identities가 빈 배열인 응답을 준다
    if (data.user && data.user.identities?.length === 0) {
      const provider = await getExistingProvider(parsed.data.email);
      if (provider === 'kakao') {
        return { error: '카카오로 가입됐어요. 카카오 로그인을 이용해주세요' };
      }
      return { error: '이미 가입된 이메일이에요. 로그인해주세요' };
    }

    return { pendingConfirmation: true };
  }

  async function logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    login,
    loginWithKakao,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
