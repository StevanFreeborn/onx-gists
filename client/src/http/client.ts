import { Client } from '@/types/client';

export function client(clientConfig?: {
  authHeader?: Record<string, string> | undefined;
}): Client {
  async function request(url: string, config?: RequestInit): Promise<Response> {
    const requestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        ...clientConfig?.authHeader,
      },
      credentials: 'include' as RequestCredentials,
    };

    const request = new Request(url, requestConfig);
    const response = await fetch(request);
    return response;
  }

  async function get({ url, config }: { url: string; config?: RequestInit }) {
    const requestConfig = { ...config, method: 'GET' };
    return await request(url, requestConfig);
  }

  async function post<T>({
    url,
    config,
    body,
  }: {
    url: string;
    config?: RequestInit;
    body?: T;
  }) {
    const requestConfig = {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
    };
    return await request(url, requestConfig);
  }

  async function put<T>({
    url,
    config,
    body,
  }: {
    url: string;
    config?: RequestInit;
    body?: T;
  }) {
    const requestConfig = {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
    };
    return await request(url, requestConfig);
  }

  async function del({ url, config }: { url: string; config?: RequestInit }) {
    const requestConfig = { ...config, method: 'DELETE' };
    return await request(url, requestConfig);
  }

  return {
    get: get,
    post: post,
    put: put,
    delete: del,
  };
}
