'use client';

import { Gist as GistType } from '@/types';
import { BsCode } from 'react-icons/bs';
import Gist from './Gist';
import Pager from './Pager';
import SortDetails from './SortDetails';
import TypeDetails from './TypeDetails';

type Param = string | undefined | null;

type PageInfo = {
  pageNumber: number;
  pageSize: number;
  totalGists: number;
  totalPages: number;
  hasNextPage: boolean;
};

export default function GistsPage({
  heading,
  isCurrentUsersPage = false,
  currentUserId = '',
  sort,
  direction,
  gists,
  pageInfo,
  type,
}: {
  heading: string;
  isCurrentUsersPage?: boolean;
  currentUserId?: string;
  sort: Param;
  direction: Param;
  gists: GistType[];
  pageInfo: PageInfo;
  type?: string;
}) {
  function renderGists() {
    return gists.map(gist => {
      return <Gist key={gist.id} gist={gist} />;
    });
  }

  function renderPager() {
    return (
      <div className="flex flex-col w-full gap-4 max-w-4xl">
        <Pager
          currentPage={pageInfo.pageNumber}
          hasNextPage={pageInfo.hasNextPage}
          direction={direction}
        />
      </div>
    );
  }

  return (
    <main className="flex flex-col h-full flex-1 py-4 text-primary-white">
      <div className="flex w-full justify-between gap-2 items-center px-4 pb-4 border-b border-gray-600">
        <div className="flex gap-2 items-center justify-center">
          <BsCode className="w-8 h-8" />
          <h1 className="text-lg font-bold">{heading}</h1>
        </div>
        <div className="flex gap-2 relative">
          {isCurrentUsersPage ? (
            <TypeDetails userId={currentUserId} type={type ?? 'all'} />
          ) : null}
          <SortDetails
            sortBy={sort}
            direction={direction}
            page={pageInfo.pageNumber}
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 w-full items-center gap-8 py-6 px-4">
        {gists.length > 0 ? (
          renderGists()
        ) : (
          <h2 className="text-lg font-bold">
            Hmmm doesn't look like we have any of those.
          </h2>
        )}
        {pageInfo.totalPages > 1 ? renderPager() : null}
      </div>
    </main>
  );
}
