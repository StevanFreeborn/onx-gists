import { nextAuthOptions } from '@/auth/nextAuthOptions';
import { prismaClient } from '@/data/client';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  const { userId, username } = await request.json();
  const session = await getServerSession(nextAuthOptions);

  if (session?.userId !== userId) {
    return Response.json(
      { error: 'You are not authorized to update this user' },
      { status: 401 }
    );
  }

  const existingUser = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return Response.json({ error: 'Username already exists' }, { status: 400 });
  }

  await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
    },
  });

  return Response.json({}, { status: 200 });
}
