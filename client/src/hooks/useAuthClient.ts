import { useUserSession } from '@/auth/useUserSession';
import { client } from '@/http/client';

export function useAuthClient() {
  const { data } = useUserSession();
  const user = data?.user;
  const userId = data?.userId;
  const token = data?.apiJwt;
  const authClient = client({
    authHeader: { Authorization: `Bearer ${token}` },
  });
  return { user: { ...user, userId }, client: authClient };
}
