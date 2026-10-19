// Small client for the Forms Hub endpoints in WordPress (atlas/v1).
// For local testing you can point it elsewhere with VITE_WP_URL in a .env.local file.

import { mockFetchCatalog, mockAdminPost, mockSession } from './mockApi';

export const WP_URL = (import.meta.env.VITE_WP_URL || 'https://atlasseniorliving.net').replace(/\/+$/, '');

// `npm run dev` without VITE_WP_URL → fake WordPress in localStorage (see mockApi.js).
// Always false in `npm run build`.
export const DEV_MOCK = import.meta.env.DEV && !import.meta.env.VITE_WP_URL;
export const devMockSession = () => (DEV_MOCK ? mockSession() : null);
const API = `${WP_URL}/wp-json/atlas/v1`;

const ADMIN_KEY = 'atlas_admin';
const CATALOG_KEY = 'atlas_catalog_cache';

/* ---------- admin session (stored after SSO login) ---------- */

export const getAdminSession = () => {
  try {
    const s = JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null');
    if (s?.token && s.exp * 1000 > Date.now()) return s;
  } catch { /* ignore */ }
  return null;
};

export const setAdminSession = (session) => {
  if (session?.token) localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
  else localStorage.removeItem(ADMIN_KEY);
};

/* ---------- catalog cache (instant load, offline fallback) ---------- */

export const getCachedCatalog = () => {
  try {
    const c = JSON.parse(localStorage.getItem(CATALOG_KEY) || 'null');
    if (Array.isArray(c?.documents) && c.documents.length) return c;
  } catch { /* ignore */ }
  return null;
};

export const setCachedCatalog = (catalog) => {
  try {
    localStorage.setItem(CATALOG_KEY, JSON.stringify({
      documents: catalog.documents,
      categories: catalog.categories,
      states: catalog.states,
      updated_at: catalog.updated_at,
    }));
  } catch { /* storage full or blocked: not critical */ }
};

/* ---------- requests ---------- */

export async function fetchCatalog() {
  if (DEV_MOCK) return mockFetchCatalog();
  const res = await fetch(`${API}/forms/documents`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not load files (${res.status})`);
  return res.json();
}

async function adminPost(path, body = {}) {
  const session = getAdminSession();
  if (!session) {
    const err = new Error('Your admin session expired. Please open the Forms Hub again from the WordPress menu.');
    err.code = 'no_session';
    throw err;
  }
  if (DEV_MOCK) return mockAdminPost(path, body);
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, session: session.token }),
    });
  } catch {
    throw new Error('Could not connect to WordPress. Check your internet connection and try again.');
  }
  let data = {};
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok) {
    const err = new Error(data?.message || `Something went wrong (error ${res.status}). Please try again.`);
    err.code = data?.code;
    err.status = res.status;
    if (res.status === 401 || res.status === 403) setAdminSession(null);
    throw err;
  }
  return data;
}

export const adminApi = {
  whoami: () => adminPost('/forms/whoami'),
  saveDocument: (document) => adminPost('/forms/documents/save', { document }),
  deleteDocument: (id) => adminPost('/forms/documents/delete', { id }),
  saveSettings: (categories, states, renames = {}) => adminPost('/forms/settings/save', { categories, states, renames }),
  importDocuments: (documents, categories, states, replace = false) =>
    adminPost('/forms/import', { documents, categories, states, replace }),
  listBackups: () => adminPost('/forms/backups'),
  restoreBackup: (id) => adminPost('/forms/backups/restore', { id }),
};
