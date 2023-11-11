import NotFound from '@/app/not-found';
import { nextAuthOptions } from '@/auth/nextAuthOptions';
import ProfileForm from '@/components/ProfileForm';
import { prismaClient } from '@/data/client';
import { UserProfile } from '@/types';
import { getServerSession } from 'next-auth';

export default async function UserProfile({
  params,
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(nextAuthOptions);
  const user = await prismaClient.user.findUnique({
    where: { id: params.userId },
  });

  if (user === null || user.id !== session?.userId) {
    return <NotFound />;
  }

  const userProfile: UserProfile = {
    username: user.username,
    userImage: user.image,
    userId: user.id,
    name: user.name,
    email: user.email,
  };

  return (
    <main className="w-full h-full flex flex-col items-center flex-1 p-4 text-primary-white">
      <div className="w-full h-full flex flex-col gap-6 max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold">Profile</h1>
        </div>
        <ProfileForm profile={userProfile} />
      </div>
    </main>
  );
}
