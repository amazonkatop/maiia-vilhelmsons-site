import { getBaseUrl } from './api-base';

export type ContactSettings = {
  id: number;
  inquiryEmail: string;
  updatedAt: string;
};

export type ContactSettingsUpdateInput = {
  inquiryEmail: string;
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

export async function getContactSettings(): Promise<ContactSettings> {
  const res = await fetch(apiUrl('/api/contact-settings'), {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<ContactSettings>;
}

export async function updateContactSettings(
  input: ContactSettingsUpdateInput,
): Promise<ContactSettings> {
  const res = await fetch(apiUrl('/api/contact-settings'), {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<ContactSettings>;
}
