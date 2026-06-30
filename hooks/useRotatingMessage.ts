'use client';

import { useEffect, useState } from 'react';

export function useRotatingMessage(
  messages: string[],
  intervalMs: number,
  active: boolean,
): string {
  const [message, setMessage] = useState(
    () => messages[Math.floor(Math.random() * messages.length)] ?? '',
  );

  useEffect(() => {
    if (!active || messages.length === 0) return;

    const id = setInterval(() => {
      setMessage((prev) => {
        if (messages.length === 1) return messages[0];
        let next = prev;
        while (next === prev) {
          next = messages[Math.floor(Math.random() * messages.length)];
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [active, messages, intervalMs]);

  return message;
}
