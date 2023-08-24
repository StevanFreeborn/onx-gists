import { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const nextAuthOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account) {
        token.access_token = account.access_token;
      }

      return token;
    },
  },
};
