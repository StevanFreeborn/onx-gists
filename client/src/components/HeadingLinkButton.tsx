'use client';

import { MouseEvent, ReactNode, useState } from 'react';
import { AiOutlineLink } from 'react-icons/ai';

export default function HeadingLinkButton({
  hash,
  children,
}: {
  hash: string;
  children: ReactNode;
}) {
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleLinkButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    setButtonClicked(true);
    navigator.clipboard.writeText(window.location.href + '#' + hash);
    setTimeout(() => {
      setButtonClicked(false);
    }, 1000);
  };

  return (
    <div id={hash} className="flex items-center gap-1 w-max group/link-heading">
      {children}
      <button
        onClick={handleLinkButtonClick}
        className={`opacity-0 group-hover/link-heading:opacity-100 ${
          buttonClicked ? 'text-primary-orange' : ''
        }`}
      >
        <AiOutlineLink />
      </button>
    </div>
  );
}
