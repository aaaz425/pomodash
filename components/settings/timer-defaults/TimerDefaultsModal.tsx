'use client';

import { Modal } from '@/components/shared/Modal';
import { TimerDefaultsSection } from '@/components/settings/timer-defaults/TimerDefaultsSection';

interface Props {
  onClose: () => void;
}

export function TimerDefaultsModal({ onClose }: Props) {
  return (
    <Modal title="타이머 기본값" onClose={onClose}>
      <TimerDefaultsSection />
    </Modal>
  );
}
