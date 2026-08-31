import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express } from 'express';
import { createServer } from '../server';

let app: Express | undefined;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = await createServer();
  }
  return app(req, res);
}
