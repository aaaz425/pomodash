'use client';

import type { ReactNode } from 'react';
import { GuestPrompt } from '@/components/shared/GuestPrompt';
import { useLoggedIn } from '@/hooks/useLoggedIn';

interface Props {
  loggedInPromise: Promise<boolean>;
  title: string;
  description?: string;
  children: ReactNode;
}

export function GuestGate({ loggedInPromise, title, description, children }: Props) {
  const loggedIn = useLoggedIn(loggedInPromise);

  if (loggedIn === null) return null;
  if (!loggedIn) return <GuestPrompt title={title} description={description} />;
  return <>{children}</>;
}
