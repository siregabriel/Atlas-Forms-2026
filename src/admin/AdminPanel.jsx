import { useEffect, useMemo, useRef, useState } from 'react';
import { adminApi, fetchCatalog } from '../lib/api';
import {
  FILE_TYPES, getFileDetails, splitFileName, joinFileName, guessTypeFromLink,
  linkWarning, activeTag, badgeDaysLeft, BADGE_DAYS,
} from '../lib/fileTypes';

/* ============================================================================
 * Forms Hub — Admin panel
 * Lets non-technical staff add, edit and delete files, manage categories and
 * states, and undo mistakes. Everything is saved in WordPress; the files
 * themselves stay in OneDrive / SharePoint.
 * ========================================================================== */

const formatDate = (ts) =>
  ts
    ? new Date(ts * 1000).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
    })
    : '';

const byName = (a, b) => a.nombre.localeCompare(b.nombre, 'en', { sensitivity: 'base' });

/* ---------------------------------------------------------------- UI bits */

function Button({ variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-300',
    dark: 'bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-400',
    ghost: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-500 disabled:bg-red-300',
    dangerGhost: 'bg-white text-red-600 border border-red-100 hover:bg-red-50 disabled:opacity-50',
  };
  return (
    <button
      type="button"
      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

function Field({ label, help, children, error }) {
  return (
    <label className="block mb-5">
      <span className="block text-sm font-bold text-slate-800 mb-1">{label}</span>
      {help && <span className="block text-xs text-slate-500 mb-2 leading-relaxed">{help}</span>}
      {children}
      {error && <span className="block text-xs font-bold text-red-600 mt-1.5">{error}</span>}
    </label>
  );
}

const inputCls =
  'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15 transition-all';

function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} bg-white rounded-3xl shadow-2xl my-8`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer text-lg">✕</button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 pb-6">{footer}</div>}
      </div>
    </div>
  );
}

function ConfirmModal({ title, body, confirmLabel, danger, onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = async () => {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };
  return (
    <Modal
      title={title}
      onClose={busy ? () => { } : onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={run} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm text-slate-600 leading-relaxed">{body}</div>
      {error && <p className="mt-4 text-sm font-bold text-red-600">{error}</p>}
    </Modal>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const ok = toast.type !== 'error';
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 w-full max-w-md" role="status">
      <div className={`px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold flex items-start gap-3 ${ok ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}>
        <span>{ok ? '✓' : '!'}</span>
        <span>{toast.text}</span>
      </div>
    </div>
  );
}

