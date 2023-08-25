'use client';

import { SessionProvider } from 'next-auth/react';

type Props = {
  children?: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const refetchInterval =
    60 * parseInt(process.env.NEXT_PUBLIC_SESSION_REFETCH_MINS ?? '1');

  return (
    <SessionProvider
      refetchInterval={refetchInterval}
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
};
