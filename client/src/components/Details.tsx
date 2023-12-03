'use client';

import { useEffect, useRef } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { GiCheckMark } from 'react-icons/gi';

function DetailLink({
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
    <a
      onClick={linkClickHandler}
      href={link.href}
      className="flex gap-2 items-center p-2 pl-7 border-b border-gray-600"
    >
      <GiCheckMark className={currentLinkKey == linkKey ? '' : 'invisible'} />
      <span className="hover:text-primary-orange">{link.linkText}</span>
    </a>
  );
}

export default function Details({
  label,
  currentLinkKey,
  links,
}: {
  label: string;
  currentLinkKey: string;
  links: { [key: string]: { linkText: string; href: string } };
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

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
    <details ref={detailsRef} className="text-xs">
      <summary className="flex gap-1 items-center justify-center py-1 px-2 list-none bg-secondary-gray border border-gray-600 rounded cursor-pointer hover:bg-gray-600">
        <span>{label}:</span>
        <span className="font-semibold">{currentLink.linkText}</span>
        <AiFillCaretDown style={{ width: '10px', height: '10px' }} />
      </summary>
      <div className="absolute mt-2 right-0 w-[300px] bg-secondary-gray rounded-md border border-gray-600 z-50">
        <div className="py-2 px-3 border-b border-gray-600">
          <span>{label} Options</span>
        </div>
        <div className="flex flex-col">
          {Object.keys(links).map(link => (
            <DetailLink
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
