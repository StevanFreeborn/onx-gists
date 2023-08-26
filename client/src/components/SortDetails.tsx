'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { GiCheckMark } from 'react-icons/gi';

enum SortOrders {
  createdDescending = 'created-desc',
  createdAscending = 'created-asc',
  updatedDescending = 'updated-desc',
  updatedAscending = 'updated-asc',
}

function SortLink({
  currentLinkKey,
  linkKey,
  link,
  linkClickHandler,
}: {
  currentLinkKey: string;
  linkKey: string;
  link: { linkText: string; href: string };
  linkClickHandler: () => void;
}) {
  return (
    <Link
      onClick={linkClickHandler}
      href={link.href}
      className="flex gap-2 items-center p-2 pl-7 border-b border-gray-600"
    >
      <GiCheckMark className={currentLinkKey == linkKey ? '' : 'invisible'} />
      <span>{link.linkText}</span>
    </Link>
  );
}

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

  const detailsRef = useRef<HTMLDetailsElement>(null);

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
      linkText: 'Least Updated Created',
      href: '?direction=asc&sort=updated',
    },
  } as { [key: string]: { linkText: string; href: string } };

  const currentLink = links[currentLinkKey];

  function handleLinkClick() {
    if (detailsRef.current && detailsRef.current.open) {
      detailsRef.current.open = false;
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        detailsRef.current &&
        detailsRef.current.open &&
        detailsRef.current.contains(e.target as Node) === false
      ) {
        detailsRef.current.open = false;
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [detailsRef]);

  return (
    <details ref={detailsRef} className="relative text-xs">
      <summary className="flex gap-1 items-center justify-center py-1 px-2 list-none bg-secondary-gray border border-gray-600 rounded cursor-pointer">
        <span>Sort:</span>
        <span className="font-semibold">{currentLink.linkText}</span>
        <AiFillCaretDown style={{ width: '10px', height: '10px' }} />
      </summary>
      <div className="absolute mt-2 left-auto right-0 w-[300px] bg-secondary-gray rounded-md border border-gray-600 z-50">
        <div className="py-2 px-3 border-b border-gray-600">
          <span>Sort Options</span>
        </div>
        <div className="flex flex-col">
          {Object.keys(links).map(link => (
            <SortLink
              key={link}
              currentLinkKey={currentLinkKey}
              linkKey={link}
              link={links[link]}
              linkClickHandler={handleLinkClick}
            />
          ))}
        </div>
      </div>
    </details>
  );
}