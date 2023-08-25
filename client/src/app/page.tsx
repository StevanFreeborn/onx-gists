'use client';

import { useUserSession } from '@/auth/useUserSession';
import { signIn, signOut } from 'next-auth/react';

export default function Home() {
  const session = useUserSession();

  async function callApi() {
    const res = await fetch('http://localhost:3001', {
      headers: {
        Authorization: `Bearer ${session.data?.apiJwt}`,
      },
    });
  }

  return (
    <main className="">
      <div>
        {session.status === 'authenticated' ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </div>
      <div>
        <button onClick={() => callApi()}>Call Api</button>
      </div>
    </main>
  );
}
