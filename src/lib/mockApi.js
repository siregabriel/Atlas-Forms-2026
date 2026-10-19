// ============================================================================
// DEV-ONLY mock of the WordPress endpoints (atlas/v1/forms/*).
// Active only with `npm run dev` when VITE_WP_URL is not set. Data is saved in
// this browser's localStorage ("atlas_mock_db"), so nothing touches WordPress.
// It is never included in `npm run build`.
// ============================================================================

const DB_KEY = 'atlas_mock_db';
const DEFAULTS = {
  categories: ['Clinical Policy', 'Job Description', 'Redirect Link'],
  states: ['ALABAMA', 'FLORIDA', 'GEORGIA', 'KENTUCKY', 'MARYLAND', 'MISSISSIPPI', 'SOUTH CAROLINA', 'TENNESSEE', 'TEXAS', 'VIRGINIA'],
};
const USER = 'Local Dev Admin';

const load = () => {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || {}; } catch { return {}; }
};
const persist = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));
const now = () => Math.floor(Date.now() / 1000);
const fail = (message, status = 400) => {
  const e = new Error(message);
  e.status = status;
  throw e;
};
const delay = () => new Promise((r) => setTimeout(r, 250)); // feels like a real request

const catalog = (db) => ({
  initialized: Array.isArray(db.documents),
  documents: db.documents || [],
  categories: db.settings?.categories || DEFAULTS.categories,
  states: db.settings?.states || DEFAULTS.states,
  updated_at: db.updated_at || null,
  updated_by: db.updated_by || null,
});

const snapshot = (db, action) => {
  const c = catalog(db);
  db.backups = [{
    id: crypto.randomUUID(), at: now(), by: USER, action,
    documents: c.documents, settings: { categories: c.categories, states: c.states },
  }, ...(db.backups || [])].slice(0, 15);
};

const commit = (db, message, extra = {}) => {
  db.updated_at = now();
  db.updated_by = USER;
  persist(db);
  return { ...catalog(db), message, ...extra };
};

const nextId = (db) => {
  const max = Math.max(0, ...(db.documents || []).map((d) => d.id));
  const id = Math.max(max + 1, db.next_id || 1);
  db.next_id = id + 1;
  return id;
};

const letter = (name) => (name.match(/[A-Za-z]/)?.[0] || '#').toUpperCase();

export const mockSession = () => ({ token: 'dev-mock', exp: now() + 8 * 3600, name: USER });

export async function mockFetchCatalog() {
  await delay();
  return catalog(load());
}

export async function mockAdminPost(path, body) {
  await delay();
  const db = load();
  const c = catalog(db);
  const needInit = () => { if (!c.initialized) fail('The document list has not been imported yet. Use "Import current files" first.', 409); };

  switch (path) {
    case '/forms/whoami':
      return { admin: true, session: mockSession() };

    case '/forms/import': {
      if (c.initialized && !body.replace) fail('The document list was already imported.', 409);
      snapshot(db, 'First import');
      db.documents = body.documents.map((d) => ({ ...d }));
      db.settings = { categories: body.categories || c.categories, states: body.states || c.states };
      nextId(db);
      return commit(db, `${db.documents.length} files imported.`);
    }

    case '/forms/documents/save': {
      needInit();
      const d = body.document || {};
      const nombre = String(d.nombre || '').trim();
      if (!nombre) fail('Please enter a file name.');
      if (!/^https?:\/\//i.test(d.link || '')) fail('The link is not valid. It must start with https://');
      const doc = { nombre, letra: letter(nombre), link: d.link.trim(), departamento: d.departamento || '', updated_at: now(), updated_by: USER };
      if (d.estado) doc.estado = d.estado;
      if (d.tag) doc.tag = d.tag;
      if (d.id) {
        const i = db.documents.findIndex((x) => x.id === d.id);
        if (i < 0) fail('This file no longer exists.', 404);
        const prev = db.documents[i];
        if (doc.tag) doc.tag_at = prev.tag === doc.tag && prev.link === doc.link && prev.tag_at ? prev.tag_at : now();
        snapshot(db, `Edited "${db.documents[i].nombre}"`);
        db.documents[i] = { id: d.id, ...doc };
        return commit(db, 'Changes saved.', { saved_id: d.id });
      }
      if (doc.tag) doc.tag_at = now();
      snapshot(db, `Added "${nombre}"`);
      const id = nextId(db);
      db.documents.push({ id, ...doc });
      return commit(db, 'File added.', { saved_id: id });
    }

    case '/forms/documents/delete': {
      needInit();
      const i = db.documents.findIndex((x) => x.id === body.id);
      if (i < 0) fail('This file no longer exists.', 404);
      snapshot(db, `Deleted "${db.documents[i].nombre}"`);
      db.documents.splice(i, 1);
      return commit(db, 'File deleted.');
    }

    case '/forms/settings/save': {
      const cats = body.categories;
      const states = body.states.map((s) => s.toUpperCase());
      const rc = body.renames?.categories || {};
      const rs = body.renames?.states || {};
      snapshot(db, 'Changed categories / states');
      if (db.documents) {
        db.documents = db.documents.map((d) => {
          const n = { ...d };
          let dep = rc[n.departamento] || n.departamento || '';
          n.departamento = cats.includes(dep) ? dep : '';
          if (n.estado) {
            const st = (rs[n.estado] || n.estado).toUpperCase();
            if (states.includes(st)) n.estado = st; else delete n.estado;
          }
          return n;
        });
      }
      db.settings = { categories: cats, states };
      return commit(db, 'Categories and states saved.');
    }

    case '/forms/backups':
      return { backups: (db.backups || []).map((b) => ({ id: b.id, at: b.at, by: b.by, action: b.action, count: b.documents.length })) };

    case '/forms/backups/restore': {
      const b = (db.backups || []).find((x) => x.id === body.id);
      if (!b) fail('That version is no longer available.', 404);
      snapshot(db, `Restored the version from ${new Date(b.at * 1000).toLocaleString('en-US')}`);
      db.documents = b.documents;
      db.settings = b.settings;
      return commit(db, 'Previous version restored.');
    }

    default:
      fail('Unknown endpoint', 404);
  }
}

export const resetMockDb = () => localStorage.removeItem(DB_KEY);
