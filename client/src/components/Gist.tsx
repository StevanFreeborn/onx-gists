import Image from 'next/image';
import Link from 'next/link';
import Editor from './Editor';

export type Gist = {
  id: string;
  userId: string;
  username: string;
  name: string;
  description: string;
  formula: string[];
  updated: string;
  created: string;
};

function timeFromNow(date: string) {
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

export default function Gist({ gist }: { gist: Gist }) {
  return (
    <div className="flex flex-col w-full gap-4 max-w-4xl">
      <div>
        <div className="flex gap-3 items-start">
          <div>
            <Image
              src={'https://placehold.co/400'}
              alt="User Image"
              width={30}
              height={30}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex gap-1">
              <Link href="#" className="text-primary-orange hover:underline">
                {gist.username}
              </Link>
              <span>/</span>
              <Link
                href={`/gists/${gist.id}`}
                className="text-primary-orange font-semibold hover:underline"
              >
                {gist.name}
              </Link>
            </div>
            <div>
              <div className="text-xs text-gray-500">
                Created {timeFromNow(gist.created)}
              </div>
              <div className="text-xs text-gray-500">
                Updated {timeFromNow(gist.updated)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link href={`/gists/${gist.id}`} className="relative">
        <div className="border max-h-[calc(1em_*_10_*_1.185)] overflow-hidden border-gray-600 rounded-md px-1 hover:border-primary-orange">
          <Editor docState={gist.formula} readonly={true} />
        </div>
        <div className="absolute w-full h-full text-right rounded-md opacity-0 right-0 top-0 hover:border hover:border-primary-orange hover:opacity-100">
          <span className="py-[7px] px-2 rounded-tr-md text-xs m--1 bg-primary-orange text-primary-white">
            {gist.name}
          </span>
        </div>
      </Link>
    </div>
  );
}
