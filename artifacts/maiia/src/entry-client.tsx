import { hydrateRoot, createRoot } from 'react-dom/client';
import { hydrate } from '@tanstack/react-query';
import { setBaseUrl } from '@workspace/api-client-react';
import App from './App';
import { createQueryClient } from './queryClient';
import './index.css';

// VITE_ prefix required so Vite exposes this to the browser bundle.
// Falls back to localhost for local dev when unset.
setBaseUrl(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

declare global {
  interface Window {
    __REACT_QUERY_STATE__?: unknown;
  }
}

const queryClient = createQueryClient();

if (typeof window !== 'undefined' && window.__REACT_QUERY_STATE__) {
  hydrate(queryClient, window.__REACT_QUERY_STATE__);
  // Free the memory once consumed.
  delete window.__REACT_QUERY_STATE__;
}

const rootEl = document.getElementById('root')!;

if (rootEl.hasChildNodes()) {
  // Server-rendered markup is present — hydrate it in place.
  hydrateRoot(rootEl, <App queryClient={queryClient} />);
} else {
  // Fallback: no SSR markup (e.g. static preview build without the
  // Express SSR server running) — render fresh, same as before.
  createRoot(rootEl).render(<App queryClient={queryClient} />);
}
