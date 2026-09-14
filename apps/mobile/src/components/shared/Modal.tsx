import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { Portal } from './Portal';

// 네이티브 RN <Modal>은 react-native-screens 환경에서 하단 커스텀 탭바를 못 덮어, 절대위치 View 오버레이를 <Portal>로 렌더링한다.
// sheet 높이는 고정 px 필수 — '85%' 같은 퍼센트는 부모 높이가 불확정이라 내용이 잘리는 버그가 있었음(실측 확인)
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  // DraggableFlatList처럼 자체 pan 제스처를 쓰는 콘텐츠는 바깥 ScrollView와 경합해 드래그가 안 먹으므로 false로 넘겨 뺀다(실측 확인)
  scrollable?: boolean;
  // 기본값 'never'는 빈 영역 첫 탭이 키보드만 내리고 그 아래 터치는 버림 — 입력창+버튼이 같이 있으면 'handled' 필요
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

// 백드롭과 시트를 형제로 분리(부모-자식 아님) — 감싸는 구조였을 때 ScrollView가 Pressable 두 겹과 경합해 스크롤이 안 먹혔음.
// <Portal>은 별개 이유 — 탭 스크린 트리 바깥(PortalProvider)에서 렌더링해 하단 탭바에 가려지지 않게 함.
export function Modal({
  visible,
  title,
  onClose,
  children,
  footer,
  scrollable = true,
  keyboardShouldPersistTaps = 'never',
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const insets = useSafeAreaInsets();

  const [mounted, setMounted] = useState(visible);
  const [sheetBottom] = useState(() => new Animated.Value(-SCREEN_HEIGHT));
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  // <Portal> 경유 마운트라 Portal 등록 + PortalProvider 재렌더 사이클이 끼어, requestAnimationFrame 추측 방식은 타이밍이 안 맞아 깜빡였음(실측)
  // — 대신 시트가 실제로 레이아웃된 순간(onLayout)을 신호로 애니메이션을 시작한다
  const openAnimationStartedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      // 열릴 때는 즉시 마운트해야 애니메이션이 보임(닫힐 때만 비동기 콜백에서 처리) — 동기 호출 불가피
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      sheetBottom.setValue(-SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
      openAnimationStartedRef.current = false;
    } else {
      Animated.parallel([
        Animated.timing(sheetBottom, {
          toValue: -SCREEN_HEIGHT,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible, sheetBottom, backdropOpacity]);

  function handleSheetLayout(_event: LayoutChangeEvent) {
    if (!visible || openAnimationStartedRef.current) return;
    openAnimationStartedRef.current = true;
    Animated.parallel([
      Animated.timing(sheetBottom, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }

  // 네이티브 <Modal>이 없으니 안드로이드 물리 뒤로가기를 직접 처리
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  if (!mounted) return null;

  return (
    <Portal>
      <View style={styles.root} pointerEvents="box-none">
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <View style={styles.sheetWrap} pointerEvents="box-none">
          <Animated.View style={[styles.sheetPosition, { bottom: sheetBottom }]}>
            <View
              onLayout={handleSheetLayout}
              style={[
                styles.sheet,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  paddingBottom: insets.bottom,
                },
              ]}
            >
              <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text
                  style={[
                    styles.title,
                    { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
                  ]}
                >
                  {title}
                </Text>
                <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="닫기">
                  <X size={18} color={theme.mutedForeground} />
                </Pressable>
              </View>

              {scrollable ? (
                <ScrollView
                  style={styles.body}
                  contentContainerStyle={styles.bodyContent}
                  keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                >
                  {children}
                </ScrollView>
              ) : (
                <View style={styles.bodyContent}>{children}</View>
              )}

              {footer && (
                <View
                  style={[
                    styles.footer,
                    { backgroundColor: theme.card, borderTopColor: theme.border },
                  ]}
                >
                  {footer}
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetPosition: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: SCREEN_HEIGHT * 0.85,
    overflow: 'hidden',
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
    flexShrink: 1,
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
