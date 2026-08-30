import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const port = Number(process.env.PORT || '5173');
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}"`);
}

/**
 * Vite `base` must be an absolute URL path. On Windows, Git Bash/MSYS
 * rewrites a lone "/" env value into the Git install path
 * (e.g. "/Program Files/Git/"), which breaks SSR routing.
 */
function resolveBasePath(): string {
  const raw = process.env.BASE_PATH || '/';
  if (
    !raw.startsWith('/') ||
    raw.includes('Program Files') ||
    raw.includes('Program%20Files') ||
    /\/Git\/?$/i.test(raw)
  ) {
    return '/';
  }
  return raw.endsWith('/') ? raw : `${raw}/`;
}

const basePath = resolveBasePath();
const host = process.env.HOST || '0.0.0.0';

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  ssr: {
    // Force these ESM-only packages to be bundled into the SSR output
    // rather than left as bare `require()` calls (which would fail on
    // packages that don't ship a CJS build). If the production SSR
    // build fails with an ERR_REQUIRE_ESM-style error on some other
    // package, add its name to this list too.
    noExternal: ['wouter', 'framer-motion'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host,
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host,
    allowedHosts: true,
  },
});
