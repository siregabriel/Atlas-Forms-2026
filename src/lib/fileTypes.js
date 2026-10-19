// File-type helpers shared by the Forms Hub and the admin panel.

export const OFFICE_STYLES = {
  pdf: { icon: '📕', color: '#EE3322', bg: 'bg-red-50', label: 'PDF' },
  doc: { icon: '📘', color: '#2B579A', bg: 'bg-blue-50', label: 'Word' },
  docx: { icon: '📘', color: '#2B579A', bg: 'bg-blue-50', label: 'Word' },
  xls: { icon: '📗', color: '#217346', bg: 'bg-green-50', label: 'Excel' },
  xlsx: { icon: '📗', color: '#217346', bg: 'bg-green-50', label: 'Excel' },
  pptx: { icon: '📙', color: '#FF6802', bg: 'bg-orange-50', label: 'PowerPoint' },
  link: { icon: '🔗', color: '#2B579A', bg: 'bg-gray-50', label: 'URL' },
  default: { icon: '📁', color: '#64748b', bg: 'bg-slate-50', label: 'File' }
};

// Options shown in the admin "File type" dropdown.
export const FILE_TYPES = [
  { ext: 'pdf', label: 'PDF' },
  { ext: 'docx', label: 'Word' },
  { ext: 'xlsx', label: 'Excel' },
  { ext: 'pptx', label: 'PowerPoint' },
  { ext: 'link', label: 'Web page / link' },
  { ext: '', label: 'Other' },
];

const KNOWN_EXT = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'link'];

export const getFileDetails = (fileName) => {
  const ext = String(fileName).split('.').pop().toLowerCase();
  return OFFICE_STYLES[ext] || OFFICE_STYLES.default;
};

export const getDisplayName = (fileName) => {
  const idx = fileName.lastIndexOf('.');
  if (idx <= 0) return fileName;
  return fileName.slice(0, idx);
};

// "Fall Policy.docx" -> { name: "Fall Policy", ext: "docx" }
export const splitFileName = (fileName = '') => {
  const idx = fileName.lastIndexOf('.');
  if (idx > 0) {
    const ext = fileName.slice(idx + 1).toLowerCase();
    if (KNOWN_EXT.includes(ext)) return { name: fileName.slice(0, idx), ext };
  }
  return { name: fileName, ext: '' };
};

export const joinFileName = (name, ext) => (ext ? `${name.trim()}.${ext}` : name.trim());

// Best guess of the file type from a OneDrive / SharePoint / WordPress link.
export const guessTypeFromLink = (url = '') => {
  const u = url.toLowerCase();
  if (/sharepoint\.com\/:w:/.test(u)) return 'docx';
  if (/sharepoint\.com\/:b:/.test(u)) return 'pdf';
  if (/sharepoint\.com\/:x:/.test(u)) return 'xlsx';
  if (/sharepoint\.com\/:p:/.test(u)) return 'pptx';
  let decoded = u;
  try { decoded = decodeURIComponent(u); } catch { /* keep raw */ }
  const m = decoded.match(/\.(pdf|docx?|xlsx?|pptx?)(?=$|[?#&])/);
  if (m) return { doc: 'docx', xls: 'xlsx', ppt: 'pptx' }[m[1]] || m[1];
  if (/^https?:\/\//.test(u)) return 'link';
  return null;
};

/* ---------- link checks ---------- */

// Returns a plain-language warning when a link probably won't open for other
// people (e.g. copied from the browser address bar instead of Share → Copy link).
export const linkWarning = (url = '') => {
  const u = url.trim().toLowerCase();
  if (!u) return null;
  if (/sharepoint\.com/.test(u) && !/sharepoint\.com\/:[a-z]:\//.test(u)) {
    return 'This looks like the address from your browser, not a sharing link. Other people probably won\'t be able to open it. In OneDrive use Share → Copy link instead.';
  }
  if (/onedrive\.live\.com|1drv\.ms/.test(u)) {
    return 'This is a personal OneDrive link (not the Atlas account). Please share the file from the Atlas OneDrive or SharePoint.';
  }
  return null;
};

/* ---------- NEW / UPDATED badges ---------- */

export const BADGE_DAYS = 30;

// Badge to show right now (badges turn off by themselves after BADGE_DAYS)
export const activeTag = (doc) => {
  if (!doc?.tag) return null;
  if (!doc.tag_at) return doc.tag;
  return Date.now() / 1000 - doc.tag_at < BADGE_DAYS * 86400 ? doc.tag : null;
};

export const badgeDaysLeft = (doc) =>
  doc?.tag && doc.tag_at ? Math.max(0, Math.ceil(BADGE_DAYS - (Date.now() / 1000 - doc.tag_at) / 86400)) : null;
