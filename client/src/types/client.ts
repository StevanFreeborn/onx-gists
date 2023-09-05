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
