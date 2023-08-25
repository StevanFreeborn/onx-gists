'use client';

import { useUserSession } from '@/auth/useUserSession';

export default function Home() {
  const session = useUserSession();

  async function callApi() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL ?? '', {
      headers: {
        Authorization: `Bearer ${session.data?.apiJwt}`,
      },
    });
  }

  return (
    <main className="">
      <div>
        <button onClick={() => callApi()}>Call Api</button>
      </div>
    </main>
  );
}
