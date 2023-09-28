import { Visibility } from '@/types';
import Details from './Details';

export default function TypeDetails({
  userId,
  type,
}: {
  userId: string;
  type: string;
}) {
  const currentLinkKey =
    type === Visibility.public || type === Visibility.private ? type : 'all';

  const links = {
    all: {
      linkText: 'All',
      href: `/${userId}`,
    },
    [Visibility.private]: {
      linkText: 'Private',
      href: `/${userId}/private`,
    },
    [Visibility.public]: {
      linkText: 'Public',
      href: `/${userId}/public`,
    },
  };

  return <Details label="Type" currentLinkKey={currentLinkKey} links={links} />;
}
