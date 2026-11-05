import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CheckSquare, Calendar, Timer, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const QuickSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, tasks, selectTaskForFocus } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  const filteredTasks = tasks.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(query.toLowerCase())
  );

  const navigationShortcuts = [
    { label: 'Ir a Resumen', path: '/' },
    { label: 'Ir a Concentración', path: '/concentracion' },
    { label: 'Ir a Planificación', path: '/planificacion' },
    { label: 'Ir a Mis tareas', path: '/tareas' },
    { label: 'Ir a Estadísticas', path: '/estadisticas' },
    { label: 'Ir a Categorías', path: '/categorias' },
    { label: 'Ir a Ajustes', path: '/ajustes' },
  ].filter((s) => s.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-[#0B0A12]/80 backdrop-blur-md"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-[#171426] border border-[rgba(232,231,240,0.12)] rounded-2xl p-4 shadow-2xl text-[#E8E7F0] z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 px-2 pb-3 border-b border-[rgba(232,231,240,0.08)]">
          <Search size={18} className="text-[#9B97AC]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tareas, categorías o secciones..."
            className="w-full bg-transparent text-sm text-[#E8E7F0] placeholder-[#9B97AC] focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded text-[#9B97AC] hover:text-[#E8E7F0]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 max-h-72 overflow-y-auto space-y-3">
          {/* Tasks Results */}
          {filteredTasks.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-[#9B97AC] uppercase tracking-wider px-2 block mb-1">
                Tareas
              </span>
              <div className="space-y-1">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate('/tareas');
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#231F38] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckSquare size={16} className="text-[#8B5CF6]" />
                      <span className="text-xs font-medium text-[#E8E7F0]">{task.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0B0A12] text-[#9B97AC]">
                        {task.categoryName}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectTaskForFocus(task);
                        setIsSearchOpen(false);
                        navigate('/concentracion');
                      }}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded bg-[#67E8B4]/20 text-[#67E8B4] text-[10px] flex items-center gap-1 transition-opacity"
                    >
                      <Timer size={12} />
                      Enfocar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Shortcuts */}
          {navigationShortcuts.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-[#9B97AC] uppercase tracking-wider px-2 block mb-1">
                Navegación
              </span>
              <div className="space-y-1">
                {navigationShortcuts.map((s) => (
                  <div
                    key={s.path}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(s.path);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#231F38] cursor-pointer group transition-colors text-xs text-[#9B97AC] hover:text-[#E8E7F0]"
                  >
                    <span>{s.label}</span>
                    <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredTasks.length === 0 && navigationShortcuts.length === 0 && (
            <div className="text-center py-6 text-xs text-[#9B97AC]">
              No se encontraron resultados para "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
