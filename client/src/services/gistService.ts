import { Client } from '@/types/client';
import { GistDto, NewGist } from '@/types/gist';
import { Result } from '@/types/result';

export function gistService(client: Client) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function addGist(newGist: NewGist): Promise<Result<GistDto>> {
    const response = await client.post({
      url: `${baseUrl}/gists`,
      config: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      body: newGist,
    });

    if (response.ok === false) {
      return { ok: false, error: new Error('Failed to add gist.') };
    }

    return { ok: true, value: await response.json() };
  }

  async function getGist(id: string): Promise<Result<GistDto>> {
    const response = await client.get({
      url: `${baseUrl}/gists/${id}`,
    });

    if (response.ok === false) {
      return { ok: false, error: new Error('Failed to get gist.') };
    }

    return { ok: true, value: await response.json() };
  }

  async function updateGist(gist: GistDto): Promise<Result<GistDto>> {
    const response = await client.put({
      url: `${baseUrl}/gists`,
      config: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      body: gist,
    });

    if (response.ok === false) {
      return { ok: false, error: new Error('Failed to update gist.') };
    }

    return { ok: true, value: await response.json() };
  }

  return {
    addGist,
    getGist,
    updateGist,
  };
}
