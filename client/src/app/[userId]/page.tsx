import { nextAuthOptions } from '@/auth/nextAuthOptions';
import Gist from '@/components/Gist';
import SortDetails from '@/components/SortDetails';
import { fakeGists } from '@/constants/constants';
import { Visibility } from '@/types/gist';
import {
  getDirectionQueryParam,
  getPageQueryParam,
  getSortQueryParam,
  sortGists,
} from '@/utils/utils';
import { getServerSession } from 'next-auth';
import { BsCode } from 'react-icons/bs';

export default async function UsersGists({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(nextAuthOptions);
  const page = getPageQueryParam(searchParams);
  const sort = getSortQueryParam(searchParams);
  const direction = getDirectionQueryParam(searchParams);

  // TODO: Actually get gists from gist service
  const filteredGists =
    params.userId === session?.userId
      ? fakeGists.filter(gist => gist.userId === params.userId)
      : fakeGists.filter(
          gist =>
            gist.userId === params.userId &&
            gist.visibility === Visibility.public
        );

  const sortedGists = sortGists(filteredGists, sort, direction);

  return (
    <main className="flex flex-col h-full flex-1 py-4 text-primary-white">
      <div className="flex w-full justify-between gap-2 items-center px-4 pb-4 border-b border-gray-600">
        <div className="flex gap-2 items-center justify-center">
          <BsCode className="w-8 h-8" />
          <h1 className="text-lg font-bold">Your gists</h1>
        </div>
        <div>
          {/* TODO: Create type detail component */}
          <SortDetails sortBy={sort} direction={direction} />
        </div>
      </div>
      <div className="flex flex-col flex-1 w-full items-center gap-8 py-6 px-4">
        {sortedGists.map(gist => {
          return <Gist key={gist.id} gist={gist} />;
        })}
        <div className="flex flex-col w-full gap-4 max-w-4xl">
          {/* TODO: Determine page links based on current paging */}
          {/* TODO: Hider page component if only one page */}
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
