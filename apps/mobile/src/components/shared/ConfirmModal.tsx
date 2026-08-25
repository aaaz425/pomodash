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
  /**
   * true면 RN Modal로 감싸지 않고 절대 위치 오버레이로 렌더링한다 — 이미 다른 Modal
   * 안에서 뜨는 경우(예: FocusMode) Modal을 중첩하면 iOS에서 두 Modal이 동시에
   * 닫힐 때 화면이 검게 남거나 안 뜨는 문제가 있어서 그 경우에만 사용.
   */
  inline?: boolean;
  /** true면 확인/취소/3번째 버튼을 전부 비활성화 — 비동기(Supabase 왕복) onConfirm 진행 중 연타 방지 */
  loading?: boolean;
  /** true면 배경(딤 영역) 탭 시 onCancel 호출 — 파괴적 확인(삭제 등)은 기본값(false)으로 실수 방지 유지 */
  closeOnBackdropClick?: boolean;
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
  inline = false,
  loading = false,
  closeOnBackdropClick = false,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const content = (
    <Pressable
      style={styles.backdrop}
      onPress={closeOnBackdropClick && onCancel && !loading ? onCancel : undefined}
    >
      <Pressable
        onPress={() => {}}
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <View style={styles.textGroup}>
          <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
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
              disabled={loading}
              style={[
                styles.button,
                styles.tertiaryButton,
                { borderColor: theme.border },
                loading && styles.disabled,
              ]}
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
              disabled={loading}
              style={[styles.button, { backgroundColor: theme.muted }, loading && styles.disabled]}
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
            disabled={loading}
            style={[
              styles.button,
              { backgroundColor: destructive ? theme.destructive : theme.primary },
              loading && styles.disabled,
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
      </Pressable>
    </Pressable>
  );

  if (inline) {
    if (!visible) return null;
    return <View style={StyleSheet.absoluteFill}>{content}</View>;
  }

  return (
    <RNModal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel ?? onConfirm}
    >
      {content}
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
  disabled: {
    opacity: 0.4,
  },
});
