import { useRef } from 'react';
import type { PointerEvent } from 'react';

const DISMISS_DISTANCE_RATIO = 0.3;
const DISMISS_VELOCITY = 0.8; // px/ms
const SNAP_DURATION_MS = 180;
const DESKTOP_QUERY = '(min-width: 640px)';

interface Options {
  onDismiss: () => void;
  // 닫기 대신 확인 다이얼로그를 띄우는 시트는 취소될 수 있으니 제자리로 복귀시킨다
  snapBackOnDismiss?: boolean;
}

// 드래그 중 위치는 매 프레임 바뀌어 React state 대신 시트 DOM의 transform을 직접 조작한다
export function useSheetDrag<T extends HTMLElement>({
  onDismiss,
  snapBackOnDismiss = false,
}: Options) {
  const sheetRef = useRef<T>(null);
  const dragRef = useRef<{
    startY: number;
    lastY: number;
    lastTime: number;
    velocity: number;
  } | null>(null);

  function moveSheet(offset: string, transition: string) {
    const sheet = sheetRef.current;
    if (!sheet) return;
    sheet.style.transition = transition;
    sheet.style.transform = offset;
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (window.matchMedia(DESKTOP_QUERY).matches) return;
    if ((event.target as HTMLElement).closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startY: event.clientY,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
    };
    moveSheet('', 'none');
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) drag.velocity = (event.clientY - drag.lastY) / elapsed;
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
    moveSheet(`translateY(${Math.max(0, event.clientY - drag.startY)}px)`, 'none');
  }

  function onPointerEnd(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    const sheet = sheetRef.current;
    dragRef.current = null;
    if (!drag || !sheet) return;
    const distance = Math.max(0, event.clientY - drag.startY);
    const shouldDismiss =
      distance > sheet.offsetHeight * DISMISS_DISTANCE_RATIO || drag.velocity > DISMISS_VELOCITY;

    if (shouldDismiss && !snapBackOnDismiss) {
      moveSheet('translateY(100%)', `transform ${SNAP_DURATION_MS}ms ease-in`);
      setTimeout(onDismiss, SNAP_DURATION_MS);
      return;
    }
    moveSheet('', `transform ${SNAP_DURATION_MS}ms ease-out`);
    if (shouldDismiss) onDismiss();
  }

  return {
    sheetRef,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
  };
}
