'use client';

import { Modal } from '@/components/shared/Modal';
import { NotificationSection } from '@/components/settings/notification/NotificationSection';

interface Props {
  onClose: () => void;
}

export function NotificationModal({ onClose }: Props) {
  return (
    <Modal title="알림" onClose={onClose}>
      <NotificationSection />
    </Modal>
  );
}
