import { getBaseUrl } from './api-base';

export type HomepageContent = {
  id: number;
  heroImage: string;
  heroEyebrowEn: string;
  heroEyebrowRu: string;
  heroHeadlineEn: string;
  heroHeadlineRu: string;
  designerPortrait: string;
  designerEyebrowEn: string;
  designerEyebrowRu: string;
  designerName: string;
  designerBio1En: string;
  designerBio1Ru: string;
  designerBio2En: string;
  designerBio2Ru: string;
  designerBio3En: string;
  designerBio3Ru: string;
  studioImage: string;
  studioEyebrowEn: string;
  studioEyebrowRu: string;
  studioHeadlineEn: string;
  studioHeadlineRu: string;
  studioBodyEn: string;
  studioBodyRu: string;
  updatedAt: string;
};

export type HomepageUpdateInput = {
  heroImage: string;
  heroEyebrowEn: string;
  heroHeadlineEn: string;
  designerPortrait: string;
  designerEyebrowEn: string;
  designerName: string;
  designerBio1En: string;
  designerBio2En: string;
  designerBio3En: string;
  studioImage: string;
  studioEyebrowEn: string;
  studioHeadlineEn: string;
  studioBodyEn: string;
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

export async function getHomepageContent(): Promise<HomepageContent> {
  const res = await fetch(apiUrl('/api/homepage'), {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<HomepageContent>;
}

export async function updateHomepageContent(
  input: HomepageUpdateInput,
): Promise<HomepageContent> {
  const res = await fetch(apiUrl('/api/homepage'), {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<HomepageContent>;
}

export function localizedHomepageField(
  content: HomepageContent | undefined,
  locale: 'en' | 'ru',
  base:
    | 'heroEyebrow'
    | 'heroHeadline'
    | 'designerEyebrow'
    | 'designerBio1'
    | 'designerBio2'
    | 'designerBio3'
    | 'studioEyebrow'
    | 'studioHeadline'
    | 'studioBody',
  fallback = '',
): string {
  if (!content) return fallback;
  const key = `${base}${locale === 'en' ? 'En' : 'Ru'}` as keyof HomepageContent;
  const value = content[key];
  return typeof value === 'string' && value ? value : fallback;
}
