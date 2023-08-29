import { nextAuthOptions } from '@/auth/nextAuthOptions';
import Gist from '@/components/Gist';
import SortDetails from '@/components/SortDetails';
import { getServerSession } from 'next-auth';
import { BsCode } from 'react-icons/bs';

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
      formula:
        "function(x) {\n\tvar hello = 'hello';\n\tvar hello = 'hellooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooj';\n\tvar hello = 'hello';\n\tvar hello = 'hello';\n\tvar hello = 'hello';\n\tvar hello = 'hello';\n\tvar hello = 'hello';\n\tvar hello = 'hello';\n\tvar hello = 'hello';\n\treturn Math.sin(x);\n}",
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
          return <Gist key={gist.id} gist={gist} />;
        })}
        <div className="flex flex-col w-full gap-4 max-w-4xl">
          <div className="flex w-full items-center justify-center gap-4 pt-2">
            <a href="#" className="hover:text-primary-orange">
              Older
            </a>
            <a href="#" className="hover:text-primary-orange">
              Newer
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
