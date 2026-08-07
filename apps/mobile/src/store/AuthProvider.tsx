import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { EmailOtpType, Session, User } from '@supabase/supabase-js';
import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import { supabase } from '@/lib/supabase/client';
import {
  LoginCredentialsSchema,
  SignupCredentialsSchema,
  type AuthActionResult,
} from '@/types/auth';

// 딥링크 없이(이번 브랜치 범위) 이메일 인증 링크는 웹으로 보낸다 —
// 사용자가 메일 링크를 누르면 브라우저에서 웹의 /auth/confirm이 인증을 마무리하고,
// 앱으로는 돌아오지 않으므로 비밀번호로 다시 로그인하면 된다.
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
      options: { emailRedirectTo: `${WEB_APP_URL}/auth/confirm` },
    });

    if (error) {
      if (error.status === 429) {
        return { error: '잠시 후 다시 시도해주세요' };
      }
      return { error: '가입에 실패했어요. 잠시 후 다시 시도해주세요' };
    }

    // 이미 가입+인증된 이메일이면 Supabase는 에러 없이 identities가 빈 배열인 응답을 준다
    if (data.user && data.user.identities?.length === 0) {
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
