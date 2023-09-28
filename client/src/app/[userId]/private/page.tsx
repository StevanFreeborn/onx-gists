import { nextAuthOptions } from '@/auth/nextAuthOptions';
import GistsPage from '@/components/GistsPage';
import { fakeGists } from '@/constants/constants';
import { Visibility } from '@/types';
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
  const page = getPageQueryParam(searchParams);
  const sort = getSortQueryParam(searchParams);
  const direction = getDirectionQueryParam(searchParams);
  const isCurrentUsersPage = params.userId === session?.userId;

  // TODO: Get user from database
  const user = fakeGists.find(gist => gist.userId === params.userId);

  // TODO: Actually get gists from gist service
  const filteredGists = isCurrentUsersPage
    ? fakeGists.filter(
        gist =>
          gist.userId === params.userId &&
          gist.visibility === Visibility.private
      )
    : fakeGists.filter(
        gist =>
          gist.userId === params.userId && gist.visibility === Visibility.public
      );

  return (
    <GistsPage
      heading={isCurrentUsersPage ? 'Your gists' : `${user?.username} gists`}
      isCurrentUsersPage={isCurrentUsersPage}
      currentUserId={params.userId}
      sort={sort}
      direction={direction}
      gists={filteredGists}
    />
  );
}
