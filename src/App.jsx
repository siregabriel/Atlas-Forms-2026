import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion as Motion } from 'framer-motion';

const CONFIG = {
  nombre: "Atlas Senior Living Forms Hub",
  passwordCorrecto: "Atlas2026", 
  emailSoporte: "grosales@atlasseniorliving.com",
  version: "1.4.4" // Update: Drag & Drop Fixed & Robust
};

// --- BASE DE DATOS ---
const DOCUMENTOS = [
  { id: 40, nombre: "Workplace Violence Policy.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBuHkCD07-UTo9b6Y1sziOvASvkbqUh6s0cIzNZgXrAOfE?e=EHgOCY", departamento: "Clinical Policy" },
  { id: 50, nombre: "Work Injury Reporting.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDK_WdNU7I0QqXQUM7yqVsrAVJY5Daj43iQn1qFCnyclwY?e=6qgcG1", departamento: "Clinical Policy" },
  { id: 60, nombre: "Alexa Speak2 Codes.pdf", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/grosales/IQBmWkt2raozRa4402TYpvtqAQETVbEw32trr2Ch6dstAwM?e=SdiFCJ", departamento: "" },
  { id: 70, nombre: "Atlas Levels of Care.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDxCI4iiAO8Qb1xU5cTZtjyAdzUl9c8q8EJ4agxDOuteKM?e=ZRFmh8", departamento: "" },
  { id: 80, nombre: "ECC LNS Review.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQB87Ux2NA74RpnHyMC4x3yyAQOst8jdq1ibPCaculNPv30?e=QuKD0P", departamento: "" },
  { id: 90, nombre: "Fax Physician Form.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDHVqNxl0RVSLhdbGYgHuRjASwv7wkeSb9iYHcMthxWT6k?e=Qcg9On", departamento: "" },
  { id: 91, nombre: "Fire Drill Form.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCkKQJsKO2LRLPzBwo_vSeYAQLNeJ8ZcxUtzBB0fq0sAmo?e=4auaKI", departamento: "Clinical Policy" },
  { id: 92, nombre: "Grievance.docx", letra: "G", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDQLRCejcLMSrOOH_iEUIH0AYcGIivVgxaXu66Pce9sxoY?e=S7BtmP", departamento: "Clinical Policy" },
  { id: 93, nombre: "Reportable Events.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBpBiQKpebRTIyiFc99cSY3AS2Z5CzmrAN3N1-wncwMBMg?e=2jif8e", departamento: "Clinical Policy" },
  { id: 94, nombre: "Resident Refusals.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAfsGQuGES-Spia4J0wXmpvAb98LEbcFAZdD7NxoNCx-Z8?e=kB3Kqs", departamento: "" },
  { id: 95, nombre: "Alexa Speak2 Consent Form.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCOVTG_FDn4TrjjahGgY0rpAR16fnGe5uKsG5YsaJtxRYQ?e=NX1bmN", departamento: "" },
  { id: 96, nombre: "ADL Care Plan.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAndTq7qaihQrFMQxPf5C7hAXN8RjWuv-tYMcjhS7UGsOA?e=9bBX4S", departamento: "Clinical Policy" },
  { id: 97, nombre: "Alexa Speak2 Policy.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBcorH_s71_TJDa64cOxQCkAX3xnkvbkSBs8myy5oi22Q4?e=WBM2w9", departamento: "Clinical Policy" },
  { id: 98, nombre: "Approved Assitance Device.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAlImmRLolSRob8pwuV-ql8AROaN-MiZdL2uiHcqSG_UCU?e=8GZvPu", departamento: "Clinical Policy" },
  { id: 99, nombre: "Care Plan Review.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCzLPHFdLjvQ4tXm3yXhu4DAYg6ZmPIbvkIb0bhygzkl28?e=ResSF2", departamento: "Clinical Policy" },
  { id: 100, nombre: "Common Area Video Surveillance.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDm-FEpDjfSQLpI-A_qIx6MAaCHkGAlu6dLZvf9DCFDboE?e=OLsm6C", departamento: "Clinical Policy" }
  
];

const CATEGORIAS = ['All', 'Clinical Policy', 'Job Description'];

const OFFICE_STYLES = {
  pdf:  { icon: '📕', color: '#EE3322', bg: 'bg-red-50',  label: 'PDF' },
  doc:  { icon: '📘', color: '#2B579A', bg: 'bg-blue-50', label: 'Word' },
  docx: { icon: '📘', color: '#2B579A', bg: 'bg-blue-50', label: 'Word' },
  xls:  { icon: '📗', color: '#217346', bg: 'bg-green-50', label: 'Excel' },
  xlsx: { icon: '📗', color: '#217346', bg: 'bg-green-50', label: 'Excel' },
  default: { icon: '📁', color: '#64748b', bg: 'bg-slate-50', label: 'File' }
};

export default function App() {
  const [autenticado, setAutenticado] = useState(() => {
    const sesionActiva = localStorage.getItem('atlas_session');
    return sesionActiva === 'true';
  });
  const [inputPass, setInputPass] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [letraFiltro, setLetraFiltro] = useState('All');
  const [catFiltro, setCatFiltro] = useState('All'); 
  const [stateFiltro, setStateFiltro] = useState('');
  const [mostrarFavoritos, setMostrarFavoritos] = useState(true);
  
  // DRAG & DROP STATES
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null); 

  
  
  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem('atlas_favs');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [animatingIds, setAnimatingIds] = useState([]);
  const [drawerGlowing, setDrawerGlowing] = useState(false);
  const [sugOpen, setSugOpen] = useState(false);
  const [sugIndex, setSugIndex] = useState(-1);
  const drawerCountRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('atlas_favs', JSON.stringify(favoritos));
  }, [favoritos]);

  const stellarBurst = (x, y, opts = {}) => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const size = opts.size ?? 160;
    const durationMs = opts.durationMs ?? 1200;
    const speedScale = opts.speedScale ?? 1;
    const lifeDecay = opts.lifeDecay ?? 0.02;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = `${x - size / 2}px`;
    canvas.style.top = `${y - size / 2}px`;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    const ctx = canvas.getContext('2d');
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    document.body.appendChild(canvas);
    const centerX = size / 2;
    const centerY = size / 2;
    const colors = ['#ffffff', '#fde047', '#60a5fa', '#a78bfa', '#22d3ee'];
    const count = 24;
    const particles = [];
    const meteors = [];
    const createPRNG = (seed) => {
      let s = seed >>> 0;
      return () => {
        s = (1664525 * s + 1013904223) >>> 0;
        return (s & 0xfffffff) / 0x10000000;
      };
    };
    const rnd = createPRNG((Math.floor(x * y) ^ count) >>> 0);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2) * (i / count) + rnd() * 0.3;
      const speed = (2.8 + rnd() * 2.2) * speedScale;
      const s = 2 + rnd() * 2;
      const c = colors[Math.floor(rnd() * colors.length)];
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: s,
        spin: (rnd() * 0.1) + 0.05,
        color: c,
        rotation: rnd() * Math.PI
      });
    }
    const meteorCount = 3;
    for (let i = 0; i < meteorCount; i++) {
      const dir = rnd() > 0.5 ? 1 : -1;
      const startX = dir === 1 ? -20 : size + 20;
      const startY = rnd() * size * 0.6 + size * 0.2;
      const speed = (4 + rnd() * 2) * speedScale;
      const angle = (dir === 1 ? 0.25 : 0.75) * Math.PI + rnd() * 0.15 * dir;
      const color = colors[Math.floor(rnd() * colors.length)];
      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        len: 18 + rnd() * 10,
        w: 1.5 + rnd(),
        color
      });
    }
    let start;
    const drawStar = (cx, cy, spikes, outerR, innerR, rot, color, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const step = Math.PI / spikes;
      for (let i = 0; i < spikes * 2; i++) {
        const rad = i % 2 === 0 ? outerR : innerR;
        const a = i * step;
        const sx = Math.cos(a) * rad;
        const sy = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    const loop = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      ctx.clearRect(0, 0, size, size);
      for (const p of particles) {
        const omega = 0.045;
        const vx = p.vx;
        const vy = p.vy;
        p.vx = vx * Math.cos(omega) - vy * Math.sin(omega);
        p.vy = vx * Math.sin(omega) + vy * Math.cos(omega);
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.rotation += p.spin;
        p.life -= lifeDecay;
        if (p.life <= 0) continue;
        drawStar(p.x, p.y, 5, p.size + 1.5, p.size, p.rotation, p.color, Math.max(p.life, 0));
        ctx.save();
        ctx.globalAlpha = Math.max(p.life - 0.2, 0);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 2, p.y - p.vy * 2);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
      }
      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;
        m.life -= lifeDecay;
        if (m.life <= 0) continue;
        const gx = m.x - m.vx * m.len;
        const gy = m.y - m.vy * m.len;
        const grad = ctx.createLinearGradient(gx, gy, m.x, m.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, m.color);
        grad.addColorStop(1, 'rgba(255,255,255,0.9)');
        ctx.save();
        ctx.globalAlpha = Math.max(m.life, 0);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.w;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.restore();
      }
      if (elapsed < durationMs) {
        requestAnimationFrame(loop);
      } else {
        canvas.remove();
      }
    };
    requestAnimationFrame(loop);
  };

  const toggleFavorito = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const yaEsFavorito = favoritos.includes(id);

    if (!yaEsFavorito) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        stellarBurst(x, y);
        if (drawerCountRef.current) {
          const r = drawerCountRef.current.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          stellarBurst(cx, cy, { durationMs: 5600, speedScale: 0.8, lifeDecay: 0.016, size: 160 });
        }

        setAnimatingIds(prev => [...prev, id]);
        setDrawerGlowing(true);
        setTimeout(() => {
            setAnimatingIds(prev => prev.filter(itemId => itemId !== id));
            setDrawerGlowing(false);
        }, 800);
        setFavoritos(prev => [...prev, id]);
    } else {
        setFavoritos(prev => prev.filter(favId => favId !== id));
    }
  };

  // --- LÓGICA DE DRAG & DROP ROBUSTA ---
  const handleDragStart = (e, id) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  

  const handleDragOver = (e, index) => {
    e.preventDefault(); 
    // We allow bubbling so the container can handle auto-scroll!
    // e.stopPropagation(); 
    
    // --- CALCULATE DROP TARGET ---
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = (rect.left + rect.right) / 2;
    
    // If mouse is on right half, target is next index
    let newDropIndex = index;
    if (e.clientX > midpoint) {
        newDropIndex = index + 1;
    }
    
    if (dropTargetIndex !== newDropIndex) {
        setDropTargetIndex(newDropIndex);
    }
  };

  

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling to container drop
    
    if (!draggedItemId || draggedItemId === targetId) {
        setDraggedItemId(null);
        setDropTargetIndex(null);
        return;
    }

    const sourceIndex = favoritos.indexOf(draggedItemId);
    const targetIndex = favoritos.indexOf(targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
        // Fallback or error state
        setDraggedItemId(null);
        setDropTargetIndex(null);
        return;
    }

    // Calculate insertion index
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = (rect.left + rect.right) / 2;
    const isAfter = e.clientX > midpoint;

    let insertIndex = targetIndex;
    if (isAfter) insertIndex += 1;

    // Adjust for removal
    // If source is before target, removing source shifts target index down by 1?
    // Splice logic:
    // [A, B, C, D]. Move A(0) to after C(2). Target C is at 2. Insert at 3.
    // Remove A -> [B, C, D]. Insert at 3-1 = 2? -> [B, C, A, D]. Correct.
    
    // [A, B, C, D]. Move D(3) to before B(1). Target B is at 1. Insert at 1.
    // Remove D -> [A, B, C]. Insert at 1. -> [A, D, B, C]. Correct.

    let finalInsertIndex = insertIndex;
    if (sourceIndex < insertIndex) {
        finalInsertIndex -= 1;
    }

    const newFavoritos = [...favoritos];
    const [movedItem] = newFavoritos.splice(sourceIndex, 1);
    newFavoritos.splice(finalInsertIndex, 0, movedItem);
    
    setFavoritos(newFavoritos);
    setDraggedItemId(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDropTargetIndex(null);
  };

  

  const getDisplayName = (fileName) => {
    const idx = fileName.lastIndexOf('.');
    if (idx <= 0) return fileName;
    return fileName.slice(0, idx);
  };
  
  const handleSuggestionSelect = (doc) => {
    setBusqueda(getDisplayName(doc.nombre));
    setSugOpen(false);
  };

  const getFileDetails = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return OFFICE_STYLES[ext] || OFFICE_STYLES.default;
  };

  const getColorClasses = (dept) => {
    switch (dept) {
      case 'Clinical Policy': 
        return {
          active: 'bg-teal-100 text-teal-800 border-teal-300 shadow-teal-100',
          hover: 'hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200'
        };
      case 'Job Description': 
        return {
          active: 'bg-purple-100 text-purple-800 border-purple-300 shadow-purple-100',
          hover: 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'
        };
      default: 
        return {
          active: 'bg-slate-900 text-white border-slate-900 shadow-slate-300',
          hover: 'hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300'
        };
    }
  };

  const abecedario = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
  const STATES = ['ALABAMA','FLORIDA','GEORGIA','KENTUCKY','MARYLAND','MISSISSIPPI','SOUTH CAROLINA','TENNESSEE','TEXAS','VIRGINIA'];
  
  const archivosFiltrados = useMemo(() => {
    return DOCUMENTOS.filter(doc => {
      const nombreSinExt = getDisplayName(doc.nombre).toLowerCase();
      const cumpleNombre = nombreSinExt.includes(busqueda.toLowerCase());
      const cumpleLetra = letraFiltro === 'All' || doc.letra === letraFiltro;
      const cumpleCat = catFiltro === 'All' || doc.departamento === catFiltro;
      const cumpleEstado = !stateFiltro 
        || (doc.estado && doc.estado === stateFiltro)
        || nombreSinExt.includes(stateFiltro.toLowerCase());
      return cumpleNombre && cumpleLetra && cumpleCat && cumpleEstado;
    });
  }, [busqueda, letraFiltro, catFiltro, stateFiltro]);

  // Use useMemo to prevent unnecessary recalculations, but filter strictly
  const validFavorites = useMemo(() => {
    return favoritos.filter(favId => DOCUMENTOS.some(d => d.id === favId));
  }, [favoritos]);

  const suggestions = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return [];
    return DOCUMENTOS
      .filter(doc => getDisplayName(doc.nombre).toLowerCase().includes(q))
      .slice(0, 6);
  }, [busqueda]);

  const NotificationBadge = ({ tag }) => {
    if (!tag) return null;
    const isNew = tag === "NEW";
    return (
      <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider text-white shadow-sm z-20 animate-pulse ${isNew ? 'bg-green-500' : 'bg-blue-500'}`}>
        {tag}
      </span>
    );
  };

  const handleLogin = () => {
    if (inputPass === CONFIG.passwordCorrecto) {
      localStorage.setItem('atlas_session', 'true'); 
      setAutenticado(true);
    } else {
      alert('Incorrect code');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('atlas_session');
    setAutenticado(false);
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] font-sans antialiased p-4">
        <div className="w-full max-w-md p-8 bg-[#16161a] border border-white/10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="inline-block p-4 bg-blue-600/10 rounded-3xl mb-4 border border-blue-500/20 text-4xl">💎</div>
          <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">{CONFIG.nombre}</h2>
          <input 
            type="password" 
            placeholder="Enter access code"
            className="w-full bg-black/40 border border-white/5 text-white p-5 rounded-2xl mb-6 outline-none text-center tracking-widest focus:border-blue-500/50 transition-all"
            onChange={(e) => setInputPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl transition-all cursor-pointer">Enter Repository</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans antialiased text-slate-900 flex flex-col justify-between">
      <div className="max-w-[90rem] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{CONFIG.nombre}</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Files synchronized with OneDrive</p>
        </header>

        {/* --- CORTINA DE FAVORITOS --- */}
        <div className="mb-8 animate-appear-softly lg:float-right lg:w-[22rem] lg:ml-6 lg:mb-0 lg:sticky lg:top-24">
          <button 
            onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
            className="w-full flex items-center justify-between py-2 px-1 hover:bg-slate-100/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Motion.div 
                ref={drawerCountRef}
                animate={drawerGlowing ? { scale: 1.3, backgroundColor: "#3b82f6", boxShadow: "0 0 0 4px #bfdbfe" } : { scale: 1, backgroundColor: "#2563eb", boxShadow: "0 0 0 0px transparent" }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-blue-200"
              >
                {validFavorites.length}
              </Motion.div>
              <Motion.span 
                animate={drawerGlowing ? { scale: 1.05, color: "#2563eb", textShadow: "0 0 10px rgba(37,99,235,0.5)" } : { scale: 1, color: "#334155", textShadow: "none" }}
                className="font-bold text-slate-700 text-lg tracking-wide"
              >
                My Favorites
              </Motion.span>
            </div>
            <span className={`text-slate-400 text-xs transform transition-transform duration-300 ${mostrarFavoritos ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          <div className={`transition-opacity duration-500 ease-in-out ${mostrarFavoritos ? 'opacity-100' : 'opacity-0 hidden'}`}>
            
            <div className="py-4 px-2"> 
              <div 
                  className="grid grid-cols-2 gap-3 pt-3"
              >
                
                {/* --- MAPEO DE FAVORITOS (DRAGGABLE) --- */}
                {validFavorites.map((favId, index) => {
                  const doc = DOCUMENTOS.find(d => d.id === favId);
                  if (!doc) return null;
                  const style = getFileDetails(doc.nombre);
                  const deptColors = getColorClasses(doc.departamento);
                  
                  const isDraggedItem = draggedItemId === doc.id;
                  const draggedVisualIndex = validFavorites.indexOf(draggedItemId);

                  return (
                    <div 
                        key={doc.id} 
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, doc.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, doc.id)}
                        className={`
                            w-full
                            bg-gradient-to-br from-white/60 to-white/30 border border-white/60 
                            text-slate-800 p-4 rounded-2xl transition-all relative group flex flex-col justify-between 
                            min-h-[120px] h-auto hover:bg-white/50 
                            cursor-grab active:cursor-grabbing
                            ${isDraggedItem ? 'opacity-40 border-blue-400 border-dashed scale-95' : ''}
                        `}
                    >
                      {/* --- LÍNEA GUÍA DE DROP (DROP INDICATOR) --- */}
                      {dropTargetIndex !== null && 
                       !isDraggedItem && 
                       dropTargetIndex !== draggedVisualIndex && 
                       dropTargetIndex !== draggedVisualIndex + 1 && (
                          <>
                             {dropTargetIndex === index && (
                                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-50 shadow-[0_0_10px_rgba(59,130,246,0.8)] pointer-events-none animate-pulse h-full scale-y-90 origin-center" />
                             )}
                             {index === validFavorites.length - 1 && dropTargetIndex === index + 1 && (
                                <div className="absolute -right-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-50 shadow-[0_0_10px_rgba(59,130,246,0.8)] pointer-events-none animate-pulse h-full scale-y-90 origin-center" />
                             )}
                          </>
                      )}

                      <NotificationBadge tag={doc.tag} />
                      
                      {/* 6 PUNTOS (DRAG HANDLE) */}
                      <div className="absolute top-2 left-2 text-slate-400/50 group-hover:text-slate-400 transition-colors pointer-events-none">
                         <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
                            <circle cx="2" cy="2" r="1.5"/><circle cx="2" cy="6" r="1.5"/><circle cx="2" cy="10" r="1.5"/>
                            <circle cx="6" cy="2" r="1.5"/><circle cx="6" cy="6" r="1.5"/><circle cx="6" cy="10" r="1.5"/>
                         </svg>
                      </div>

                      <button onClick={(e) => toggleFavorito(e, doc.id)} className="absolute top-3 right-3 text-yellow-400 text-lg z-20 cursor-pointer hover:scale-110 transition-transform drop-shadow-sm">★</button>
                      
                      <div className="flex items-start gap-2 mt-4 pointer-events-none select-none">
                          <span className="text-xl drop-shadow-sm">{style.icon}</span>
                          <div className="min-w-0">
                              {doc.departamento && (
                                <span className={`text-[6px] font-bold px-1.5 py-0.5 rounded-md border mb-1 inline-block whitespace-nowrap ${deptColors.active}`}>
                                    {doc.departamento}
                                </span>
                              )}
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block leading-none">{style.label}</span>
                          </div>
                      </div>
                      
                      <div className="pointer-events-none select-none">
                          <h3 className="font-bold text-xs leading-tight mb-2 pr-2 opacity-90 text-slate-800 break-words">{getDisplayName(doc.nombre)}</h3>
                          <div className="pointer-events-auto">
                             <a href={doc.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer">Open File <span>→</span></a>
                          </div>
                      </div>
                    </div>
                  );
                })}
                {validFavorites.length === 0 && (
                    <div className="w-full min-h-[120px] flex items-center justify-center text-slate-600 text-xs opacity-90">Click ★ to pin files here</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- PESTAÑAS DE DEPARTAMENTOS --- */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIAS.map(cat => {
             const colors = getColorClasses(cat);
             const isActive = catFiltro === cat;
             return (
               <button
                  key={cat}
                  onClick={() => { setCatFiltro(cat); setLetraFiltro('All'); }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    isActive 
                    ? `${colors.active} shadow-md scale-105` 
                    : `bg-white text-slate-500 border-slate-200 ${colors.hover}`
                  }`}
               >
                 {cat}
               </button>
             );
          })}
        </div>

        {/* --- BUSCADOR --- */}
        <div className="relative mb-6 flex gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search by file name..." 
              value={busqueda} 
              className="w-full pl-6 pr-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-200 outline-none text-md focus:ring-2 focus:ring-blue-500/20 transition-all" 
              onChange={(e) => { setBusqueda(e.target.value); setSugIndex(-1); setSugOpen(true); }} 
              onFocus={() => setSugOpen(true)}
              onBlur={() => setTimeout(() => setSugOpen(false), 100)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSugOpen(true);
                  setSugIndex(i => Math.min(i + 1, suggestions.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSugOpen(true);
                  setSugIndex(i => Math.max(i - 1, 0));
                } else if (e.key === 'Enter') {
                  if (sugIndex >= 0 && suggestions[sugIndex]) {
                    e.preventDefault();
                    handleSuggestionSelect(suggestions[sugIndex]);
                  }
                } else if (e.key === 'Escape') {
                  setSugOpen(false);
                }
              }}
            />
            {sugOpen && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {suggestions.map((doc, idx) => {
                  const style = getFileDetails(doc.nombre);
                  const active = idx === sugIndex;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionSelect(doc)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left ${active ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'}`}
                    >
                      <div className={`w-6 h-6 ${style.bg} rounded-md flex items-center justify-center border border-slate-100`}>
                        <span className="text-sm">{style.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate">{getDisplayName(doc.nombre)}</span>
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{style.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {(busqueda || letraFiltro !== 'All' || catFiltro !== 'All' || stateFiltro) && (
            <button onClick={() => {setBusqueda(''); setLetraFiltro('All'); setCatFiltro('All'); setStateFiltro('');}} className="bg-red-50 text-red-500 px-6 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer">Clear</button>
          )}
        </div>

        {/* --- SELECTOR DE LETRAS --- */}
        <div className="flex overflow-x-auto gap-1.5 pb-2 mb-6 no-scrollbar scroll-smooth">
          <div className="flex flex-nowrap md:flex-wrap gap-1.5 min-w-max md:min-w-full justify-start md:justify-center">
            {abecedario.map(l => (
              <button key={l} onClick={() => setLetraFiltro(l)} className={`w-8 h-8 flex-shrink-0 rounded-lg font-bold transition-all text-xs cursor-pointer ${letraFiltro === l ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-100'}`}>{l}</button>
            ))}
          </div>
        </div>
        
        {/* --- CATEGORÍAS POR ESTADO --- */}
        <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
          {STATES.map(st => {
            const active = stateFiltro === st;
            return (
              <button
                key={st}
                onClick={() => setStateFiltro(prev => (prev === st ? '' : st))}
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer border ${
                  active 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* --- REPOSITORIO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {archivosFiltrados.map(doc => {
            const style = getFileDetails(doc.nombre);
            const isFav = favoritos.includes(doc.id);
            const isAnimating = animatingIds.includes(doc.id);
            const colors = getColorClasses(doc.departamento);
            
            return (
              <div key={doc.id} className="group bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-visible z-0 hover:z-10">
                <NotificationBadge tag={doc.tag} />
                
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 ${style.bg} rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-50 group-hover:scale-105 transition-transform`}>
                        <span className="text-xl">{style.icon}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <p className="text-[8px] font-black uppercase tracking-wider" style={{ color: style.color }}>{style.label}</p>
                           {doc.departamento && (
                             <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border ${colors.active}`}>
                               {doc.departamento}
                             </span>
                           )}
                        </div>
                        <h3 className="font-bold text-slate-800 text-xs pr-1 group-hover:text-blue-600 transition-colors break-words">
                            {getDisplayName(doc.nombre)}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-2">
                    <div className="relative flex items-center justify-center w-8 h-8">
                        <Motion.button 
                            onClick={(e) => toggleFavorito(e, doc.id)}
                            className="text-lg cursor-pointer z-10 flex items-center justify-center outline-none"
                            initial={false}
                            animate={{ 
                                scale: isAnimating ? [1, 1.5, 1] : 1,
                                color: isFav ? "#fbbf24" : "#e2e8f0"
                            }}
                            whileHover={{ scale: 1.2, color: isFav ? "#fbbf24" : "#fcd34d" }}
                            whileTap={{ scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                            {isFav ? '★' : '☆'}
                        </Motion.button>
                    </div>
                    
                    <a href={doc.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-400 font-bold text-[9px] uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                        Open
                    </a>
                </div>
              </div>
            );
          })}
        </div>

        {archivosFiltrados.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3 opacity-20">📂</div>
            <p className="text-slate-400 text-sm font-medium">No files found for this filter</p>
          </div>
        )}
      </div>
      
      {/* FOOTER */}
      <footer className="max-w-[90rem] mx-auto w-full mt-20 border-t border-slate-200 py-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <p className="text-slate-400 text-xs font-bold">© {new Date().getFullYear()} {CONFIG.nombre}</p>
        </div>
        <div className="flex gap-6">
           <a href={`mailto:${CONFIG.emailSoporte}`} className="text-slate-400 hover:text-blue-600 text-xs font-bold py-1.5 transition-colors">Report Issue</a>
           <button onClick={handleLogout} className="text-slate-400 hover:text-gray-600 text-xs bg-black text-white px-4 py-1.5 rounded-lg cursor-pointer font-bold transition-colors">Logout</button>
        </div>
      </footer>

      {/* --- ESTILOS DE ANIMACIÓN --- */}
      <style jsx>{`
        /* Nueva animación de entrada suave para el contenedor de favoritos */
        @keyframes appear-softly {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-appear-softly {
            animation: appear-softly 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            overflow: visible; 
        }
      `}</style>
    </div>
  );
}
