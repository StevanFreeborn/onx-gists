import { nextAuthOptions } from '@/auth/nextAuthOptions';
import Editor from '@/components/Editor';
import SortDetails from '@/components/SortDetails';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { BsCode } from 'react-icons/bs';

function timeFromNow(date: string) {
  const now = new Date();
  const timestamp = new Date(date);
  const secondsSince = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  if (secondsSince < 60) {
    return `${secondsSince} seconds ago`;
  }

  const minutes = Math.floor(secondsSince / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const hours = Math.floor(secondsSince / 3600);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  const days = Math.floor(secondsSince / 86400);
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  const months = Math.floor(secondsSince / 2592000);
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(secondsSince / 31536000);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(nextAuthOptions);
  const pageParam = searchParams['page'];
  const sortParam = searchParams['sort'];
  const directionParam = searchParams['direction'];

  const page =
    pageParam === undefined || Array.isArray(pageParam)
      ? 1
      : Number.isNaN(parseInt(pageParam))
      ? 1
      : parseInt(pageParam);

  const sort = Array.isArray(sortParam) ? null : sortParam;

  const direction = Array.isArray(directionParam) ? null : directionParam;

  // TODO: Actually get gists from gist service
  const gists = [
    {
      id: '1',
      userId: 'user456',
      username: 'jane_smith',
      name: 'Sample Object 2',
      description: 'This is the second sample object',
      formula: 'function(x) { return Math.pow(x, 2); }',
      updated: '2022-08-26',
      created: '2022-08-25',
    },
    {
      id: '2',
      userId: 'user789',
      username: 'sam_jackson',
      name: 'Sample Object 3',
      description: 'This is the third sample object',
      formula: 'function(x) {\n\treturn Math.sin(x);\n}',
      updated: '2021-08-26',
      created: '2021-08-25',
    },
    {
      id: '3',
      userId: 'user789',
      username: 'sam_jackson',
      name: 'Sample Object 3',
      description: 'This is the third sample object',
      formula: 'function(x) {\n\treturn Math.sin(x);\n}',
      updated: '2021-08-26',
      created: '2021-08-25',
    },
    {
      id: '4',
      userId: 'user789',
      username: 'sam_jackson',
      name: 'Sample Object 3',
      description: 'This is the third sample object',
      formula: 'function(x) {\n\treturn Math.sin(x);\n}',
      updated: '2021-08-26',
      created: '2021-08-25',
    },
    {
      id: '5',
      userId: 'user789',
      username: 'sam_jackson',
      name: 'Sample Object 3',
      description: 'This is the third sample object',
      formula: 'function(x) {\n\treturn Math.sin(x);\n}',
      updated: '2021-08-26',
      created: '2021-08-25',
    },
    {
      id: '6',
      userId: 'user789',
      username: 'sam_jackson',
      name: 'Sample Object 3',
      description: 'This is the third sample object',
      formula: 'function(x) {\n\treturn Math.sin(x);\n}',
      updated: '2021-08-26',
      created: '2021-08-25',
    },
    {
      id: '7',
      userId: 'user789',
      username: 'sam_jackson',
      name: 'Sample Object 3',
      description: 'This is the third sample object',
      formula: 'function(x) {\n\treturn Math.sin(x);\n}',
      updated: '2021-08-26',
      created: '2021-08-25',
    },
    {
      id: '8',
      userId: 'user789',
      username: 'sam_jackson',
      name: 'Sample Object 3',
      description: 'This is the third sample object',
      formula: 'function(x) {\n\treturn Math.sin(x);\n}',
      updated: '2021-08-26',
      created: '2021-08-25',
    },
    {
      id: '9',
      userId: 'user789',
      username: 'sam_jackson',
      name: 'Sample Object 3',
      description: 'This is the third sample object',
      formula: 'function(x) {\n\treturn Math.sin(x);\n}',
      updated: '2021-08-26',
      created: '2021-08-25',
    },
    {
      id: '10',
      userId: 'user789',
      username: 'sam_jackson',
      name: 'Sample Object 3',
      description: 'This is the third sample object',
      formula: 'function(x) {\n\treturn Math.sin(x);\n}',
      updated: '2021-08-26',
      created: '2021-08-25',
    },
  ].sort((a, b) => {
    if (sort === 'created' && direction === 'asc') {
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    }

    if (sort === 'updated' && direction === 'desc') {
      return new Date(b.updated).getTime() - new Date(a.updated).getTime();
    }

    if (sort === 'updated' && direction === 'asc') {
      return new Date(a.updated).getTime() - new Date(b.updated).getTime();
    }

    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });

  return (
    <main className="flex flex-col flex-1 py-4 text-primary-white">
      <div className="flex w-full justify-between gap-2 items-center px-4 pb-4 border-b border-gray-600">
        <div className="flex gap-2 items-center ">
          <BsCode style={{ width: '30px', height: '30px' }} />
          <h1 className="text-lg font-bold">Discover gists</h1>
        </div>
        <div>
          <SortDetails sortBy={sort} direction={direction} />
        </div>
      </div>
      <div className="flex flex-col w-full items-center justify-center gap-8 py-6 px-4">
        {gists.map(gist => {
          return (
            <div key={gist.id} className="flex flex-col w-full gap-4 max-w-4xl">
              <div>
                <div className="flex gap-3 items-start">
                  <div>
                    <Image
                      src={'https://placehold.co/400'}
                      alt="User Image"
                      width={30}
                      height={30}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex gap-1">
                      <Link
                        href="#"
                        className="text-primary-orange hover:underline"
                      >
                        {gist.username}
                      </Link>
                      <span>/</span>
                      <Link
                        href={`/gists/${gist.id}`}
                        className="text-primary-orange font-semibold hover:underline"
                      >
                        {gist.name}
                      </Link>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Created {timeFromNow(gist.created)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated {timeFromNow(gist.updated)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link href={`/gists/${gist.id}`} className="relative">
                <div className="border border-gray-600 rounded-md p-1 hover:border-primary-orange">
                  <Editor docState={gist.formula} readonly={true} />
                </div>
                <div className="absolute w-full h-full text-right rounded-md opacity-0 right-0 top-0 hover:border hover:border-primary-orange hover:opacity-100">
                  <span className="py-[7px] px-2 rounded-tr-md text-xs m--1 bg-primary-orange text-primary-white">
                    {gist.name}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
