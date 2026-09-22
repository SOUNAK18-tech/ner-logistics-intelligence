/**
 * config.js — single source of truth for the backend URL.
 *
 * DEV  (npm run dev):  API_BASE = ''  → Vite proxy forwards /api and /uploads to localhost:1710.
 * PROD (Render/Vercel): set VITE_API_URL=https://<your-backend>.onrender.com  BEFORE building.
 *
 * Vite bakes VITE_* variables into the JS at BUILD time, so after adding or changing
 * VITE_API_URL you must trigger a fresh build/deploy of the frontend.
 */
const raw = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

if (import.meta.env.PROD && !raw) {
  // Loud, obvious hint in the browser console instead of silent empty pages.
  console.error(
    '[config] VITE_API_URL is not set. The deployed frontend cannot reach the backend. ' +
    'Set VITE_API_URL to your backend URL and redeploy the frontend.'
  );
}

/** Prefix for every REST call and /uploads image. '' in dev (proxy), full URL in prod. */
export const API_BASE = raw;

/** Socket.IO endpoint. Dev falls back to the local backend; prod uses VITE_API_URL only. */
export const SOCKET_URL = raw || (import.meta.env.DEV ? 'http://localhost:1710' : '');

/** Turn a backend-relative file path ("/uploads/x.jpg") into a loadable URL. Leaves absolute/data URLs alone. */
export const assetUrl = (u) => (u && u.startsWith('/uploads') ? `${API_BASE}${u}` : u);
