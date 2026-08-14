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

// 네이티브 RN <Modal>을 쓰지 않는다 — react-native-screens 환경에서 화면 트리 안에
// 띄운 네이티브 <Modal>이 하단 커스텀 탭바(BottomNav)를 제대로 못 덮는 문제가 있어서
// 대신 평범한 절대위치 View 오버레이를 <Portal>로 AppTabs의 형제 위치에 렌더링한다.
//
// sheet의 높이 제한은 반드시 고정 px 값을 써야 한다 — '85%' 같은 퍼센트는 부모
// (position:absolute + left/right/bottom만 있고 top이나 명시적 height가 없는
// sheetPosition)의 높이가 불확정이라 계산이 꼬여서 시트 내용이 중간에 잘리고 푸터가
// 시트에서 분리돼 렌더링되는 버그가 있었음(실측 확인됨) — SCREEN_HEIGHT 기반 고정값 +
// overflow:'hidden'으로 해결.
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  // DraggableFlatList처럼 자체 pan 제스처로 스크롤+드래그를 함께 처리하는 콘텐츠는
  // 바깥 ScrollView 안에 중첩되면 pan 제스처가 서로 경합해 드래그가 시작만 되고 실제
  // 이동은 안 되는 문제가 있음(실측 확인됨) — 이런 콘텐츠를 담는 모달은 false로 넘겨서
  // 바깥 ScrollView를 빼고 콘텐츠 자신의 스크롤에 맡긴다.
  scrollable?: boolean;
  // 기본값 'never'는 포커스된 입력이 있을 때 빈 영역 첫 탭이 키보드를 내리는 데만
  // 쓰이고 그 아래 터치는 버림 — 입력창과 버튼(자동완성 항목 등)이 같이 있는 콘텐츠는
  // 'handled'로 넘겨야 첫 탭에 바로 반응한다.
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

// 웹의 바텀시트 Modal.tsx(모바일 뷰포트 기준) 대응 — SessionCompleteSheet.tsx의 시트 패턴을 일반화
//
// 백드롭과 시트를 형제로 분리(부모-자식 아님)한다 — 백드롭이 시트를 감싸는 구조였을 때
// ScrollView가 Pressable 두 겹(백드롭+시트) 안에 중첩돼 터치 리스폰더 경합으로 스크롤이
// 잘 안 먹히는 문제가 있었음. 형제 구조 + pointerEvents="box-none"이면 시트 바깥 탭은
// 자연히 백드롭으로 전달되고 시트 안쪽은 stopPropagation 없이도 자기 터치를 그대로 받는다.
// <Portal>로 감싸는 이유는 별개 — 탭 스크린 트리 바깥(app/(app)/_layout.tsx의
// PortalProvider)에서 렌더링되게 해서 하단 탭바에 가려지지 않고 화면 진짜 끝까지 닿게 함.
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
  // 이 시트는 <Portal>을 거쳐 PortalProvider 쪽에서 실제로 마운트된다 — Modal 자신의
  // mounted state가 true가 되는 렌더와 Animated.View가 실제 화면에 커밋되는 시점 사이에
  // Portal의 등록 effect + PortalProvider 재렌더라는 추가 렌더 사이클이 끼어 있어서,
  // requestAnimationFrame처럼 프레임 수를 추측해 애니메이션 시작을 미루는 방식은 타이밍이
  // 안 맞아 오히려 깜빡임이 생겼음(실측 확인) — 대신 시트 View가 실제로 레이아웃된 순간
  // 그 자체(onLayout)를 신호로 받아 그때 애니메이션을 시작한다.
  const openAnimationStartedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      // 열릴 때는 즉시 마운트해야 애니메이션이 보임 — 닫힐 때만 애니메이션 완료 콜백에서
      // setMounted(false)를 호출(비동기)하는 것과 달리 이건 동기 호출이 불가피함
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
