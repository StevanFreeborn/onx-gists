import { nextAuthOptions } from '@/auth/nextAuthOptions';
import GistsPage from '@/components/GistsPage';
import { prismaClient } from '@/data/client';
import { client } from '@/http/client';
import { gistService } from '@/services/gistService';
import { Gist, createGist } from '@/types';
import {
  getDirectionQueryParam,
  getPageQueryParam,
  getSortQueryParam,
  sortGists,
} from '@/utils/utils';
import { getServerSession } from 'next-auth';

export default async function Search({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(nextAuthOptions);
  const { getGists } = gistService(
    client({ authHeader: { Authorization: `Bearer ${session?.apiJwt}` } })
  );
  const page = getPageQueryParam(searchParams);
  const sort = getSortQueryParam(searchParams);
  const direction = getDirectionQueryParam(searchParams);

  const searchTermParam = searchParams['searchTerm'];
  const searchTerm = Array.isArray(searchTermParam) ? '' : searchTermParam;

  const gistsResult = await getGists({
    pageNumber: page,
    includePublic: true,
    includePrivate: false,
    searchTerm: searchTerm,
    sort: sort,
    direction: direction,
  });

  if (gistsResult.ok === false) {
    throw new Error('Error getting gists');
  }

  const { gists: gistDtos, ...pageInfo } = gistsResult.value;
  const gistUsers = gistDtos.map(gist => gist.userId);
  const users = await prismaClient.user.findMany({
    where: { id: { in: gistUsers } },
  });

  const gists: Gist[] = [];

  for (const gistDto of gistDtos) {
    const user = users.find(user => user.id === gistDto.userId);

    if (user === undefined) {
      continue;
    }

    gists.push(createGist(gistDto, user));
  }

  const sortedGists = sortGists(gists, sort, direction);

  return (
    <GistsPage
      heading={`${pageInfo.totalGists} gist results`}
      sort={sort}
      direction={direction}
      gists={sortedGists}
      pageInfo={pageInfo}
      searchTerm={searchTerm}
    />
  );
}
