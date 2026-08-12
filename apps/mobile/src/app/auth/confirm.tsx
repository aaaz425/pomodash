import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase/client';
import { AuthShell } from '@/components/auth/AuthShell';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

// 이메일 인증 링크(pomodash://auth/confirm?code=...)가 앱을 열면 이 화면이 뜬다.
// 세션 교환이 끝나면 onAuthStateChange가 세션을 반영하고, (app)/_layout이 알아서 앱으로 전환한다.
export default function AuthConfirmScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (!code) {
      router.replace('/login');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setError('인증에 실패했어요. 다시 시도해주세요');
        return;
      }
      router.replace('/');
    });
  }, [code]);

  return (
    <AuthShell>
      <View style={styles.wrap}>
        {error ? (
          <>
            <Text
              style={[styles.error, { color: theme.destructive, fontFamily: FONTS.sansRegular }]}
            >
              {error}
            </Text>
          </>
        ) : (
          <>
            <ActivityIndicator color={theme.primary} />
            <Text
              style={[
                styles.message,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              인증 처리 중이에요...
            </Text>
          </>
        )}
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  message: {
    fontSize: 14,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
  },
});
