'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

type Props = {
  session: Session | null;
  children?: React.ReactNode;
};

export const AuthProvider = ({ session, children }: Props) => {
  const refetchInterval =
    60 * parseInt(process.env.NEXT_PUBLIC_SESSION_REFETCH_MINS ?? '1');

  return (
    <SessionProvider
      session={session}
      refetchInterval={refetchInterval}
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
};
