import { Client, GistDto, NewGist, PagedGists, Result } from '@/types';

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

  async function deleteGist(id: string): Promise<Result<true>> {
    const response = await client.delete({
      url: `${baseUrl}/gists/${id}`,
    });

    if (response.ok === false) {
      return { ok: false, error: new Error('Failed to delete gist.') };
    }

    return { ok: true, value: true };
  }

  type GetGistsRequest = {
    [key: string]: string | number | boolean | undefined | null;
    userId?: string;
    pageNumber?: number;
    pageSize?: number;
    includePrivate?: boolean;
    includePublic?: boolean;
    searchTerm?: string;
    sort?: string | null;
    order?: string | null;
  };

  async function getGists(
    req: GetGistsRequest = {
      userId: '',
      pageNumber: 1,
      pageSize: 10,
      includePrivate: false,
      includePublic: true,
      searchTerm: '',
      sort: 'created',
      order: 'desc',
    }
  ): Promise<Result<PagedGists>> {
    const reqUrl = new URL(`${baseUrl}/gists`);

    Object.keys(req).forEach(key => {
      const value = req[key];

      if (value) {
        reqUrl.searchParams.append(key, value.toString());
      }
    });

    const response = await client.get({
      url: reqUrl.toString(),
    });

    if (response.ok === false) {
      console.log(response.status, response.statusText);
      return { ok: false, error: new Error('Failed to get gists.') };
    }

    return { ok: true, value: await response.json() };
  }

  return {
    addGist,
    getGist,
    updateGist,
    deleteGist,
    getGists,
  };
}
