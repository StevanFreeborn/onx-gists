'use client';

import { useUserSession } from '@/auth/useUserSession';
import SortDetails from '@/components/SortDetails';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AiFillCaretDown } from 'react-icons/ai';
import { BsCode } from 'react-icons/bs';
import { GiCheckMark } from 'react-icons/gi';

export default function Home() {
  const session = useUserSession();

  async function callApi() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL ?? '', {
      headers: {
        Authorization: `Bearer ${session.data?.apiJwt}`,
      },
    });
  }

  const params = useSearchParams();

  return (
    <main className="flex flex-col flex-1 py-4 text-primary-white">
      <div className="flex w-full justify-between gap-2 items-center px-4 pb-4 border-b border-gray-600">
        <div className="flex gap-2 items-center ">
          <BsCode style={{ width: '30px', height: '30px' }} />
          <h1 className="text-lg font-bold">Discover gists</h1>
        </div>
        <div>
          <SortDetails
            sortBy={params.get('sort')}
            direction={params.get('direction')}
          />
        </div>
      </div>
      <div>
        <div>
          <button onClick={() => callApi()}>Call Api</button>
        </div>
      </div>
    </main>
  );
}
