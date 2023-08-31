import GistForm from '@/components/GistForm';
import { fakeGists } from '@/constants/constants';
import Link from 'next/link';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

export default function Gist({ params }: { params: { id: string } }) {
  const gist = fakeGists.find(gist => gist.id === params.id);

  return (
    <main className="flex flex-col w-full h-full p-4 items-center text-primary-white">
      <div className="flex w-full items-center justify-between border-b border-gray-600">
        <div className="flex">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/gists/${params.id}/edit`}
            type="button"
            className="flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm bg-secondary-gray border border-gray-600"
          >
            <BsFillPencilFill className="w-3 h-3" />
            Edit
          </Link>
          <button
            type="button"
            className="flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm bg-secondary-gray border border-gray-600"
          >
            <BsFillTrashFill className="w-3 h-3 text-red-600" />
            Delete
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full items-center mt-8">
        <GistForm />
      </div>
    </main>
  );
}
