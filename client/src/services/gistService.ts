import { Client } from '@/types/client';
import { CreatedOrUpdatedGist, Gist } from '@/types/gist';
import { Result } from '@/types/result';

export function gistService(client: Client) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function addGist(newGist: Gist): Promise<Result<CreatedOrUpdatedGist>> {
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

  return {
    addGist,
  };
}
