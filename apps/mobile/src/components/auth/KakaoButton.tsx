import { useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '@/store/AuthProvider';

interface Props {
  onError: (message: string) => void;
}

export function KakaoButton({ onError }: Props) {
  const { loginWithKakao } = useAuth();
  const [pending, setPending] = useState(false);

  async function handlePress() {
    if (pending) return;
    setPending(true);
    const result = await loginWithKakao();
    setPending(false);
    if (result.error) onError(result.error);
  }

  return (
    <Pressable onPress={handlePress} disabled={pending} style={pending && styles.disabled}>
      <Image
        source={require('@/assets/images/kakao_login_large_wide.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 44,
  },
  disabled: {
    opacity: 0.4,
  },
});
