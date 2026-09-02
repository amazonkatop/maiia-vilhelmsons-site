/** Browser/SSR helper for the API origin (no trailing slash). */
export function resolveBrowserApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (configured && configured !== 'http://localhost:8080') {
    return configured.replace(/\/+$/, '');
  }
  // Production: same-origin /api proxy (see artifacts/maiia/vercel.json rewrites).
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    return window.location.origin.replace(/\/+$/, '');
  }
  return (configured || 'http://localhost:8080').replace(/\/+$/, '');
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return resolveBrowserApiBaseUrl();
  }
  return (process.env.API_BASE_URL || 'http://localhost:8080').replace(
    /\/+$/,
    '',
  );
}
