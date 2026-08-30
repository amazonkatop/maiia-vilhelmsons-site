import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express from 'express';
import type { PageMeta } from './src/lib/seo';

const isProduction = process.env.NODE_ENV === 'production';

const rawPort = process.env.PORT;
if (!rawPort) {
  throw new Error('PORT environment variable is required but was not provided.');
}
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const base = (process.env.BASE_PATH || '/').replace(/\/$/, '') || '/';

const clientOutDir = path.resolve(import.meta.dirname, 'dist/client');
const serverOutDir = path.resolve(import.meta.dirname, 'dist/server');

/** Escapes text for safe use inside an HTML attribute or text node. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Renders the <head> replacement block from resolved page meta. */
function renderHead(meta: PageMeta, currentPath: string): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const locale = currentPath.startsWith('/ru') ? 'ru' : 'en';
  const withoutLocale = currentPath.replace(/^\/(en|ru)/, '') || '/';
  const origin = meta.canonical.replace(currentPath, '');
  const suffix = withoutLocale === '/' ? '' : withoutLocale;

  const hreflang = ['en', 'ru']
    .map(
      (l) =>
        `<link rel="alternate" hreflang="${l}" href="${origin}/${l}${suffix}" />`,
    )
    .join('\n    ');

  // JSON-LD is safe to embed as-is inside a <script type="application/ld+json">
  // block — it is not HTML-parsed, only JSON-parsed by crawlers/tools.
  const jsonLd = (meta.jsonLd || [])
    .map(
      (block) =>
        `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`,
    )
    .join('\n    ');

  return `<title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${meta.canonical}" />
    <link rel="alternate" hreflang="x-default" href="${origin}/en${suffix}" />
    ${hreflang}
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${meta.canonical}" />
    <meta property="og:locale" content="${locale === 'en' ? 'en_US' : 'ru_RU'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${jsonLd}`;
}

async function createServer() {
  const app = express();

  app.use((req, _res, next) => {
    // eslint-disable-next-line no-console
    console.log(req.method, req.originalUrl);
    next();
  });

  let vite: import('vite').ViteDevServer | undefined;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      root: import.meta.dirname,
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    });
    app.use(vite.middlewares);
  } else {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;
    app.use(compression());
    app.use(
      base,
      sirv(clientOutDir, { extensions: [], gzip: true, brotli: true }),
    );
  }

  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080';
  const siteOrigin = process.env.SITE_ORIGIN || 'https://maiiavilhelmsons.com';

  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').sendFile(path.resolve(clientOutDir, 'robots.txt'));
  });

  // Generated on request from live data, so newly added projects/journal
  // posts (added via the admin) appear without a redeploy. Cheap enough
  // to not bother caching at this traffic scale; add caching later if needed.
  app.get('/sitemap.xml', async (_req, res) => {
    const staticPaths = ['', '/portfolio', '/about', '/services', '/journal', '/contact'];

    let slugs: { projects: string[]; services: string[]; journal: string[] } = {
      projects: [],
      services: [],
      journal: [],
    };

    try {
      const [projects, services, journal] = await Promise.all([
        fetch(`${apiBaseUrl}/api/projects`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiBaseUrl}/api/services`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiBaseUrl}/api/journal`).then((r) => (r.ok ? r.json() : [])),
      ]);
      slugs = {
        projects: (projects || []).map((p: { slug: string }) => p.slug),
        services: (services || []).map((s: { slug: string }) => s.slug),
        journal: (journal || []).map((j: { slug: string }) => j.slug),
      };
    } catch (err) {
      // If the API is temporarily unreachable, still return a sitemap
      // with just the static pages rather than a 500.
      console.error('sitemap: failed to fetch dynamic slugs', err);
    }

    const allPaths = [
      ...staticPaths,
      ...slugs.projects.map((s) => `/portfolio/${s}`),
      ...slugs.services.map((s) => `/services/${s}`),
      ...slugs.journal.map((s) => `/journal/${s}`),
    ];

    const urls = ['en', 'ru']
      .flatMap((locale) =>
        allPaths.map(
          (p) => `  <url><loc>${siteOrigin}/${locale}${p}</loc></url>`,
        ),
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    res.type('application/xml').send(xml);
  });

  app.use(async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '/');

      let template: string;
      let render: (url: string) => Promise<{
        html: string;
        dehydratedState: unknown;
        meta: PageMeta;
      }>;

      if (!isProduction && vite) {
        template = await fs.readFile(
          path.resolve(import.meta.dirname, 'index.html'),
          'utf-8',
        );
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        template = await fs.readFile(
          path.resolve(clientOutDir, 'index.html'),
          'utf-8',
        );
        // pathToFileURL is required on Windows: bare absolute paths like
        // `C:\...` are rejected by ESM import (ERR_UNSUPPORTED_ESM_URL_SCHEME).
        render = (
          await import(
            pathToFileURL(path.resolve(serverOutDir, 'entry-server.js')).href
          )
        ).render;
      }

      const { html: appHtml, dehydratedState, meta } = await render(url);

      const stateJson = JSON.stringify(dehydratedState).replace(/</g, '\\u003c');
      const stateScript = `<script>window.__REACT_QUERY_STATE__ = ${stateJson};</script>`;

      const responseHtml = template
        .replace('<!--app-head-->', renderHead(meta, url))
        .replace('<!--app-html-->', appHtml)
        .replace('<!--app-state-->', stateScript);

      res.status(200).set({ 'Content-Type': 'text/html' }).send(responseHtml);
    } catch (err) {
      const e = err as Error;
      vite?.ssrFixStacktrace(e);
      // eslint-disable-next-line no-console
      console.error(e);
      res.status(500).end(isProduction ? 'Internal Server Error' : e.stack);
    }
  });

  return app;
}

createServer().then((app) => {
  const host = process.env.HOST || '0.0.0.0';
  app.listen(port, host, () => {
    // eslint-disable-next-line no-console
    console.log(`SSR server listening on http://${host}:${port} (base: ${base})`);
  });
});
