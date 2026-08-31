import { createServer } from '../dist/vercel-server.mjs';

let app;

export default async function handler(req, res) {
  try {
    if (!app) {
      app = await createServer();
    }
    return app(req, res);
  } catch (error) {
    console.error('SSR bootstrap failed:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'SSR bootstrap failed',
        message: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}
