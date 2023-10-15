import { SortOrders } from '@/enums/sortOrders';
import { Gist } from '@/types';

export function getKeysFromObject<T>(formFields: T) {
  return Object.keys(formFields as object).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: curr,
    }),
    {}
  ) as {
    [k in keyof T]: k;
  };
}

export function toTitleCase(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function timeFromNow(date: string) {
  const now = new Date();
  const timestamp = new Date(date);
  const secondsSince = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  if (secondsSince < 60) {
    return `${secondsSince} seconds ago`;
  }

  const minutes = Math.floor(secondsSince / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const hours = Math.floor(secondsSince / 3600);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  const days = Math.floor(secondsSince / 86400);
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  const months = Math.floor(secondsSince / 2592000);
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(secondsSince / 31536000);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export function sortGists(
  gists: Gist[],
  sort: string | null | undefined,
  direction: string | null | undefined
) {
  const sortOrder = `${sort}-${direction}`;

  return [...gists].sort((a, b) => {
    if (sortOrder === SortOrders.createdAscending) {
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    }

    if (sortOrder === SortOrders.updatedDescending) {
      return new Date(b.updated).getTime() - new Date(a.updated).getTime();
    }

    if (sortOrder === SortOrders.updatedAscending) {
      return new Date(a.updated).getTime() - new Date(b.updated).getTime();
    }

    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });
}

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export function getPageQueryParam(searchParams: SearchParams) {
  const pageParam = searchParams['page'];
  return pageParam === undefined || Array.isArray(pageParam)
    ? 1
    : Number.isNaN(parseInt(pageParam))
    ? 1
    : parseInt(pageParam);
}

export function getSortQueryParam(searchParams: SearchParams) {
  const sortParam = searchParams['sort'];
  return Array.isArray(sortParam) ? null : sortParam;
}

export function getDirectionQueryParam(searchParams: SearchParams) {
  const directionParam = searchParams['direction'];
  return Array.isArray(directionParam) ? null : directionParam;
}
