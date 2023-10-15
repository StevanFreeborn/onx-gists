import { prismaClient } from '@/data/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthOptions, DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT, JWT } from 'next-auth/jwt';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    userId?: string;
    apiJwt?: string;
    refreshErrored: boolean;
  }

  interface User extends DefaultUser {
    enabled: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    providerAccessToken?: string;
    providerAccessTokenExpiration?: number;
    providerRefreshToken?: string;
    provider: string;
    refreshErrored: boolean;
    iss?: string;
    aud?: string;
  }
}

const prisma = prismaClient;

export const nextAuthOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? '',
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: `openid profile email offline_access`,
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, account, user }) => {
      if (account && user) {
        token.provider = account.provider;
        token.providerAccessToken = account.access_token;
        token.providerAccessTokenExpiration = account.expires_at;
        token.providerRefreshToken = account.refresh_token;

        return token;
      }

      if (
        token.providerAccessTokenExpiration &&
        Date.now() < token.providerAccessTokenExpiration * 1000
      ) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      if (session.apiJwt === undefined) {
        session.apiJwt = createApiJwt({ userId: token.sub! });
      } else {
        const apiJwt = jwt.verify(
          session.apiJwt,
          process.env.NEXTAUTH_SECRET!
        ) as JwtPayload;

        const timeToRefresh = apiJwt.exp! - 120;
        const nowInSecs = Date.now() / 1000;

        if (nowInSecs > timeToRefresh) {
          session.apiJwt = createApiJwt({ userId: token.sub! });
        }
      }

      session.userId = token.sub;
      session.refreshErrored = token.refreshErrored;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export function createApiJwt({ userId }: { userId: string }) {
  const apiJwt = {
    iss: process.env.JWT_ISSUER,
    aud: process.env.JWT_AUDIENCE,
    sub: userId,
    iat: Date.now() / 1000,
    exp:
      Date.now() / 1000 + 60 * parseInt(process.env.JWT_EXPIRATION_MINS ?? '0'),
    jti: crypto.randomUUID(),
  };

  return jwt.sign(apiJwt, process.env.NEXTAUTH_SECRET!);
}

export async function refreshAccessToken(token: JWT) {
  try {
    const providers = {
      google: {
        url: 'https://oauth2.googleapis.com/token',
        id: process.env.GOOGLE_CLIENT_ID ?? '',
        secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      },
      'azure-ad': {
        url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        id: process.env.AZURE_AD_CLIENT_ID ?? '',
        secret: process.env.AZURE_AD_CLIENT_SECRET ?? '',
      },
      github: {
        url: 'https://github.com/login/oauth/access_token',
        id: process.env.GITHUB_ID ?? '',
        secret: process.env.GITHUB_SECRET ?? '',
      },
    } as {
      [key: string]: {
        url: string;
        id: string;
        secret: string;
      };
    };

    const provider = providers[token.provider];

    const response = await fetch(provider.url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: new URLSearchParams({
        client_id: provider.id,
        client_secret: provider.secret,
        grant_type: 'refresh_token',
        refresh_token: token.providerRefreshToken ?? '',
      }),
    });

    let body;

    if (token.provider === 'github') {
      body = {};
      const resText = await response.text();
      const params = new URLSearchParams(resText);
      body = Object.fromEntries(params);
    } else {
      body = await response.json();
    }

    if (response.ok === false) {
      throw body;
    }

    token.providerAccessToken = body.access_token;
    token.providerAccessTokenExpiration = Date.now() / 1000 + body.expires_in;
    token.providerRefreshToken =
      body.refresh_token ?? token.providerRefreshToken;

    return token;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    token.refreshErrored = true;
    return token;
  }
}
