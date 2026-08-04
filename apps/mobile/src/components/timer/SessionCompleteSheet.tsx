import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTimerStore } from '@/store/StoreProvider';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

// 웹의 SessionRecordModal에 대응 — 메모/집중도 평점/방해요소 태그/작업 선택은
// 작업(Task) 데이터가 아직 모바일에 없어 이번 브랜치에서는 생략(추후 rn-tasks/rn-sync에서 구현)
export function SessionCompleteSheet() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const sessionEnded = useTimerStore((s) => s.sessionEnded);
  const dismissSessionRecord = useTimerStore((s) => s.dismissSessionRecord);

  return (
    <Modal
      visible={sessionEnded}
      animationType="slide"
      transparent
      onRequestClose={dismissSessionRecord}
    >
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.iconOuter, { backgroundColor: withAlpha(theme.primary, 0.2) }]}>
            <View style={[styles.iconInner, { backgroundColor: theme.primary }]}>
              <Check size={20} color={theme.primaryForeground} strokeWidth={2.5} />
            </View>
          </View>

          <Text style={[styles.headline, { color: theme.foreground, fontFamily: FONTS.sansBold }]}>
            집중 완료!
          </Text>
          <Text
            style={[
              styles.subtext,
              { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
            ]}
          >
            오늘도 집중 세션을 완료했어요
          </Text>

          <Pressable
            onPress={dismissSessionRecord}
            style={[styles.confirmButton, { backgroundColor: theme.primary }]}
          >
            <Text
              style={[
                styles.confirmText,
                { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              확인
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  iconOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: 26,
  },
  subtext: {
    fontSize: 14,
    marginTop: -8,
  },
  confirmButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  confirmText: {
    fontSize: 14,
  },
});
