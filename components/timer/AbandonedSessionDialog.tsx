'use client';

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTimerStore, useHydrated } from '@/store/StoreProvider';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export function AbandonedSessionDialog() {
  const hydrated = useHydrated();
  const showAbandonedPrompt = useTimerStore((s) => s.showAbandonedPrompt);
  const sessionStartedAt = useTimerStore((s) => s.sessionStartedAt);
  const dismissAbandonedPrompt = useTimerStore((s) => s.dismissAbandonedPrompt);
  const dismissSessionRecord = useTimerStore((s) => s.dismissSessionRecord);
  const endSession = useTimerStore((s) => s.endSession);

  if (!hydrated || !showAbandonedPrompt) return null;

  const startedLabel = sessionStartedAt
    ? formatDistanceToNow(sessionStartedAt, { addSuffix: true, locale: ko })
    : null;

  return (
    <ConfirmDialog
      open={showAbandonedPrompt}
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
