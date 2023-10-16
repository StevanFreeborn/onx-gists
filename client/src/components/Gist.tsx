import { Gist } from '@/types';
import { timeFromNow } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import Editor from './Editor';

export default function Gist({
  gist,
  hideEditorScrollbar = false,
}: {
  gist: Gist;
  hideEditorScrollbar?: boolean;
}) {
  return (
    <div className="flex flex-col w-full gap-4 max-w-4xl">
      <div>
        <div className="flex gap-3 items-start">
          <div>
            <Image
              src={gist.userImage}
              alt="User Image"
              width={30}
              height={30}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex gap-1">
              <Link
                href={`/${gist.userId}`}
                className="text-primary-orange hover:underline"
              >
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
          <Editor
            docState={gist.formula}
            readonly={true}
            hideEditorScrollbar={hideEditorScrollbar}
          />
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
