import { User } from '@prisma/client';

export type Client = {
  get: ({
    url,
    config,
  }: {
    url: string;
    config?: RequestInit;
  }) => Promise<Response>;
  post: <T>({
    url,
    config,
    body,
  }: {
    url: string;
    config?: RequestInit;
    body?: T;
  }) => Promise<Response>;
  put: <T>({
    url,
    config,
    body,
  }: {
    url: string;
    config?: RequestInit;
    body?: T;
  }) => Promise<Response>;
  delete: ({
    url,
    config,
  }: {
    url: string;
    config?: RequestInit;
  }) => Promise<Response>;
};

export enum Visibility {
  private = 'private',
  public = 'public',
}

export enum LineWrapMode {
  noWrap = 'noWrap',
  softWrap = 'softWrap',
}

export enum IndentSize {
  two = 2,
  four = 4,
  eight = 8,
}

export type Gist = {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  name: string;
  description: string;
  formula: string[];
  visibility: Visibility;
  lineWrapMode: LineWrapMode;
  indentSize: IndentSize;
  updated: string;
  created: string;
};

export type NewGist = Omit<
  Gist,
  'id' | 'username' | 'userImage' | 'updated' | 'created'
>;

export type GistDto = Omit<Gist, 'username' | 'userImage'>;

export type PagedGists = {
  pageNumber: number;
  pageSize: number;
  totalGists: number;
  totalPages: number;
  hasNextPage: boolean;
  gists: GistDto[];
};

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function createGist(gist: GistDto, user: User) {
  return {
    ...gist,
    username: user.id,
    userImage: user.image ?? 'https://placehold.co/400',
  };
}
