'use client';

import { useUserSession } from '@/auth/useUserSession';
import { signIn, signOut } from 'next-auth/react';

export default function Home() {
  const session = useUserSession();

  return (
    <main className="">
      <div>
        {session.status === 'authenticated' ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </div>
    </main>
  );
}
