import { User } from '@prisma/client';

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

export function createGist(gist: GistDto, user: User) {
  return {
    ...gist,
    username: user.id,
    userImage: user.image ?? 'https://placehold.co/400',
  };
}
