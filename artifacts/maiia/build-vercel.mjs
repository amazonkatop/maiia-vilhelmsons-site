import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [path.join(artifactDir, 'server.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: path.join(artifactDir, 'dist/vercel-server.mjs'),
  logLevel: 'info',
  external: ['vite'],
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
  },
});
