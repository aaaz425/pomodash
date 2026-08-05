import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import ViewShot, { captureRef, type ViewShotRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library/legacy';
import type { ShareCardData } from '@pomodash/shared';
import { Modal } from '@/components/shared/Modal';
import { ShareCardPreview } from './ShareCardPreview';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  data: ShareCardData;
  onClose: () => void;
}

export function ShareCardModal({ data, onClose }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const viewShotRef = useRef<ViewShotRef>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function capture(): Promise<string | null> {
    if (!viewShotRef.current) return null;
    return captureRef(viewShotRef, { format: 'png', quality: 1 });
  }

  async function handleShare() {
    setIsBusy(true);
    try {
      const uri = await capture();
      if (!uri) return;
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('공유를 사용할 수 없어요', '이 기기에서는 공유 기능을 지원하지 않아요.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '오늘의 집중 기록 — Pomodash',
        UTI: 'public.png',
      });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSave() {
    setIsBusy(true);
    try {
      const uri = await capture();
      if (!uri) return;
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('저장 권한이 필요해요', '설정에서 사진 접근 권한을 허용해주세요.');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('저장 완료', '사진 앱에 공유 카드를 저장했어요.');
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Modal
      visible
      title="공유 카드"
      onClose={onClose}
      footer={
        <>
          <Pressable
            style={[styles.button, { backgroundColor: theme.muted }]}
            onPress={onClose}
            disabled={isBusy}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              닫기
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: theme.muted }, isBusy && styles.disabled]}
            onPress={handleShare}
            disabled={isBusy}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              공유
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }, isBusy && styles.disabled]}
            onPress={handleSave}
            disabled={isBusy}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              저장
            </Text>
          </Pressable>
        </>
      }
    >
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <ShareCardPreview data={data} />
      </ViewShot>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
  },
});
