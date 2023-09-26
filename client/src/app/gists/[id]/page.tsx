import NotFound from '@/app/not-found';
import { nextAuthOptions } from '@/auth/nextAuthOptions';
import GistForm from '@/components/GistForm';
import { client } from '@/http/client';
import { gistService } from '@/services/gistService';
import { Visibility, createGist } from '@/types/gist';
import { timeFromNow } from '@/utils/utils';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

export const dynamic = 'force-dynamic';

export default async function ViewGist({ params }: { params: { id: string } }) {
  const session = await getServerSession(nextAuthOptions);
  const { getGist } = gistService(
    client({ authHeader: { Authorization: `Bearer ${session?.apiJwt}` } })
  );
  const gistResult = await getGist(params.id);

  if (gistResult.ok === false) {
    return <NotFound />;
  }

  const gistDto = gistResult.value;
  const gistUser = await new PrismaClient().user.findUnique({
    where: { id: gistDto.userId },
  });

  if (gistUser === null) {
    return <NotFound />;
  }

  const gist = createGist(gistDto, gistUser);

  const isCurrentUsersGist = gist.userId === session?.userId;

  if (
    isCurrentUsersGist === false &&
    gistResult.value.visibility === Visibility.private
  ) {
    return <NotFound />;
  }

  return (
    <main className="flex flex-col w-full h-full p-4 items-center text-primary-white">
      <div className="flex w-full items-start justify-between pt-2 pb-6 border-b border-gray-600">
        <div className="flex items-start gap-2">
          <div>
            <Image
              src={gist.userImage}
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
          <div>
            <div className="border border-gray-600 rounded-full px-2 py-1 text-xs">
              {gist.visibility}
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
