'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useUserSession() {
  const session = useSession();

  useEffect(() => {
    if (session.data?.refreshErrored) {
      signOut();
      signIn();
    }
  }, [session]);

  return session;
}
