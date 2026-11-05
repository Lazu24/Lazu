import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, CheckCircle2, Clock, FlaskConical } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

interface TopbarProps {
  onMenuToggle: () => void;
  onOpenTestingPanel?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle, onOpenTestingPanel }) => {
  const location = useLocation();
  const { setIsSearchOpen } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic breadcrumb title
  const getBreadcrumbTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Resumen';
      case '/concentracion':
        return 'Concentración';
      case '/planificacion':
        return 'Planificación';
      case '/tareas':
        return 'Mis tareas';
      case '/estadisticas':
        return 'Estadísticas';
      case '/categorias':
        return 'Categorías';
      case '/ajustes':
        return 'Ajustes';
      default:
        return 'Resumen';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[#0B0A12]/80 backdrop-blur-md border-b border-[rgba(232,231,240,0.08)] flex items-center justify-between px-4 lg:px-8">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-[#9B97AC] hover:text-[#E8E7F0] hover:bg-[#171426] lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-sm text-[#9B97AC]">
          <span className="hover:text-[#E8E7F0] cursor-pointer">Mi espacio</span>
          <span>/</span>
          <span className="text-[#E8E7F0] font-medium">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      {/* Right: Search, Date, Notification Bell */}
      <div className="flex items-center gap-4">
        {/* Quick Search Trigger */}
        <div
          onClick={() => setIsSearchOpen(true)}
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#171426] border border-[rgba(232,231,240,0.08)] text-[#9B97AC] hover:text-[#E8E7F0] hover:border-[#8B5CF6]/40 transition-colors cursor-pointer w-52 md:w-64"
        >
          <Search size={15} />
          <span className="text-xs">Buscar en Lazu</span>
          <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#231F38] text-[#9B97AC] border border-[rgba(232,231,240,0.08)]">
            ⌘ K
          </kbd>
        </div>

        {/* Date Display */}
        <div className="hidden md:flex items-center text-xs font-mono text-[#9B97AC] px-2.5 py-1 rounded-lg bg-[#171426]/50 border border-[rgba(232,231,240,0.06)]">
          Jue, 29 oct 2026
        </div>

        {/* Testing Suite Trigger */}
        {onOpenTestingPanel && (
          <button
            onClick={onOpenTestingPanel}
            title="Panel de Pruebas & Diagnóstico (Sprint 1)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs font-medium text-[#C4B5FD] hover:bg-[#8B5CF6]/25 transition-all cursor-pointer"
          >
            <FlaskConical size={14} className="text-[#8B5CF6]" />
            <span className="hidden xl:inline text-[11px]">Testing Sprint 1</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-[#9B97AC] hover:text-[#E8E7F0] hover:bg-[#171426] relative transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#67E8B4] ring-2 ring-[#0B0A12]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#171426] border border-[rgba(232,231,240,0.12)] rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(232,231,240,0.08)]">
                <span className="text-xs font-semibold text-[#E8E7F0]">Notificaciones</span>
                <span className="text-[11px] text-[#67E8B4] cursor-pointer hover:underline">Marcar leídas</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2.5 items-start p-2 rounded-xl bg-[#0B0A12]/40">
                  <CheckCircle2 size={16} className="text-[#67E8B4] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#E8E7F0] font-medium">Meta diaria al 63%</p>
                    <p className="text-[11px] text-[#9B97AC]">75 de 120 min completados hoy.</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start p-2 rounded-xl bg-[#0B0A12]/40">
                  <Clock size={16} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#E8E7F0] font-medium">Próxima actividad</p>
                    <p className="text-[11px] text-[#9B97AC]">Revisar los pendientes a las 14:00.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
