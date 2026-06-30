'use client';

import { Modal } from '@/components/shared/Modal';
import { MotivationalSection } from '@/components/settings/motivational/MotivationalSection';

interface Props {
  onClose: () => void;
}

export function MotivationalModal({ onClose }: Props) {
  return (
    <Modal title="동기부여 메시지" onClose={onClose}>
      <MotivationalSection />
    </Modal>
  );
}
