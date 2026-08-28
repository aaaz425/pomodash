'use client';

import { Modal } from '@/components/shared/Modal';
import { TaskList } from '@/components/tasks/TaskList';

interface Props {
  onClose: () => void;
}

export function TaskManageModal({ onClose }: Props) {
  return (
    <Modal
      title="작업 관리"
      onClose={onClose}
      widthClassName="sm:w-[480px]"
      maxHeightClassName="max-h-[80vh]"
      bodyClassName="flex flex-col gap-2 p-3 overflow-y-auto"
    >
      <TaskList mode="manage" />
    </Modal>
  );
}
