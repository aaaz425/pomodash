import { useEffect, useState } from 'react';

export function useLoggedIn(loggedInPromise: Promise<boolean>): boolean | null {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    loggedInPromise.then((value) => {
      if (active) setLoggedIn(value);
    });
    return () => {
      active = false;
    };
  }, [loggedInPromise]);

  return loggedIn;
}
