'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const session = useSession();

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
