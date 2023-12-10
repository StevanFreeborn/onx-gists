import NotFound from '@/app/not-found';
import { nextAuthOptions } from '@/auth/nextAuthOptions';
import GistsPage from '@/components/GistsPage';
import { prismaClient } from '@/data/client';
import { client } from '@/http/client';
import { gistService } from '@/services/gistService';
import { Visibility, createGist } from '@/types';
import {
  getDirectionQueryParam,
  getPageQueryParam,
  getSortQueryParam,
} from '@/utils/utils';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export default async function UsersPrivateGists({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(nextAuthOptions);
  const { getGists } = gistService(
    client({ authHeader: { Authorization: `Bearer ${session?.apiJwt}` } })
  );
  const page = getPageQueryParam(searchParams);
  const sort = getSortQueryParam(searchParams);
  const direction = getDirectionQueryParam(searchParams);
  const isCurrentUsersPage = params.userId === session?.userId;

  const user = await prismaClient.user.findUnique({
    where: { id: params.userId },
  });

  if (user === null || user.id !== session?.userId) {
    return <NotFound />;
  }

  const gistsResult = await getGists({
    userId: params.userId,
    pageNumber: page,
    includePrivate: true,
    includePublic: false,
    sort: sort,
    direction: direction,
  });

  if (gistsResult.ok === false) {
    throw new Error('Error getting gists');
  }

  const { gists: gistDtos, ...pageInfo } = gistsResult.value;

  const gists = gistDtos.map(gist => createGist(gist, user));

  return (
    <GistsPage
      heading="Your private gists"
      isCurrentUsersPage={isCurrentUsersPage}
      currentUserId={params.userId}
      sort={sort}
      direction={direction}
      gists={gists}
      pageInfo={pageInfo}
      type={Visibility.private}
    />
  );
}
