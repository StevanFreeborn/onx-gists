import { SortOrders } from '@/enums/sortOrders';
import Details from './Details';

export default function SortDetails({
  sortBy,
  direction,
}: {
  sortBy?: string | null;
  direction?: string | null;
}) {
  const currentLinkKey =
    sortBy === undefined ||
    sortBy === null ||
    direction === undefined ||
    direction === null
      ? SortOrders.createdDescending
      : `${sortBy}-${direction}`;

  const links = {
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

  return <Details label="Sort" currentLinkKey={currentLinkKey} links={links} />;
}
