import { Modal } from '@/components/shared/Modal';
import { Portal } from '@/components/shared/Portal';
import { MotivationalSection } from '@/components/settings/MotivationalSection';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function MotivationalModalContent({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} title="동기부여 메시지" onClose={onClose} scrollable={false}>
      <MotivationalSection />
    </Modal>
  );
}

export function MotivationalModal(props: Props) {
  return (
    <Portal>
      <MotivationalModalContent {...props} />
    </Portal>
  );
}
