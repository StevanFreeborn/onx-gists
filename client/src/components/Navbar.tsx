'use client';

import { useUserSession } from '@/auth/useUserSession';
import { useRouter } from '@/hooks/useRouter';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import { useEffect, useRef, useState } from 'react';
import { AiFillCaretDown, AiOutlinePlus } from 'react-icons/ai';

function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const data = await signOut({
          callbackUrl: '/',
          redirect: false,
        });
        router.push(data.url);
      }}
      className="block w-full py-2 pl-3 pr-4 text-left text-primary-white rounded md:p-0 md:hover:text-primary-orange hover:bg-primary-gray md:hover:bg-transparent"
    >
      Sign out
    </button>
  );
}

function UserModal({ user }: { user: Session | null }) {
  return (
    <div className="absolute flex flex-col mt-2 right-0 left-auto w-[180px] bg-secondary-gray border border-gray-600 rounded-md text-primary-white text-sm z-50">
      <div className="p-3 border-b border-gray-600">
        <div>Sign in as</div>
        <div className="font-semibold">{user?.user?.name}</div>
      </div>
      <ul className="flex flex-col gap-2 p-3 border-b border-gray-600">
        <li>
          <Link
            href="#"
            className="block rounded md:p-0 md:hover:text-primary-orange hover:bg-gray-700 md:hover:bg-transparent"
          >
            Your gists
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="block rounded md:p-0 md:hover:text-primary-orange hover:bg-gray-700 md:hover:bg-transparent"
          >
            Starred gists
          </Link>
        </li>
      </ul>
      <div className="p-3">
        <SignOutButton />
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isNavbarOpen, setIsNavBarOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const userModalRef = useRef<HTMLDivElement>(null);
  const { status, data: session } = useUserSession();
  const userImageSrc = session?.user?.image ?? 'https://placehold.co/400';
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isUserModalOpen &&
        userModalRef.current &&
        userModalRef.current.contains(e.target as Node) === false
      ) {
        setIsUserModalOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    NProgress.done();
    return () => document.removeEventListener('click', handleClickOutside);
  }, [pathname, searchParams, status, userModalRef, isUserModalOpen]);

  return (
    <nav className="bg-secondary-gray text-primary-white shadow-[rgba(0,_0,_0,_0.05)_0px_2px_5px_0px]">
      <div className="flex flex-col items-center justify-between mx-auto p-4 md:flex-row">
        <div className="flex flex-1 w-full justify-between gap-5 md:justify-start">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              Onx
            </span>
            <span className="self-center text-2xl whitespace-nowrap">
              Gists
            </span>
          </Link>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 pl-10 text-sm border rounded-lg bg-primary-gray border-gray-600 placeholder-gray-400 text-white"
              placeholder="Search..."
            />
          </div>
          <div className="flex md:order-1">
            {status === 'authenticated' ? (
              <Link
                href="#"
                className="flex w-full h-full items-center justify-center md:hidden py-2 pl-3 pr-4 text-primary-white hover:text-primary-orange"
              >
                <AiOutlinePlus />
              </Link>
            ) : null}
            <button
              onClick={() => setIsNavBarOpen(!isNavbarOpen)}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-primary-white rounded-lg md:hidden hover:text-primary-orange"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-2"
          style={{ display: isNavbarOpen ? 'block' : '' }}
          id="navbar-search"
        >
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 pl-10 text-sm border rounded-lg bg-primary-gray border-gray-600 placeholder-gray-400 text-white"
              placeholder="Search..."
            />
          </div>
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border  rounded-lg md:flex-row md:gap-3 md:mt-0 md:border-0 border-gray-600">
            {status === 'loading' ? (
              <li>Loading...</li>
            ) : status === 'unauthenticated' ? (
              <li>
                <Link
                  onClick={() => signIn()}
                  href="#"
                  className="block py-2 pl-3 pr-4 text-primary-white rounded md:hover:bg-transparent md:hover:text-primary-orange md:p-0 hover:bg-primary-gray"
                >
                  Sign up/in
                </Link>
              </li>
            ) : (
              <>
                <li className="md:hidden text-sm">
                  <Link
                    href="#"
                    className="flex w-full h-full items-center justify-start py-2 pl-3 pr-4 rounded md:p-0 hover:bg-primary-gray"
                  >
                    All Gists
                  </Link>
                </li>
                <li className="md:hidden text-sm">
                  <Link
                    href="#"
                    className="flex gap-2 w-full h-full items-center justify-start py-2 pl-3 pr-4 rounded hover:bg-primary-gray"
                  >
                    <Image
                      src={userImageSrc}
                      alt="Current User Image"
                      width={25}
                      height={25}
                      className="rounded-full object-cover"
                    />
                    {session?.user?.name}
                  </Link>
                </li>
                <li className="md:hidden text-sm">
                  <SignOutButton />
                </li>
                <li className="hidden md:block">
                  <Link
                    href="#"
                    className="flex w-full h-full items-center justify-center p-0 text-primary-white hover:text-primary-orange"
                  >
                    <AiOutlinePlus />
                  </Link>
                </li>
                <li className="relative hidden md:block">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(!isUserModalOpen)}
                    className="flex items-center justify-center gap-2 w-full p-0 text-left text-primary-white hover:text-primary-orange"
                  >
                    <Image
                      src={userImageSrc}
                      alt="Current User Image"
                      width={25}
                      height={25}
                      className="rounded-full object-cover"
                    />
                    <AiFillCaretDown
                      style={{ width: '10px', height: '10px' }}
                    />
                  </button>
                  <div
                    ref={userModalRef}
                    className={isUserModalOpen ? '' : 'hidden'}
                  >
                    <UserModal user={session} />
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
