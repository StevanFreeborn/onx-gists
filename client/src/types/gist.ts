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
  name: string;
  description: string;
  formula: string[];
  visibility: Visibility;
  lineWrapMode: LineWrapMode;
  indentSize: IndentSize;
  updated: string;
  created: string;
};
