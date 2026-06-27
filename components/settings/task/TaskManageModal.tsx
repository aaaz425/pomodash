'use client';

import { useState } from 'react';
import { Tag } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { TaskList } from '@/components/tasks/TaskList';
import { CategoryModal } from '@/components/settings/category/CategoryModal';

interface Props {
  onClose: () => void;
}

export function TaskManageModal({ onClose }: Props) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  return (
    <>
      <Modal
        title="작업 관리"
        onClose={onClose}
        widthClassName="sm:w-[480px]"
        maxHeightClassName="max-h-[80vh]"
        bodyClassName="flex flex-col gap-2 p-3 overflow-y-auto"
      >
        <button
          type="button"
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center gap-1.5 self-end px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Tag className="w-3 h-3" />
          카테고리 관리
        </button>

        <TaskList mode="manage" />
      </Modal>

      {showCategoryModal && <CategoryModal onClose={() => setShowCategoryModal(false)} />}
    </>
  );
}
