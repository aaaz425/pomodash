import { Modal } from '@/components/shared/Modal';
import { MotivationalSection } from '@/components/settings/MotivationalSection';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function MotivationalModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} title="동기부여 메시지" onClose={onClose} scrollable={false}>
      <MotivationalSection />
    </Modal>
  );
}
