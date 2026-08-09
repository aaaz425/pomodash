import { useEffect } from 'react';
import { AppState } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTimerStore } from '@/store/StoreProvider';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

// 웹 apps/web/lib/constants/limits.ts의 SESSION_LIMITS.ABANDONED_CHECK_INTERVAL_MS와 동일 —
// 아직 packages/shared로 추출되지 않아 값만 맞춰 중복
const ABANDONED_CHECK_INTERVAL_MS = 30 * 1000;

// 웹 apps/web/components/timer/AbandonedSessionDialog.tsx 대응 — mobile timerStore는
// 영속화가 없어(feat/rn-session-record 계획 참고) 앱 재시작 후 복구되는 시나리오는 없고,
// 일시정지 상태로 오래 방치된 경우만 감지한다. document.visibilitychange 대신 AppState 사용.
export function AbandonedSessionDialog() {
  const sessionStarted = useTimerStore((s) => s.sessionStarted);
  const sessionEnded = useTimerStore((s) => s.sessionEnded);
  const startedAt = useTimerStore((s) => s.startedAt);
  const showAbandonedPrompt = useTimerStore((s) => s.showAbandonedPrompt);
  const sessionStartedAt = useTimerStore((s) => s.sessionStartedAt);
  const checkAbandoned = useTimerStore((s) => s.checkAbandoned);
  const dismissAbandonedPrompt = useTimerStore((s) => s.dismissAbandonedPrompt);
  const dismissSessionRecord = useTimerStore((s) => s.dismissSessionRecord);
  const endSession = useTimerStore((s) => s.endSession);

  useEffect(() => {
    if (!sessionStarted || sessionEnded || startedAt !== null) return;

    checkAbandoned();
    const id = setInterval(checkAbandoned, ABANDONED_CHECK_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') checkAbandoned();
    });

    return () => {
      clearInterval(id);
      subscription.remove();
    };
  }, [sessionStarted, sessionEnded, startedAt, checkAbandoned]);

  if (!showAbandonedPrompt) return null;

  const startedLabel = sessionStartedAt
    ? formatDistanceToNow(sessionStartedAt, { addSuffix: true, locale: ko })
    : null;

  return (
    <ConfirmModal
      visible={showAbandonedPrompt}
      title="이전 세션이 남아있어요"
      description={
        startedLabel
          ? `${startedLabel} 시작한 세션이 아직 끝나지 않았어요. 어떻게 할까요?`
          : '아직 끝나지 않은 세션이 있어요. 어떻게 할까요?'
      }
      cancelLabel="이어가기"
      onCancel={dismissAbandonedPrompt}
      confirmLabel="종료하고 기록"
      onConfirm={() => {
        endSession();
        dismissAbandonedPrompt();
      }}
      tertiaryLabel="폐기"
      onTertiary={dismissSessionRecord}
    />
  );
}
