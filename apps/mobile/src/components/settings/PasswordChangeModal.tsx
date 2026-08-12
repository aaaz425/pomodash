import { useState } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/store/AuthProvider';
import { PasswordField } from '@/components/auth/PasswordField';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
}

// 웹 PasswordChangeDialog 대응 — 회원탈퇴(DeleteAccountModal)와 같은 중앙 카드 모달 패턴으로 통일.
// 이전엔 설정 화면에 인라인 토글+폼으로 펼쳐졌지만, 카드 안에 폼이 중첩되는 모양이 어색해서
// 다른 계정 액션(회원탈퇴)과 동일하게 모달로 분리했다.
export function PasswordChangeModal({ visible, title, onClose }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleClose() {
    setPassword('');
    setPasswordConfirm('');
    setError(null);
    setPending(false);
    onClose();
  }

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
    handleClose();
  }

  return (
    <RNModal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <Pressable
          onPress={() => {}}
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
            {title}
          </Text>
          <PasswordField
            label="새 비밀번호"
            autoComplete="new-password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError(null);
            }}
            editable={!pending}
          />
          <PasswordField
            label="새 비밀번호 확인"
            autoComplete="new-password"
            value={passwordConfirm}
            onChangeText={(t) => {
              setPasswordConfirm(t);
              setError(null);
            }}
            editable={!pending}
          />
          {error && (
            <Text
              style={[styles.error, { color: theme.destructive, fontFamily: FONTS.sansRegular }]}
            >
              {error}
            </Text>
          )}
          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={[styles.button, { backgroundColor: theme.muted }]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
                ]}
              >
                취소
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={pending || !password}
              style={[
                styles.button,
                { backgroundColor: theme.primary },
                (pending || !password) && styles.disabled,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
                ]}
              >
                {pending ? '변경 중...' : '저장'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 16,
  },
  error: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 14,
  },
});
