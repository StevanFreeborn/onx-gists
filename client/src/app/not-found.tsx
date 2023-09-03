import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col gap-4 w-full h-full items-center justify-center text-primary-white">
      <h1 className="text-5xl font-bold">Not Found</h1>
      <div className="flex flex-col gap-2 items-center justify-center">
        <p className="text-2xl">This is not the page you were looking for.</p>
        <Link
          href="/"
          className="w-max bg-secondary-gray rounded-md px-2 py-1 hover:bg-primary-orange"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
