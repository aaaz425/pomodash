import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { AUTH_LIMITS } from '@pomodash/shared';
import { useAuth } from '@/store/AuthProvider';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextInput } from '@/components/shared/TextInput';
import { PasswordField } from '@/components/auth/PasswordField';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export default function SignupScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  async function handleSubmit() {
    if (pending) return;
    setPending(true);
    setError(null);
    const result = await signup(email, password, passwordConfirm);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.pendingConfirmation) setPendingConfirmation(true);
  }

  if (pendingConfirmation) {
    return (
      <AuthShell>
        <View style={styles.confirmPanel}>
          <View style={[styles.iconCircle, { backgroundColor: withAlpha(theme.primary, 0.1) }]}>
            <Mail size={28} color={theme.primary} />
          </View>
          <View style={styles.confirmTextGroup}>
            <Text
              style={[
                styles.confirmTitle,
                { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              이메일을 확인해주세요
            </Text>
            <Text
              style={[
                styles.confirmBody,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              {email}로 인증 메일을 보냈어요.{'\n'}메일함(스팸함 포함)을 확인해주세요.
            </Text>
          </View>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={[styles.link, { color: theme.primary, fontFamily: FONTS.sansMedium }]}>
                로그인 페이지로
              </Text>
            </Pressable>
          </Link>
        </View>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text
            style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansMedium }]}
          >
            이메일
          </Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!pending}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <PasswordField
          label={`비밀번호 (${AUTH_LIMITS.PASSWORD_MIN_LENGTH}자 이상)`}
          autoComplete="new-password"
          editable={!pending}
          value={password}
          onChangeText={setPassword}
        />

        <PasswordField
          label="비밀번호 확인"
          autoComplete="new-password"
          editable={!pending}
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
        />

        {error && (
          <Text style={[styles.error, { color: theme.destructive, fontFamily: FONTS.sansRegular }]}>
            {error}
          </Text>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={pending}
          style={[styles.submit, { backgroundColor: theme.primary }, pending && styles.disabled]}
        >
          <Text
            style={[
              styles.submitText,
              { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
            ]}
          >
            {pending ? '가입 중...' : '가입하기'}
          </Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Text
            style={[styles.footer, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
          >
            이미 계정이 있으신가요?{' '}
          </Text>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={[styles.link, { color: theme.primary, fontFamily: FONTS.sansMedium }]}>
                로그인
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
  },
  error: {
    fontSize: 14,
  },
  submit: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  submitText: {
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footer: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
  },
  confirmPanel: {
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTextGroup: {
    alignItems: 'center',
    gap: 4,
  },
  confirmTitle: {
    fontSize: 16,
  },
  confirmBody: {
    fontSize: 14,
    textAlign: 'center',
  },
});
