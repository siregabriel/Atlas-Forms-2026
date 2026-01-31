import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Archive, GripVertical } from 'lucide-react';

const CONFIG = {
  nombreNegocio: "Atlas Senior Living Forms Hub",
  passwordCorrecto: "Atlas2026", 
  emailSoporte: "grosales@atlasseniorliving.com",
  version: "0.9.3" // Update: Liquid Glass UI
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
  const [autenticado, setAutenticado] = useState(false);
  const [inputPass, setInputPass] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [letraFiltro, setLetraFiltro] = useState('All');
  const [catFiltro, setCatFiltro] = useState('All'); 
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const sesionActiva = localStorage.getItem('atlas_session');
    if (sesionActiva === 'true') {
      setAutenticado(true);
    }
  }, []);
  useEffect(() => {
    const target = heroTitleRef.current;
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setShowStickyTitle(!entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  
  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem('atlas_favs');
    return saved ? JSON.parse(saved) : [];
  });

  const [animatingIds, setAnimatingIds] = useState([]);
  const [draggingFavId, setDraggingFavId] = useState(null);
  const heroTitleRef = useRef(null);
  const [showStickyTitle, setShowStickyTitle] = useState(false);

  useEffect(() => {
    localStorage.setItem('atlas_favs', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const yaEsFavorito = favoritos.includes(id);

  if (!yaEsFavorito) {
      setAnimatingIds(prev => [...prev, id]);
      setTimeout(() => {
          setAnimatingIds(prev => prev.filter(itemId => itemId !== id));
        }, 1600);
  }

    setFavoritos(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
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
  const estados = ['Alabama','Florida','Georgia','Kentucky','Maryland','Mississippi','Tennessee','Texas','Virginia'];
  
  const archivosFiltrados = useMemo(() => {
    return DOCUMENTOS.filter(doc => {
      const cumpleNombre = doc.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const cumpleLetra = letraFiltro === 'All' || doc.letra === letraFiltro;
      const cumpleCat = catFiltro === 'All' || doc.departamento === catFiltro;
      const cumpleEstado = !estadoFiltro || doc.estado === estadoFiltro;
      return cumpleNombre && cumpleLetra && cumpleCat && cumpleEstado;
    });
  }, [busqueda, letraFiltro, catFiltro, estadoFiltro]);

  const listaFavoritos = favoritos
    .map(id => DOCUMENTOS.find(doc => doc.id === id))
    .filter(Boolean);

  const NotificationBadge = ({ tag }) => {
    if (!tag) return null;
    const isNew = tag === "NEW";
    return (
      <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider text-white shadow-sm z-20 animate-pulse ${isNew ? 'bg-green-500' : 'bg-blue-500'}`}>
        {tag}
      </span>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('atlas_session');
    setAutenticado(false);
  };

  const handleFavDragStart = (id) => {
    setDraggingFavId(id);
  };

  const handleFavDragEnd = () => {
    setDraggingFavId(null);
  };

  const handleFavDrop = (targetId) => {
    if (!draggingFavId || draggingFavId === targetId) return;
    const current = [...favoritos];
    const fromIndex = current.indexOf(draggingFavId);
    const toIndex = current.indexOf(targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    current.splice(fromIndex, 1);
    current.splice(toIndex, 0, draggingFavId);
    setFavoritos(current);
    setDraggingFavId(null);
  };

  const handleLogin = () => {
    if (inputPass === CONFIG.passwordCorrecto) {
      localStorage.setItem('atlas_session', 'true'); 
      setAutenticado(true);
    } else {
      alert('Incorrect code');
    }
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] font-sans antialiased p-4">
        <div className="w-full max-w-md p-8 bg-[#16161a] border border-white/10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="inline-block p-4 bg-blue-600/10 rounded-3xl mb-4 border border-blue-500/20 text-4xl">💎</div>
          <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">{CONFIG.nombreNegocio}</h2>
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
            <h1 ref={heroTitleRef} className="text-4xl font-black text-slate-900 tracking-tighter">{CONFIG.nombreNegocio}</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Files synchronized with OneDrive</p>
        </header>

        {/* --- MY DRAWER BAR (STICKY) --- */}
        <div className="sticky top-0 z-50 -mx-1 px-1 py-2 bg-[#f8fafc]/95 border-slate-200 ">
          <button 
            onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
            aria-expanded={mostrarFavoritos}
            aria-controls="drawer-content"
            title="Toggle My Drawer"
            className="w-full flex items-center justify-between py-2 px-1 hover:bg-slate-100/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-blue-200">
                {listaFavoritos.length}
              </div>
              {listaFavoritos.length > 0 ? (
                <div className="w-6 h-6 rounded-md bg-yellow-600 flex items-center justify-center shadow-sm">
                  <Archive className="w-4 h-4 text-white" />
                </div>
              ) : (
                <Archive className="w-5 h-5 text-slate-400" />
              )}
              <span className="font-bold text-slate-700 text-lg tracking-wide">My Drawer</span>
            </div>
            <div className={`flex-1 text-right pr-2 transition-all duration-300 ${showStickyTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'} pointer-events-none`}>
              <span className="text-slate-500 font-bold text-xs md:text-sm">{CONFIG.nombreNegocio}</span>
            </div>
            <span className={`text-slate-400 text-xs transform transition-transform duration-300 ${mostrarFavoritos ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>

        {/* --- CORTINA DE FAVORITOS (LIQUID GLASS) --- */}
          <div className="mb-8">
            <div id="drawer-content" className={`overflow-hidden transition-all duration-500 ease-in-out ${mostrarFavoritos ? 'max-h-[300px] opacity-100 mt-2 animate-appear-softly' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="relative group/favs py-2 px-2">
                 
                <div ref={scrollContainerRef} className="flex flex-wrap gap-3 pb-4 pl-1 overflow-y-auto">
                  {listaFavoritos.length === 0 ? (
                    <div className="w-full p-6 bg-white border border-slate-200 rounded-xl text-slate-400 text-xs font-bold">
                      No files in my drawer yet
                    </div>
                  ) : (
                    listaFavoritos.map(doc => {
                      const style = getFileDetails(doc.nombre);
                      const colors = getColorClasses(doc.departamento);
                      return (
                        <div
                          key={doc.id}
                          draggable
                          onDragStart={() => handleFavDragStart(doc.id)}
                          onDragEnd={handleFavDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleFavDrop(doc.id)}
                          className={`min-w-[170px] w-[170px] bg-slate-100 border border-slate-200 text-slate-800 p-4 rounded-2xl transition-all relative group flex flex-col justify-between h-[110px] flex-shrink-0 hover:bg-slate-200 ${draggingFavId === doc.id ? 'opacity-80 scale-95' : ''}`}
                        >
                          <div className="absolute top-2 left-2 pr-1 text-slate-300 hover:text-slate-500 cursor-move">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          
                          <NotificationBadge tag={doc.tag} />
                          <button onClick={(e) => toggleFavorito(e, doc.id)} className="absolute top-3 right-3 text-yellow-400 text-lg z-20 cursor-pointer hover:scale-110 transition-transform drop-shadow-sm">★</button>
                          
                          <div className="flex items-start gap-2 pl-4">
                              <span className="text-xl drop-shadow-sm">{style.icon}</span>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mt-1">{style.label}</span>
                              {doc.departamento && (
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border ${colors.active}`}>
                                  {doc.departamento}
                                </span>
                              )}
                          </div>
                          <div>
                              <h3 className="font-bold text-xs leading-tight truncate mb-2 pr-2 opacity-90 text-slate-800">{doc.nombre}</h3>
                              <a href={doc.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer">Open File <span>→</span></a>
                          </div>
                        </div>
                      );
                    })
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
          <input type="text" placeholder="Search by file name..." value={busqueda} className="flex-1 pl-6 pr-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-200 outline-none text-md focus:ring-2 focus:ring-blue-500/20 transition-all" onChange={(e) => setBusqueda(e.target.value)} />
          {(busqueda || letraFiltro !== 'All' || catFiltro !== 'All' || estadoFiltro) && (
            <button onClick={() => {setBusqueda(''); setLetraFiltro('All'); setCatFiltro('All'); setEstadoFiltro('');}} className="bg-red-50 text-red-500 px-6 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer">Clear</button>
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
        
        {/* --- SELECTOR DE ESTADOS --- */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 no-scrollbar scroll-smooth">
          <div className="flex flex-nowrap md:flex-wrap gap-1.5 min-w-max md:min-w-full justify-start md:justify-center">
            {estados.map(s => (
              <button
                key={s}
                onClick={() => setEstadoFiltro(s)}
                className={`px-4 h-10 flex-shrink-0 rounded-xl font-bold transition-all text-xs md:text-sm cursor-pointer ${estadoFiltro === s ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-100'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* --- REPOSITORIO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {archivosFiltrados.map(doc => {
            const style = getFileDetails(doc.nombre);
            const isFav = favoritos.includes(doc.id);
            const isAnimating = animatingIds.includes(doc.id);
            const colors = getColorClasses(doc.departamento);
            
            return (
              <div key={doc.id} className={`group ${isFav ? 'bg-slate-100' : 'bg-white'} p-3 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-visible z-0 hover:z-10`}>
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
                        <h3 className="font-bold text-slate-800 text-xs truncate pr-1 group-hover:text-blue-600 transition-colors">
                            {doc.nombre}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-2">
                    <div className="relative flex items-center justify-center w-8 h-8">
                        <button 
                            onClick={(e) => toggleFavorito(e, doc.id)}
                            className={`text-lg cursor-pointer transition-colors duration-200 z-10 ${isFav ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-300'}`}
                        >
                            <span className={`inline-block ${isAnimating && isFav ? 'animate-elastic-pop' : 'transition-transform hover:scale-125'}`}>
                            {isFav ? '★' : '☆'}
                            </span>
                        </button>

                        {/* ESTRELLA FANTASMA CON DESTELLOS */}
                        {isAnimating && (
                        <span className="absolute inset-0 flex items-center justify-center text-yellow-500 text-2xl pointer-events-none animate-fly-with-sparkles z-20 drop-shadow-md">
                            ★
                        </span>
                        )}
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
           <p className="text-slate-400 text-xs font-bold">© {new Date().getFullYear()} {CONFIG.nombreNegocio}</p>
        </div>
        <div className="flex gap-6 items-center">
           <a href={`mailto:${CONFIG.emailSoporte}`} className="text-slate-400 hover:text-blue-600 text-xs font-bold transition-colors">Report Issue</a>
           <button onClick={handleLogout} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-700 transition-all cursor-pointer">
             Logout
           </button>
        </div>
      </footer>

      {/* --- ESTILOS DE ANIMACIÓN --- */}
      <style jsx>{`
        /* Nueva animación de entrada suave para el contenedor de favoritos */
        @keyframes appear-softly {
            0% { opacity: 0; transform: translateY(-20px); max-height: 0; margin-bottom: 0; }
            100% { opacity: 1; transform: translateY(0); max-height: 500px; margin-bottom: 2rem; }
        }
        .animate-appear-softly {
            animation: appear-softly 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            overflow: hidden; 
        }

        /* 1. Rebote elástico en la estrella principal */
        @keyframes elastic-pop {
          0% { transform: scale(0.6); opacity: 0.6; }
          40% { transform: scale(1.2); opacity: 1; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-elastic-pop {
          animation: elastic-pop 0.9s ease-in-out both;
        }

        @keyframes grow-fade {
          0% { transform: scale(0.4); opacity: 0; }
          10% { opacity: 1; }
          80% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        /* 3. Explosión de destellos */
        @keyframes sparkle-burst {
            0% { transform: translate(0,0) scale(0); opacity: 1; }
            100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
        }

        .animate-fly-with-sparkles {
          animation: grow-fade 1.6s ease-out forwards;
          position: absolute;
        }

        .animate-fly-with-sparkles::before,
        .animate-fly-with-sparkles::after {
            content: '✦';
            position: absolute;
            top: 50%; left: 50%;
            font-size: 10px;
            color: #fbbf24;
            pointer-events: none;
            opacity: 0;
        }

        .animate-fly-with-sparkles::before {
            --tx: -20px; --ty: -20px;
            animation: sparkle-burst 1s ease-out forwards;
        }

        .animate-fly-with-sparkles::after {
            --tx: 20px; --ty: -15px;
            animation: sparkle-burst 1.2s ease-out 0.15s forwards;
        }
      `}</style>
    </div>
  );
}
