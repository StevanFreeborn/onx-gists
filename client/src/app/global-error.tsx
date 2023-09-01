'use client';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html className="w-full h-full">
      <body className={`flex flex-col w-full h-full ${inter.className}`}>
        <main className="flex flex-col gap-4 w-full h-full items-center justify-center text-primary-white">
          <h1 className="text-5xl font-bold">Oh no! Something went wrong!</h1>
          <button
            onClick={() => reset()}
            className="bg-secondary-gray rounded-md px-2 py-1 hover:bg-primary-orange"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
