'use client';

import { SortOrders } from '@/enums/sortOrders';
import Details from './Details';

export default function SortDetails({
  sortBy,
  direction,
  page,
  searchTerm,
}: {
  sortBy?: string | null;
  direction?: string | null;
  page?: number;
  searchTerm?: string;
}) {
  const currentLinkKey =
    sortBy === undefined ||
    sortBy === null ||
    direction === undefined ||
    direction === null
      ? SortOrders.createdDescending
      : `${sortBy}-${direction}`;

  type Links = {
    [key: string]: { linkText: string; href: string };
  };

  let links: Links = {
    [SortOrders.createdDescending]: {
      linkText: 'Recently Created',
      href: '?direction=desc&sort=created',
    },
    [SortOrders.createdAscending]: {
      linkText: 'Least Recently Created',
      href: '?direction=asc&sort=created',
    },
    [SortOrders.updatedDescending]: {
      linkText: 'Recently Updated',
      href: '?direction=desc&sort=updated',
    },
    [SortOrders.updatedAscending]: {
      linkText: 'Least Recently Updated',
      href: '?direction=asc&sort=updated',
    },
  };

  if (page) {
    links = Object.fromEntries(
      Object.entries(links).map(([key, value]) => {
        return [key, { ...value, href: `${value.href}&page=${page}` }];
      })
    );
  }

  if (searchTerm) {
    links = Object.fromEntries(
      Object.entries(links).map(([key, value]) => {
        return [
          key,
          { ...value, href: `${value.href}&searchTerm=${searchTerm}` },
        ];
      })
    );
  }

  return <Details label="Sort" currentLinkKey={currentLinkKey} links={links} />;
}
