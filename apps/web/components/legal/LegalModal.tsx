'use client';

import { LEGAL_DOCUMENTS, type LegalDocType } from '@pomoroutine/shared';
import { Modal } from '@/components/shared/Modal';
import { LegalContent } from '@/components/legal/LegalContent';

interface Props {
  doc: LegalDocType;
  onClose: () => void;
}

export function LegalModal({ doc, onClose }: Props) {
  return (
    <Modal title={LEGAL_DOCUMENTS[doc].title} onClose={onClose} widthClassName="sm:w-[480px]">
      <LegalContent doc={doc} />
    </Modal>
  );
}
