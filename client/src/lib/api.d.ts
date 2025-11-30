export interface ApiFetchOptions {
  method?: string;
  body?: any;
  auth?: boolean;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export function setToken(token: string | null): void;
export function getToken(): string;

export function apiFetch<T = any>(path: string, options?: ApiFetchOptions): Promise<T>;
