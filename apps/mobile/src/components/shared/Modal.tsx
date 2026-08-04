import { useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  Dimensions,
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

// RNModal의 slide 애니메이션은 백드롭+시트를 하나의 레이어로 통째로 슬라이드시켜
// 딤 배경이 시트와 같이 오르내리는 것처럼 보임 — fade로 백드롭은 자연스럽게 페이드시키고,
// 시트만 별도로 등장 시 슬라이드업 애니메이션을 얹는다
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

// 웹의 바텀시트 Modal.tsx(모바일 뷰포트 기준) 대응 — SessionCompleteSheet.tsx의 시트 패턴을 일반화
export function Modal({ visible, title, onClose, children, footer }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (!visible) return;
    sheetTranslateY.value = SCREEN_HEIGHT;
    sheetTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
  }, [visible, sheetTranslateY]);

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  return (
    <RNModal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View style={sheetAnimatedStyle}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <SafeAreaView edges={['bottom']}>
              <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text
                  style={[
                    styles.title,
                    { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
                  ]}
                >
                  {title}
                </Text>
                <Pressable onPress={onClose} hitSlop={8}>
                  <X size={18} color={theme.mutedForeground} />
                </Pressable>
              </View>

              <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
                {children}
              </ScrollView>

              {footer && (
                <View style={[styles.footer, { borderTopColor: theme.border }]}>{footer}</View>
              )}
            </SafeAreaView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </RNModal>
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
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    flexDirection: 'column',
    gap: 20,
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
});
