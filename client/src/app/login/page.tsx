'use client';

import { useUserSession } from '@/auth/useUserSession';
import { useRouter } from '@/hooks/useRouter';
import { signIn } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { BsGithub, BsGoogle, BsMicrosoft } from 'react-icons/bs';

export default function Login() {
  const queryParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = queryParams.get('callbackUrl') ?? '/';
  const error = queryParams.get('error');
  const { status, data } = useUserSession();

  if (status === 'authenticated') {
    redirect('/');
  }

  async function handleSignIn(provider: string) {
    const data = await signIn(provider, {
      redirect: false,
      callbackUrl: callbackUrl,
    });

    if (data !== undefined && data.url !== null) {
      router.push(data.url);
    }
  }

  return (
    <main className="flex flex-col w-full h-full items-center justify-start gap-4 text-primary-white">
      <h1 className="text-3xl font-bold mt-8">Sign in to OnxGists</h1>
      {error ? (
        // TODO: Display more meaningful errors based on: https://next-auth.js.org/configuration/pages#sign-in-page
        <p className="text-red-600 font-semibold">
          We&apos;ve encountered an error. Unable to sign in. Please try again.
        </p>
      ) : null}
      <div className="flex flex-col gap-4 p-8 rounded-md bg-secondary-gray">
        <button
          onClick={async () => await handleSignIn('github')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary-gray hover:bg-gradient-to-br from-blue-600 via-purple-600 to-red-600"
        >
          <BsGithub className="w-5 h-5" />
          Sign in with Github
        </button>
        <button
          onClick={async () => handleSignIn('google')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary-gray hover:bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"
        >
          <BsGoogle className="w-5 h-5" />
          Sign in with Google
        </button>
        <button
          onClick={async () => handleSignIn('azure-ad')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary-gray hover:bg-gradient-to-r from-red-600 via-green-600 to-blue-600"
        >
          <BsMicrosoft className="w-5 h-5" />
          Sign in with Microsoft
        </button>
      </div>
    </main>
  );
}
