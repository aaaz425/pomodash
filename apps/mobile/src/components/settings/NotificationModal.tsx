import { Modal } from '@/components/shared/Modal';
import { NotificationSection } from '@/components/settings/NotificationSection';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function NotificationModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} title="알림" onClose={onClose}>
      <NotificationSection />
    </Modal>
  );
}
