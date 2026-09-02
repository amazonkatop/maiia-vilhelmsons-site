import { getBaseUrl } from './api-base';

export type ContactSettings = {
  id: number;
  inquiryEmail: string;
  studioEmail: string;
  phone: string;
  studioAddressEn: string;
  studioAddressRu: string;
  studioSubtitleEn: string;
  studioSubtitleRu: string;
  footerLocation1: string;
  footerLocation2: string;
  footerTaglineEn: string;
  footerTaglineRu: string;
  followInstagramUrl: string;
  followPinterestUrl: string;
  followExtraLabel: string;
  followExtraUrl: string;
  privacyContentEn: string;
  privacyContentRu: string;
  termsContentEn: string;
  termsContentRu: string;
  updatedAt: string;
};

export type ContactSettingsUpdateInput = {
  inquiryEmail: string;
  studioEmail: string;
  phone: string;
  studioAddressEn: string;
  studioSubtitleEn: string;
  footerLocation1: string;
  footerLocation2: string;
  footerTaglineEn: string;
  followInstagramUrl: string;
  followPinterestUrl: string;
  followExtraLabel: string;
  followExtraUrl: string;
  privacyContentEn: string;
  termsContentEn: string;
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

export async function getPublicContactSettings(): Promise<ContactSettings> {
  const res = await fetch(apiUrl('/api/contact-settings'), {
    method: 'GET',
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

export function phoneTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : '#';
}

export function localizedContactField(
  settings: ContactSettings | undefined,
  locale: 'en' | 'ru',
  base:
    | 'studioAddress'
    | 'studioSubtitle'
    | 'footerTagline'
    | 'privacyContent'
    | 'termsContent',
  fallback = '',
): string {
  if (!settings) return fallback;
  const key = `${base}${locale === 'en' ? 'En' : 'Ru'}` as keyof ContactSettings;
  const value = settings[key];
  return typeof value === 'string' && value ? value : fallback;
}
