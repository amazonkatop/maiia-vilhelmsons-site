/** Browser/SSR helper for the API origin (no trailing slash). */
export function resolveBrowserApiBaseUrl(): string {
  // Production browser: always same-origin /api proxy (vercel.json rewrites).
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    return window.location.origin.replace(/\/+$/, '');
  }
  return (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(
    /\/+$/,
    '',
  );
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
