import { Gesture } from 'react-native-gesture-handler';
import { withSpring } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DISMISS_DISTANCE_RATIO = 0.3;
const DISMISS_VELOCITY = 800;

interface Options {
  translateY: SharedValue<number>;
  sheetHeight: SharedValue<number>;
  onDismiss: () => void;
  // 닫기 대신 확인 다이얼로그를 띄우는 시트는 취소될 수 있으니 제자리로 복귀시킨다
  snapBackOnDismiss?: boolean;
}

export function createSheetDismissGesture({
  translateY,
  sheetHeight,
  onDismiss,
  snapBackOnDismiss = false,
}: Options) {
  return Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX([-20, 20])
    .onUpdate((event) => {
      translateY.set(Math.max(0, event.translationY));
    })
    .onEnd((event) => {
      const shouldDismiss =
        event.translationY > sheetHeight.get() * DISMISS_DISTANCE_RATIO ||
        event.velocityY > DISMISS_VELOCITY;
      if (shouldDismiss) scheduleOnRN(onDismiss);
      if (!shouldDismiss || snapBackOnDismiss) {
        translateY.set(withSpring(0, { damping: 20, stiffness: 300 }));
      }
    });
}
