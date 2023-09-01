import NotFound from '@/app/not-found';
import { nextAuthOptions } from '@/auth/nextAuthOptions';
import GistForm from '@/components/GistForm';
import { fakeGists } from '@/constants/constants';
import { Visibility } from '@/types/gist';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { BsFillTrashFill } from 'react-icons/bs';

export default async function EditGist({ params }: { params: { id: string } }) {
  const session = await getServerSession(nextAuthOptions);
  const gist = fakeGists.find(gist => gist.id === params.id);
  const isCurrentUsersGist = gist?.userId === session?.userId;

  if (gist === undefined) {
    return <NotFound />;
  }

  if (isCurrentUsersGist === false && gist.visibility === Visibility.private) {
    return <NotFound />;
  }

  return (
    <main className="flex flex-col w-full h-full p-4 items-center text-primary-white">
      <div className="flex w-full items-center justify-center pt-2 pb-6 border-b border-gray-600">
        <div className="flex w-full max-w-4xl items-center justify-between">
          <div className="flex gap-1">
            <span>Editing</span>
            <Link
              href={`/gists/${gist.id}`}
              className="text-primary-orange font-semibold hover:underline"
            >
              {gist.name}
            </Link>
          </div>
          {isCurrentUsersGist ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm bg-secondary-gray border border-gray-600 hover:bg-red-600 hover:text-primary-white group/delete"
              >
                <BsFillTrashFill className="w-3 h-3 text-red-600 group-hover/delete:text-primary-white" />
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col w-full h-full items-center mt-8">
        <GistForm gist={gist} readOnly={false} />
      </div>
    </main>
  );
}
