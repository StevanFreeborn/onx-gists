import { nextAuthOptions } from '@/auth/nextAuthOptions';
import GistForm from '@/components/GistForm';
import { fakeGists } from '@/constants/constants';
import { timeFromNow } from '@/utils/utils';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

export default async function ViewGist({ params }: { params: { id: string } }) {
  const session = await getServerSession(nextAuthOptions);
  const gist = fakeGists.find(gist => gist.id === params.id);
  const isCurrentUsersGist = gist?.userId === session?.userId;

  if (gist === undefined) {
    // TODO: redirect to 404 page
    return;
  }

  return (
    <main className="flex flex-col w-full h-full p-4 items-center text-primary-white">
      <div className="flex w-full items-start justify-between pt-2 pb-6 border-b border-gray-600">
        <div className="flex gap-2">
          <div>
            <Image
              src={'https://placehold.co/400'}
              alt="User Image"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1 text-lg">
            <div className="flex gap-1">
              <Link href="#" className="text-primary-orange hover:underline">
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
        {isCurrentUsersGist ? (
          <div className="flex items-center gap-4">
            <Link
              href={`/gists/${params.id}/edit`}
              type="button"
              className="flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm bg-secondary-gray border border-gray-600 hover:bg-gray-600"
            >
              <BsFillPencilFill className="w-3 h-3" />
              Edit
            </Link>
            <button
              type="button"
              className="flex items-center justify-center gap-1 px-2 py-1 rounded-md text-sm bg-secondary-gray border border-gray-600 hover:bg-red-600 group/delete"
            >
              <BsFillTrashFill className="w-3 h-3 text-red-600 group-hover/delete:text-primary-white" />
              Delete
            </button>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col w-full h-full items-center mt-8">
        <GistForm gist={gist} readOnly={true} />
      </div>
    </main>
  );
}
