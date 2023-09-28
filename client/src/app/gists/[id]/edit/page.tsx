import NotFound from '@/app/not-found';
import { nextAuthOptions } from '@/auth/nextAuthOptions';
import DeleteButton from '@/components/DeleteButton';
import GistForm from '@/components/GistForm';
import { prismaClient } from '@/data/client';
import { client } from '@/http/client';
import { gistService } from '@/services/gistService';
import { Visibility, createGist } from '@/types/gist';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditGist({ params }: { params: { id: string } }) {
  const session = await getServerSession(nextAuthOptions);
  const { getGist } = gistService(
    client({ authHeader: { Authorization: `Bearer ${session?.apiJwt}` } })
  );
  const gistResult = await getGist(params.id);

  if (gistResult.ok === false) {
    return <NotFound />;
  }

  const gistDto = gistResult.value;
  const gistUser = await prismaClient.user.findUnique({
    where: { id: gistDto.userId },
  });

  if (gistUser === null) {
    return <NotFound />;
  }

  const gist = createGist(gistDto, gistUser);

  const isCurrentUsersGist = gist.userId === session?.userId;

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
              <DeleteButton id={gist.id} />
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