function Chip({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-green-500 text-white border-green-500',
    blue: 'bg-blue-500 text-white border-blue-500',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}

/* ----------------------------------------------------- Add / edit file */

function DocumentModal({ doc, documents, categories, states, onClose, onSave }) {
  const isNew = !doc;
  const initial = splitFileName(doc?.nombre || '');
  const [link, setLink] = useState(doc?.link || '');
  const [name, setName] = useState(initial.name);
  const [ext, setExt] = useState(isNew ? 'pdf' : initial.ext);
  const [extTouched, setExtTouched] = useState(!isNew);
  const [departamento, setDepartamento] = useState(doc?.departamento || '');
  const [estado, setEstado] = useState(doc?.estado || '');
  const [tag, setTag] = useState(doc?.tag || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const onLinkChange = (value) => {
    setLink(value);
    if (!extTouched) {
      const guess = guessTypeFromLink(value);
      if (guess) setExt(guess);
    }
  };

  // If someone types "Policy.docx" in the name, move ".docx" to the type field
  const onNameBlur = () => {
    const parts = splitFileName(name);
    if (parts.ext && parts.ext !== 'link') {
      setName(parts.name);
      setExt({ doc: 'docx', xls: 'xlsx', ppt: 'pptx' }[parts.ext] || parts.ext);
      setExtTouched(true);
    }
  };

  const nombre = joinFileName(name, ext);
  const duplicate = name.trim() && documents.some(
    (d) => d.id !== doc?.id && d.nombre.toLowerCase() === nombre.toLowerCase() && (d.estado || '') === estado,
  );
  const preview = getFileDetails(nombre || 'x');

  const validate = () => {
    const e = {};
    if (!link.trim()) e.link = 'Paste the link to the file.';
    else if (!/^https?:\/\/\S+$/i.test(link.trim())) e.link = 'This does not look like a link. It must start with https://';
    if (!name.trim()) e.name = 'Write the name people will see.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    setServerError('');
    try {
      await onSave({
        id: doc?.id,
        nombre,
        link: link.trim(),
        departamento,
        estado,
        tag,
      });
    } catch (e) {
      setServerError(e.message);
      setSaving(false);
    }
  };

  return (
    <Modal
      wide
      title={isNew ? 'Add a file' : 'Edit file'}
      onClose={saving ? () => { } : onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? 'Saving…' : isNew ? 'Add file' : 'Save changes'}</Button>
        </>
      }
    >
      <details className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-700 group" open={isNew}>
        <summary className="cursor-pointer font-bold text-blue-700 select-none">How do I get the right link from OneDrive?</summary>
        <ol className="list-decimal pl-5 mt-2 space-y-1 leading-relaxed">
          <li>Open OneDrive or SharePoint and find the file.</li>
          <li>Click the <b>⋯</b> next to the file and choose <b>Share</b>.</li>
          <li>Click the link settings (the gear or “Anyone with the link…”) and choose <b>People in Atlas Senior Living</b>. Do <u>not</u> choose “Specific people”.</li>
          <li>Click <b>Copy link</b> and paste it below.</li>
        </ol>
        <p className="mt-2 text-xs text-slate-500">Don't copy the address from the top of your browser — that one usually only works for you.</p>
      </details>

      <Field
        label="1. Link to the file"
        help="Paste the link you copied with Share → Copy link."
        error={errors.link}
      >
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={link}
            placeholder="https://atlasseniorliving.sharepoint.com/…"
            onChange={(e) => onLinkChange(e.target.value)}
            autoFocus={isNew}
          />
          <Button
            variant="ghost"
            className="whitespace-nowrap"
            disabled={!/^https?:\/\//i.test(link.trim())}
            onClick={() => window.open(link.trim(), '_blank', 'noopener')}
          >
            Test link ↗
          </Button>
        </div>
        {!errors.link && linkWarning(link) && (
          <span className="block text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-2 leading-relaxed">⚠ {linkWarning(link)}</span>
        )}
      </Field>

      <Field label="2. File name" help="The name people will see and search for. You don't need to add .pdf or .docx." error={errors.name}>
        <input className={inputCls} value={name} placeholder="e.g. Fall Risk Assessment" onChange={(e) => setName(e.target.value)} onBlur={onNameBlur} />
        {duplicate && (
          <span className="block text-xs font-bold text-amber-600 mt-1.5">Heads up: another file already has this exact name. You can still save it.</span>
        )}
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
        <Field label="3. File type" help="Picked automatically from the link.">
          <select className={inputCls} value={ext} onChange={(e) => { setExt(e.target.value); setExtTouched(true); }}>
            {FILE_TYPES.map((t) => <option key={t.ext} value={t.ext}>{t.label}</option>)}
          </select>
        </Field>
        <Field label="4. Category" help="Optional. Shows as a tab.">
          <select className={inputCls} value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
            <option value="">No category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="5. State" help="Only if it's for one state.">
          <select className={inputCls} value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">All states (general)</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field label="6. Badge" help={`Optional. Adds a small label so people notice the file. It turns off by itself after ${BADGE_DAYS} days.`}>
        <div className="flex gap-2">
          {[['', 'None'], ['NEW', 'NEW'], ['UPDATED', 'UPDATED']].map(([value, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => setTag(value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${tag === value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </Field>

      <div className="mt-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Preview</p>
        <div className="relative bg-white p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
          {tag && <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider text-white ${tag === 'NEW' ? 'bg-green-500' : 'bg-blue-500'}`}>{tag}</span>}
          <div className={`w-10 h-10 ${preview.bg} rounded-xl flex items-center justify-center border border-slate-50`}><span className="text-xl">{preview.icon}</span></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[8px] font-black uppercase tracking-wider" style={{ color: preview.color }}>{preview.label}</p>
              {departamento && <Chip tone="teal">{departamento}</Chip>}
              {estado && <Chip tone="amber">{estado}</Chip>}
            </div>
            <p className="font-bold text-slate-800 text-xs break-words">{name.trim() || 'File name'}</p>
          </div>
        </div>
      </div>

      {serverError && <p className="mt-4 text-sm font-bold text-red-600">{serverError}</p>}
    </Modal>
  );
}

/* ------------------------------------------------- Categories / states */

function ListManager({ title, description, items, counts, removeNote, upper, onChange }) {
  const [newItem, setNewItem] = useState('');
  const [editing, setEditing] = useState(null); // { from, value }
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const norm = (v) => (upper ? v.trim().toUpperCase() : v.trim());
  const exists = (v, except) => items.some((i) => i !== except && i.toLowerCase() === v.toLowerCase());

  const run = async (nextItems, renames) => {
    setBusy(true);
    setError('');
    try {
      await onChange(nextItems, renames);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const add = async () => {
    const v = norm(newItem);
    if (!v) return;
    if (v.toLowerCase() === 'all' || exists(v)) { setError(`"${v}" already exists.`); return; }
    if (await run([...items, v], {})) setNewItem('');
  };

  const saveRename = async () => {
    const v = norm(editing.value);
    if (!v || v === editing.from) { setEditing(null); return; }
    if (v.toLowerCase() === 'all' || exists(v, editing.from)) { setError(`"${v}" already exists.`); return; }
    if (await run(items.map((i) => (i === editing.from ? v : i)), { [editing.from]: v })) setEditing(null);
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-100 p-6">
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mb-5">{description}</p>

      <ul className="divide-y divide-slate-100 mb-5">
        {items.map((item) => (
          <li key={item} className="py-3 flex items-center gap-3">
            {editing?.from === item ? (
              <>
                <input
                  className={`${inputCls} py-2`}
                  value={editing.value}
                  autoFocus
                  onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setEditing(null); }}
                />
                <Button className="py-2" onClick={saveRename} disabled={busy}>Save</Button>
                <Button className="py-2" variant="ghost" onClick={() => setEditing(null)} disabled={busy}>Cancel</Button>
              </>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800">{item}</p>
                  <p className="text-xs text-slate-400">{counts[item] || 0} file{counts[item] === 1 ? '' : 's'}</p>
                </div>
                <Button className="py-2" variant="ghost" onClick={() => { setError(''); setEditing({ from: item, value: item }); }} disabled={busy}>Rename</Button>
                <Button className="py-2" variant="dangerGhost" onClick={() => setConfirm(item)} disabled={busy}>Remove</Button>
              </>
            )}
          </li>
        ))}
        {items.length === 0 && <li className="py-3 text-sm text-slate-400">Nothing here yet.</li>}
      </ul>

      <div className="flex gap-2">
        <input
          className={inputCls}
          placeholder={upper ? 'New state, e.g. OHIO' : 'New category name'}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <Button variant="dark" onClick={add} disabled={busy || !newItem.trim()} className="whitespace-nowrap">+ Add</Button>
      </div>
      {error && <p className="mt-3 text-sm font-bold text-red-600">{error}</p>}

      {confirm && (
        <ConfirmModal
          title={`Remove "${confirm}"?`}
          body={counts[confirm]
            ? <>{counts[confirm]} file{counts[confirm] === 1 ? '' : 's'} use{counts[confirm] === 1 ? 's' : ''} it. {removeNote} The files themselves are <b>not</b> deleted.</>
            : 'No files use it.'}
          confirmLabel="Remove"
          danger
          onClose={() => setConfirm(null)}
          onConfirm={async () => {
            await onChange(items.filter((i) => i !== confirm), {});
          }}
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------ History */

function HistoryTab({ onRestore }) {
  const [backups, setBackups] = useState(null);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    adminApi.listBackups()
      .then((r) => alive && setBackups(r.backups || []))
      .catch((e) => alive && setError(e.message));
    return () => { alive = false; };
  }, [reload]);

  return (
    <section className="bg-white rounded-3xl border border-slate-100 p-6">
      <h3 className="text-lg font-black text-slate-900">Undo a change</h3>
      <p className="text-sm text-slate-500 mb-5">
        A copy is saved automatically before every change (the last 15 are kept).
        If something went wrong, restore the copy from before that change.
      </p>
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
      {!backups && !error && <p className="text-sm text-slate-400">Loading…</p>}
      {backups?.length === 0 && <p className="text-sm text-slate-400">No changes yet.</p>}
      <ul className="divide-y divide-slate-100">
        {backups?.map((b) => (
          <li key={b.id} className="py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 break-words">{b.action}</p>
              <p className="text-xs text-slate-400">{b.by} · {formatDate(b.at)} · list had {b.count} files before this</p>
            </div>
            <Button variant="ghost" className="py-2 self-start md:self-auto" onClick={() => setConfirm(b)}>Restore version before this</Button>
          </li>
        ))}
      </ul>

      {confirm && (
        <ConfirmModal
          title="Restore this version?"
          body={<>The list will go back to how it was <b>before</b> “{confirm.action}” ({formatDate(confirm.at)}). Any change made after that will be undone. You can undo this restore later from this same page.</>}
          confirmLabel="Restore"
          onClose={() => setConfirm(null)}
          onConfirm={async () => {
            await onRestore(confirm.id);
            setReload((n) => n + 1);
          }}
        />
      )}
    </section>
  );
}

/* --------------------------------------------------------------- Main */

export default function AdminPanel({ catalog, onCatalog, bundledDocuments, adminSession, onSessionChange, onExit }) {
  const [tab, setTab] = useState('files');
  const [initialized, setInitialized] = useState(null); // null = checking
  const [loadError, setLoadError] = useState('');
  const [accessError, setAccessError] = useState('');
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [limit, setLimit] = useState(60);

  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, object = edit
  const [deleting, setDeleting] = useState(null);
  const [importing, setImporting] = useState(false);

  const documents = catalog.documents;
  const { categories, states } = catalog;

  const toastTimer = useRef(null);
  const notify = (text, type = 'ok') => {
    setToast({ text, type });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  };

  // Check access + load the live list when the panel opens
  useEffect(() => {
    if (!adminSession) return;
    adminApi.whoami()
      .then((r) => r.session && onSessionChange(r.session))
      .catch((e) => { if (e.status === 401 || e.status === 403 || e.code === 'no_session') setAccessError(e.message); });
    fetchCatalog()
      .then((data) => { setInitialized(!!data.initialized); onCatalog(data); })
      .catch(() => setLoadError('Could not connect to WordPress. Make sure the Forms Hub snippet is active, then reload this page.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every admin endpoint returns the updated catalog
  const applyResult = (res) => {
    onCatalog(res);
    setInitialized(!!res.initialized);
    if (res.message) notify(res.message);
    return res;
  };
  const handleError = (e) => {
    if (e.status === 401 || e.status === 403 || e.code === 'no_session') setAccessError(e.message);
    throw e;
  };

  const counts = useMemo(() => {
    const c = { cat: {}, state: {} };
    documents.forEach((d) => {
      if (d.departamento) c.cat[d.departamento] = (c.cat[d.departamento] || 0) + 1;
      if (d.estado) c.state[d.estado] = (c.state[d.estado] || 0) + 1;
    });
    return c;
  }, [documents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = documents.filter((d) => {
      if (q && !d.nombre.toLowerCase().includes(q) && !d.link.toLowerCase().includes(q)) return false;
      if (catFilter === 'none' && d.departamento) return false;
      if (!['all', 'none', 'checklink'].includes(catFilter) && d.departamento !== catFilter) return false;
      if (catFilter === 'checklink' && !linkWarning(d.link)) return false;
      if (stateFilter === 'general' && d.estado) return false;
      if (stateFilter !== 'all' && stateFilter !== 'general' && d.estado !== stateFilter) return false;
      return true;
    });
    if (sort === 'recent') return [...list].sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0) || byName(a, b));
    return [...list].sort(byName);
  }, [documents, search, catFilter, stateFilter, sort]);

  /* ---------- no access ---------- */
  if (!adminSession || accessError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Admin access needed</h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            {accessError || 'Your account does not have permission to manage the Forms Hub. Ask Gabriel Rosales (Forms Hub owner) to give you access, then open the Forms Hub again from WordPress.'}
          </p>
          <Button variant="dark" onClick={onExit}>← Back to Forms Hub</Button>
        </div>
      </div>
    );
  }

  const doImport = async () => {
    setImporting(true);
    try {
      applyResult(await adminApi.importDocuments(bundledDocuments, categories, states).catch(handleError));
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setImporting(false);
    }
  };

  const saveSettings = async (nextCategories, nextStates, renames) =>
    applyResult(await adminApi.saveSettings(nextCategories, nextStates, renames).catch(handleError));

  const tabs = [
    ['files', `Files (${documents.length})`],
    ['lists', 'Categories & States'],
    ['history', 'Undo changes'],
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans antialiased text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button type="button" onClick={onExit} className="text-sm font-bold text-slate-400 hover:text-blue-600 cursor-pointer mb-2">← Back to Forms Hub</button>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Manage Forms Hub</h1>
            <p className="text-sm text-slate-500 mt-1">
              Signed in as <b>{adminSession.name}</b>. Changes are live for everyone as soon as you save.
              {catalog.updated_at ? <> Last change: {formatDate(catalog.updated_at)}.</> : null}
            </p>
          </div>
          {tab === 'files' && initialized && (
            <Button className="self-start md:self-auto px-6 py-3" onClick={() => setEditing(null)}>+ Add a file</Button>
          )}
        </header>

        {/* Tabs */}
        <nav className="flex gap-1 mb-6 bg-white p-1 rounded-2xl border border-slate-100 w-full md:w-fit overflow-x-auto">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${tab === id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {loadError && <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm font-bold text-red-700">{loadError}</div>}

        {/* One-time setup */}
        {initialized === false && (
          <div className="mb-6 p-6 rounded-3xl bg-blue-50 border border-blue-100">
            <h2 className="text-lg font-black text-slate-900 mb-1">One-time setup</h2>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Right now the {bundledDocuments.length} files in the Forms Hub are saved inside the app's code.
              Click the button below once to move them here, so they can be added, edited and removed from this page.
            </p>
            <Button onClick={doImport} disabled={importing}>{importing ? 'Importing…' : `Import the ${bundledDocuments.length} current files`}</Button>
          </div>
        )}
        {initialized === null && !loadError && <p className="text-sm text-slate-400 mb-6">Loading…</p>}

        {/* FILES */}
        {tab === 'files' && initialized && (
          <section>
            <div className="flex flex-col lg:flex-row gap-2 mb-4">
              <input
                className={`${inputCls} lg:flex-1`}
                placeholder="Search by name or link…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setLimit(60); }}
              />
              <select className={`${inputCls} lg:w-48`} value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setLimit(60); }} aria-label="Filter by category">
                <option value="all">All categories</option>
                <option value="none">No category</option>
                <option value="checklink">⚠ Links to check</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className={`${inputCls} lg:w-48`} value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setLimit(60); }} aria-label="Filter by state">
                <option value="all">All states</option>
                <option value="general">General (no state)</option>
                {states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className={`${inputCls} lg:w-48`} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
                <option value="name">Sort: A → Z</option>
                <option value="recent">Sort: recently changed</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 font-bold mb-3">Showing {Math.min(limit, filtered.length)} of {filtered.length} files</p>

            <ul className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
              {filtered.slice(0, limit).map((d) => {
                const style = getFileDetails(d.nombre);
                const { name } = splitFileName(d.nombre);
                return (
                  <li key={d.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3 hover:bg-slate-50/60">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 ${style.bg} rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-50`}><span className="text-xl">{style.icon}</span></div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-800 break-words">{name}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: style.color }}>{style.label}</span>
                          {d.departamento && <Chip tone="teal">{d.departamento}</Chip>}
                          {d.estado && <Chip tone="amber">{d.estado}</Chip>}
                          {d.tag && (activeTag(d)
                            ? <Chip tone={d.tag === 'NEW' ? 'green' : 'blue'}>{d.tag}{badgeDaysLeft(d) !== null ? ` · ${badgeDaysLeft(d)}d left` : ''}</Chip>
                            : <Chip>{d.tag} expired</Chip>)}
                          {linkWarning(d.link) && <Chip tone="amber">⚠ Check link</Chip>}
                          {d.updated_at && <span className="text-[10px] text-slate-400">· {d.updated_by}, {formatDate(d.updated_at)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:ml-4">
                      <a href={d.link} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 bg-white hover:bg-slate-50">Open ↗</a>
                      <Button variant="ghost" className="py-2 text-xs" onClick={() => setEditing(d)}>Edit</Button>
                      <Button variant="dangerGhost" className="py-2 text-xs" onClick={() => setDeleting(d)}>Delete</Button>
                    </div>
                  </li>
                );
              })}
              {filtered.length === 0 && <li className="p-10 text-center text-sm text-slate-400">No files match these filters.</li>}
            </ul>
            {filtered.length > limit && (
              <div className="text-center mt-4">
                <Button variant="ghost" onClick={() => setLimit((l) => l + 100)}>Show more</Button>
              </div>
            )}
          </section>
        )}

        {/* CATEGORIES & STATES */}
        {tab === 'lists' && initialized !== null && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ListManager
              title="Categories"
              description="The tabs at the top of the Forms Hub (e.g. Clinical Policy)."
              items={categories}
              counts={counts.cat}
              removeNote="They will stay in the Forms Hub without a category."
              onChange={(next, renames) => saveSettings(next, states, { categories: renames })}
            />
            <ListManager
              title="States"
              description="The state buttons in the Forms Hub. Files assigned to a state show up when that state is selected."
              items={states}
              counts={counts.state}
              upper
              removeNote="They will become general files (shown for all states)."
              onChange={(next, renames) => saveSettings(categories, next, { states: renames })}
            />
          </div>
        )}

        {/* HISTORY */}
        {tab === 'history' && (
          <HistoryTab onRestore={async (id) => applyResult(await adminApi.restoreBackup(id).catch(handleError))} />
        )}
      </div>

      {editing !== undefined && (
        <DocumentModal
          doc={editing}
          documents={documents}
          categories={categories}
          states={states}
          onClose={() => setEditing(undefined)}
          onSave={async (doc) => {
            applyResult(await adminApi.saveDocument(doc).catch(handleError));
            setEditing(undefined);
          }}
        />
      )}

      {deleting && (
        <ConfirmModal
          title="Delete this file?"
          body={<>“<b>{splitFileName(deleting.nombre).name}</b>” will be removed from the Forms Hub for everyone (it will also disappear from people's favorites). The file in OneDrive is <b>not</b> deleted. You can undo this from “Undo changes”.</>}
          confirmLabel="Delete"
          danger
          onClose={() => setDeleting(null)}
          onConfirm={async () => { applyResult(await adminApi.deleteDocument(deleting.id).catch(handleError)); }}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
