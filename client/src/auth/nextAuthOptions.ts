import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { AuthOptions, DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT, JWT } from 'next-auth/jwt';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session extends DefaultSession {
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
  }
}

async function refreshAccessToken(token: JWT) {
  try {
    const urls = {
      google: 'https://oauth2.googleapis.com/token',
      'azure ad': 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      github: 'https://github.com/login/oauth/access_token',
    } as { [key: string]: string };

    const url = urls[token.provider];

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GITHUB_SECRET ?? '',
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
    console.log(error);
    token.refreshErrored = true;
    return token;
  }
}

const prisma = new PrismaClient();

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
      session.refreshErrored = token.refreshErrored;
      return session;
    },
  },
};
