import { nextAuthOptions } from '@/auth/nextAuthOptions';
import GistsPage from '@/components/GistsPage';
import { prismaClient } from '@/data/client';
import { client } from '@/http/client';
import { gistService } from '@/services/gistService';
import { createGist } from '@/types';
import {
  getDirectionQueryParam,
  getPageQueryParam,
  getSortQueryParam,
  sortGists,
} from '@/utils/utils';
import { getServerSession } from 'next-auth';
import NotFound from '../not-found';

export const dynamic = 'force-dynamic';

export default async function UsersGists({
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

  if (user === null) {
    return <NotFound />;
  }

  const gistsResult = await getGists({
    userId: params.userId,
    pageNumber: page,
    includePrivate: isCurrentUsersPage,
    includePublic: true,
  });

  if (gistsResult.ok === false) {
    throw new Error('Error getting gists');
  }

  const { gists: gistDtos, ...pageInfo } = gistsResult.value;

  const gists = gistDtos.map(gist => createGist(gist, user));

  const sortedGists = sortGists(gists, sort, direction);

  return (
    <GistsPage
      heading={isCurrentUsersPage ? 'Your gists' : `${user.id}'s gists`}
      isCurrentUsersPage={isCurrentUsersPage}
      currentUserId={params.userId}
      sort={sort}
      direction={direction}
      gists={sortedGists}
      pageInfo={pageInfo}
    />
  );
}
