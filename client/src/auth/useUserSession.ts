'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useUserSession() {
  const session = useSession();

  useEffect(() => {
    if (session.data?.refreshErrored) {
      signIn();
    }
  }, [session]);

  return session;
}
