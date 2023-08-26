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

export default function SortDetails({
  sortBy,
  direction,
}: {
  sortBy?: string | null;
  direction?: string | null;
}) {
  const current =
    sortBy === undefined ||
    sortBy === null ||
    direction === undefined ||
    direction === null
      ? SortOrders.createdDescending
      : `${sortBy}-${direction}`;

  const detailsRef = useRef<HTMLDetailsElement>(null);

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
  });

  return (
    <details ref={detailsRef} className="relative text-xs">
      <summary className="flex gap-1 items-center justify-center py-1 px-2 list-none bg-secondary-gray border border-gray-600 rounded cursor-pointer">
        <span>Sort:</span>
        <span className="font-semibold">Recently Created</span>
        <AiFillCaretDown style={{ width: '10px', height: '10px' }} />
      </summary>
      <div className="absolute mt-2 left-auto right-0 w-[300px] bg-secondary-gray rounded-md border border-gray-600 z-50">
        <div className="py-2 px-3 border-b border-gray-600">
          <span>Sort Options</span>
        </div>
        <div className="flex flex-col">
          <Link
            href="#"
            className="flex gap-2 items-center p-2 pl-7 border-b border-gray-600"
          >
            <GiCheckMark
              className={
                current == SortOrders.createdDescending ? '' : 'invisible'
              }
            />
            <span>Recently Created</span>
          </Link>
          <Link
            href="#"
            className="flex gap-2 items-center p-2 pl-7 border-b border-gray-600"
          >
            <GiCheckMark
              className={
                current == SortOrders.createdAscending ? '' : 'invisible'
              }
            />
            <span>Least Recently Created</span>
          </Link>
          <Link
            href="#"
            className="flex gap-2 items-center p-2 pl-7 border-b border-gray-600"
          >
            <GiCheckMark
              className={
                current == SortOrders.updatedDescending ? '' : 'invisible'
              }
            />
            <span>Recently Updated</span>
          </Link>
          <Link href="#" className="flex gap-2 items-center p-2 pl-7">
            <GiCheckMark
              className={
                current == SortOrders.updatedAscending ? '' : 'invisible'
              }
            />
            <span>Least Recently Created</span>
          </Link>
        </div>
      </div>
    </details>
  );
}
