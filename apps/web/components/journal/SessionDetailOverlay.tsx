'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { JournalDetailPanel } from '@/components/journal/JournalDetailPanel';
import type { Category, Session, Task } from '@/types';

interface Props {
  session: Session | null;
  task: Task | null;
  category: Category | null;
  onClose: () => void;
  onDeleted: () => void;
}

export function SessionDetailOverlay({ session, task, category, onClose, onDeleted }: Props) {
  if (!session) return null;

  return (
    <DialogPrimitive.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <DialogPrimitive.Popup
          aria-label="세션 상세"
          className={[
            'fixed z-50 bg-card border border-border shadow-2xl overflow-y-auto outline-none',
            'bottom-0 left-0 right-0 rounded-t-2xl max-h-[82vh] standalone:pb-[env(safe-area-inset-bottom)]',
            'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:pb-0',
            'sm:w-[600px] sm:rounded-xl sm:max-h-[85vh]',
          ].join(' ')}
        >
          <div className="p-5 sm:p-6">
            <JournalDetailPanel
              session={session}
              task={task}
              category={category}
              onBack={onClose}
              onDeleted={onDeleted}
            />
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
