import { Modal } from '@/components/shared/Modal';
import { Portal } from '@/components/shared/Portal';
import { TimerDefaultsSection } from '@/components/settings/TimerDefaultsSection';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function TimerDefaultsModalContent({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} title="타이머 기본값" onClose={onClose}>
      <TimerDefaultsSection />
    </Modal>
  );
}

export function TimerDefaultsModal(props: Props) {
  return (
    <Portal>
      <TimerDefaultsModalContent {...props} />
    </Portal>
  );
}
