import { QueryClient } from '@tanstack/react-query';

/**
 * Creates a new QueryClient instance.
 *
 * IMPORTANT: this must be a factory, not a module-level singleton.
 * On the server, a shared singleton would leak cached data between
 * concurrent requests from different users. Each SSR request creates
 * its own client via this factory; the browser creates exactly one
 * (in entry-client.tsx) and reuses it for the lifetime of the tab.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        // On the server we never want a query to retry — a failed
        // fetch should just fall back to client-side fetching instead
        // of stalling the response.
        retry: typeof window === 'undefined' ? false : 3,
      },
    },
  });
}
