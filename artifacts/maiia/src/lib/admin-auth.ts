import { getBaseUrl } from './api-base';

export type AdminUser = {
  id: number;
  email: string;
  role: 'admin' | 'editor';
};

function apiUrl(path: string): string {
  const base = getBaseUrl().replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data?.error) return data.error;
  } catch {
    /* ignore */
  }
  return `HTTP ${res.status}`;
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<AdminUser> {
  const res = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<AdminUser>;
}

export async function adminLogout(): Promise<void> {
  await fetch(apiUrl('/api/auth/logout'), {
    method: 'POST',
    credentials: 'include',
  });
}

export async function adminMe(): Promise<AdminUser | null> {
  const res = await fetch(apiUrl('/api/auth/me'), {
    method: 'GET',
    credentials: 'include',
  });
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<AdminUser>;
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
