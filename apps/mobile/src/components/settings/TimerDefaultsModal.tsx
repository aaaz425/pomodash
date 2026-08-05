import { Modal } from '@/components/shared/Modal';
import { TimerDefaultsSection } from '@/components/settings/TimerDefaultsSection';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function TimerDefaultsModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} title="타이머 기본값" onClose={onClose}>
      <TimerDefaultsSection />
    </Modal>
  );
}
