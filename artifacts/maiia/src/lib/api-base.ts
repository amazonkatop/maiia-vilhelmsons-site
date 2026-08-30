/** Browser/SSR helper for the API origin (no trailing slash). */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return (
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:8080'
    ).replace(/\/+$/, '');
  }
  return (process.env.API_BASE_URL || 'http://localhost:8080').replace(
    /\/+$/,
    '',
  );
}
