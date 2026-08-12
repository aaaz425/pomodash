import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/store/AuthProvider';
import { PasswordField } from '@/components/auth/PasswordField';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

// 웹 AccountSection의 "비밀번호 변경/설정" 인라인 폼 대응. 카카오 계정도 같은 updatePassword로
// 처음 비밀번호를 설정할 수 있어(기존 비밀번호 유무와 무관하게 덮어쓰는 API), 라벨만 다르게 보여준다.
export function PasswordChangeSection() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { user, updatePassword } = useAuth();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const isKakao = user?.user_metadata?.provider === 'kakao';
  const label = isKakao ? '비밀번호 설정' : '비밀번호 변경';

  async function handleSubmit() {
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않아요');
      return;
    }
    setPending(true);
    setError(null);
    const result = await updatePassword(password);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setPassword('');
    setPasswordConfirm('');
  }

  return (
    <View>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.toggleRow}>
        <Text
          style={[
            styles.toggleLabel,
            { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
          ]}
        >
          {label}
        </Text>
      </Pressable>

      {open && (
        <View style={styles.form}>
          <PasswordField
            label="새 비밀번호"
            autoComplete="new-password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setSuccess(false);
            }}
            editable={!pending}
          />
          <PasswordField
            label="새 비밀번호 확인"
            autoComplete="new-password"
            value={passwordConfirm}
            onChangeText={(t) => {
              setPasswordConfirm(t);
              setSuccess(false);
            }}
            editable={!pending}
          />
          {error && (
            <Text
              style={[styles.message, { color: theme.destructive, fontFamily: FONTS.sansRegular }]}
            >
              {error}
            </Text>
          )}
          {success && (
            <Text style={[styles.message, { color: theme.primary, fontFamily: FONTS.sansRegular }]}>
              변경됐어요
            </Text>
          )}
          <Pressable
            onPress={handleSubmit}
            disabled={pending || !password}
            style={[
              styles.submit,
              { backgroundColor: theme.primary },
              (pending || !password) && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.submitText,
                { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              {pending ? '변경 중...' : '저장'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 12,
  },
  form: {
    gap: 10,
    paddingBottom: 12,
  },
  message: {
    fontSize: 13,
  },
  submit: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  submitText: {
    fontSize: 13,
  },
});
