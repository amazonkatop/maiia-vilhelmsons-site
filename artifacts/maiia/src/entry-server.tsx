import { renderToString } from 'react-dom/server';
import { dehydrate, type QueryClient } from '@tanstack/react-query';
import { createQueryClient } from './queryClient';
import {
  setBaseUrl,
  getListFeaturedProjectsQueryOptions,
  getListProjectsQueryOptions,
  getGetProjectQueryOptions,
  getListServicesQueryOptions,
  getGetServiceQueryOptions,
  getListJournalPostsQueryOptions,
  getGetJournalPostQueryOptions,
  getGetSiteSummaryQueryOptions,
} from '@workspace/api-client-react';
import App from './App';
import { getPageMeta, type PageMeta } from './lib/seo';

// Server-side only: point API calls at the backend. Not prefixed with
// VITE_, so this never leaks into the client bundle — the browser gets
// its own base URL set separately in entry-client.tsx.
setBaseUrl(process.env.API_BASE_URL || 'http://localhost:8080');

/**
 * Prefetches exactly the data the matched route's page component will
 * request via useQuery, so that data is already in the cache by the
 * time renderToString runs (React Query then renders real content
 * instead of a loading skeleton on the very first paint).
 *
 * Route list mirrors artifacts/maiia/src/App.tsx — keep in sync if
 * routes change.
 */
async function prefetchForPath(queryClient: QueryClient, path: string) {
  const withoutLocale = path.replace(/^\/(en|ru)/, '') || '/';

  const tasks: Promise<unknown>[] = [];
  let projectSlugData: any;
  let serviceSlugData: any;
  let journalSlugData: any;

  if (withoutLocale === '/' || withoutLocale === '') {
    tasks.push(
      queryClient.prefetchQuery(getGetSiteSummaryQueryOptions()),
      queryClient.prefetchQuery(getListFeaturedProjectsQueryOptions()),
      queryClient.prefetchQuery(getListServicesQueryOptions()),
      queryClient.prefetchQuery(getListJournalPostsQueryOptions()),
    );
  } else if (withoutLocale === '/portfolio') {
    tasks.push(queryClient.prefetchQuery(getListProjectsQueryOptions()));
  } else if (withoutLocale === '/services') {
    tasks.push(queryClient.prefetchQuery(getListServicesQueryOptions()));
  } else if (withoutLocale === '/journal') {
    tasks.push(queryClient.prefetchQuery(getListJournalPostsQueryOptions()));
  } else {
    const projectMatch = withoutLocale.match(/^\/portfolio\/([^/]+)$/);
    const serviceMatch = withoutLocale.match(/^\/services\/([^/]+)$/);
    const journalMatch = withoutLocale.match(/^\/journal\/([^/]+)$/);

    if (projectMatch) {
      const slug = projectMatch[1];
      projectSlugData = await queryClient
        .fetchQuery(getGetProjectQueryOptions(slug))
        .catch(() => undefined);
    } else if (serviceMatch) {
      const slug = serviceMatch[1];
      serviceSlugData = await queryClient
        .fetchQuery(getGetServiceQueryOptions(slug))
        .catch(() => undefined);
    } else if (journalMatch) {
      const slug = journalMatch[1];
      journalSlugData = await queryClient
        .fetchQuery(getGetJournalPostQueryOptions(slug))
        .catch(() => undefined);
    }
  }

  await Promise.all(tasks);

  return {
    project: projectSlugData,
    service: serviceSlugData,
    journalPost: journalSlugData,
  };
}

export interface RenderResult {
  html: string;
  dehydratedState: unknown;
  meta: PageMeta;
}

export async function render(url: string): Promise<RenderResult> {
  // url arrives as a path like "/en/portfolio/some-slug" (no origin).
  const queryClient = createQueryClient();
  const entityData = await prefetchForPath(queryClient, url);

  const html = renderToString(
    <App queryClient={queryClient} ssrPath={url} />,
  );

  const meta = getPageMeta(url, entityData);
  const dehydratedState = dehydrate(queryClient);

  return { html, dehydratedState, meta };
}
