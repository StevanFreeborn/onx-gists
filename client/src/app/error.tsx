'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col gap-4 w-full h-full items-center justify-center text-primary-white">
      <h1 className="text-5xl font-bold">Oh no! Something went wrong!</h1>
      <button
        onClick={() => reset()}
        className="bg-secondary-gray rounded-md px-2 py-1 hover:bg-primary-orange"
      >
        Try again
      </button>
    </main>
  );
}
