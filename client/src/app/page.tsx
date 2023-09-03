import GistsPage from '@/components/GistsPage';
import { fakeGists } from '@/constants/constants';
import {
  getDirectionQueryParam,
  getPageQueryParam,
  getSortQueryParam,
  sortGists,
} from '@/utils/utils';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = getPageQueryParam(searchParams);
  const sort = getSortQueryParam(searchParams);
  const direction = getDirectionQueryParam(searchParams);

  // TODO: Actually get gists from gist service
  const sortedGists = sortGists(fakeGists, sort, direction);

  return (
    <GistsPage
      heading="Discover gists"
      sort={sort}
      direction={direction}
      gists={sortedGists}
    />
  );
}
