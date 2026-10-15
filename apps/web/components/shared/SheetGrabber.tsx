import type { HTMLAttributes } from 'react';

export function SheetGrabber({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`flex justify-center pt-2 sm:hidden ${className}`}>
      <div className="h-1 w-9 rounded-full bg-muted-foreground/30" />
    </div>
  );
}
