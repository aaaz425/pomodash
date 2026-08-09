import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** 생략하면 확인 버튼 1개짜리 안내 모달이 된다(예: 카테고리 삭제 차단 안내) */
  onCancel?: () => void;
  destructive?: boolean;
  /** 3번째 선택지(예: 방치된 세션 "폐기") — 생략하면 버튼 2개 */
  tertiaryLabel?: string;
  onTertiary?: () => void;
}

// 웹의 중앙 정렬 ConfirmDialog.tsx 대응 — Modal.tsx(바텀시트)와 별개의 프리미티브.
// 웹처럼 바깥 클릭으로는 안 닫힘(의도적) — Android 뒤로가기(onRequestClose)만 취소로 연결.
export function ConfirmModal({
  visible,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  destructive = false,
  tertiaryLabel,
  onTertiary,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <RNModal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel ?? onConfirm}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.textGroup}>
            <Text
              style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}
            >
              {title}
            </Text>
            {description && (
              <Text
                style={[
                  styles.description,
                  { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                ]}
              >
                {description}
              </Text>
            )}
          </View>

          <View style={styles.actions}>
            {tertiaryLabel && onTertiary && (
              <Pressable
                onPress={onTertiary}
                style={[styles.button, styles.tertiaryButton, { borderColor: theme.border }]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: theme.mutedForeground, fontFamily: FONTS.sansSemiBold },
                  ]}
                >
                  {tertiaryLabel}
                </Text>
              </Pressable>
            )}
            {onCancel && (
              <Pressable
                onPress={onCancel}
                style={[styles.button, { backgroundColor: theme.muted }]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
                  ]}
                >
                  {cancelLabel}
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={onConfirm}
              style={[
                styles.button,
                { backgroundColor: destructive ? theme.destructive : theme.primary },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
                ]}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
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
    gap: 16,
  },
  textGroup: {
    gap: 6,
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tertiaryButton: {
    marginRight: 'auto',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 14,
  },
});
