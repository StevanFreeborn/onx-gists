import { nextAuthOptions } from '@/auth/nextAuthOptions';
import { prismaClient } from '@/data/client';
import { UserProfile } from '@/types';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(nextAuthOptions);

  if (session?.userId !== params.userId) {
    return Response.json(
      { error: 'You are not authorized to get this profile' },
      { status: 401 }
    );
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  if (user === null) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const userProfile: UserProfile = {
    userId: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    userImage: user.image,
  };

  return Response.json(userProfile, { status: 200 });
}
