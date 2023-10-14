'use client';

import { useRouter } from '@/hooks/useRouter';

export default function Pager({
  currentPage,
  hasNextPage,
  direction,
}: {
  currentPage: number;
  hasNextPage: boolean;
  direction: string | null | undefined;
}) {
  const router = useRouter();

  // TODO: This I think can be simplified
  const isAscending = direction === 'asc';

  function handleOlderButtonClick() {
    const olderUrl = new URL(window.location.href);
    const page = isAscending ? currentPage - 1 : currentPage + 1;

    olderUrl.searchParams.set('page', `${page}`);

    router.push(olderUrl.toString());
  }

  function handleNewerButtonClick() {
    const newerUrl = new URL(window.location.href);
    const page = isAscending ? currentPage + 1 : currentPage - 1;

    newerUrl.searchParams.set('page', `${page}`);

    router.push(newerUrl.toString());
  }

  function OlderButton() {
    return (
      <button
        onClick={handleOlderButtonClick}
        disabled={isAscending ? currentPage <= 1 : hasNextPage === false}
        className="hover:text-primary-orange disabled:text-gray-500 disabled:hover:text-gray-500"
      >
        Older
      </button>
    );
  }

  function NewerButton() {
    return (
      <button
        onClick={handleNewerButtonClick}
        disabled={isAscending ? hasNextPage === false : currentPage <= 1}
        className="hover:text-primary-orange disabled:text-gray-500 disabled:hover:text-gray-500"
      >
        Newer
      </button>
    );
  }

  return (
    <div className="flex w-full items-center justify-center gap-4 pt-2">
      {isAscending ? (
        <>
          <OlderButton />
          <NewerButton />
        </>
      ) : (
        <>
          <NewerButton />
          <OlderButton />
        </>
      )}
    </div>
  );
}
