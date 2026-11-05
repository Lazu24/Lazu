import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Timer,
  Calendar,
  CheckSquare,
  BarChart3,
  Shapes,
  Settings,
  Sparkles,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { ProgressBar } from '../ui/ProgressBar.tsx';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { todayFocusMinutes, settings, pendingTasksCount } = useApp();

  const navItems = [
    { name: 'Resumen', path: '/', icon: LayoutDashboard },
    { name: 'Concentración', path: '/concentracion', icon: Timer },
    { name: 'Planificación', path: '/planificacion', icon: Calendar },
    {
      name: 'Mis tareas',
      path: '/tareas',
      icon: CheckSquare,
      badge: pendingTasksCount,
    },
    { name: 'Estadísticas', path: '/estadisticas', icon: BarChart3 },
    { name: 'Categorías', path: '/categorias', icon: Shapes },
    { name: 'Ajustes', path: '/ajustes', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0B0A12]/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B0A12] border-r border-[rgba(232,231,240,0.08)] flex flex-col justify-between select-none transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5">
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 px-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.25)]">
              {/* Geometric cube logo */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.12 6.4-6.05-4.06a4.95 4.95 0 0 0-6.14 0L2.88 6.4a2 2 0 0 0-.88 1.6v8a2 2 0 0 0 .88 1.6l6.05 4.06a4.95 4.95 0 0 0 6.14 0l6.05-4.06a2 2 0 0 0 .88-1.6v-8a2 2 0 0 0-.88-1.6z"/>
                <path d="M12 22V12"/>
                <path d="m21 7-9 5-9-5"/>
              </svg>
            </div>
            <div className="flex items-baseline">
              <span className="font-semibold text-xl tracking-tight text-[#E8E7F0]">lazu</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#67E8B4] ml-0.5 mb-1 inline-block"></span>
            </div>
          </div>

          {/* Space Selector */}
          <div className="mb-6 px-1">
            <span className="text-[10px] font-semibold tracking-wider text-[#9B97AC] uppercase block mb-1.5 px-2">
              Espacio personal
            </span>
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#171426] border border-[rgba(232,231,240,0.08)] hover:border-[#8B5CF6]/40 transition-colors cursor-pointer group">
              <span className="text-sm font-medium text-[#E8E7F0]">Mi espacio</span>
              <ChevronsUpDown size={15} className="text-[#9B97AC] group-hover:text-[#E8E7F0]" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-[#8B5CF6]/15 text-[#E8E7F0] border border-[#8B5CF6]/60 shadow-[0_0_16px_rgba(139,92,246,0.15)] font-semibold'
                        : 'text-[#9B97AC] hover:text-[#E8E7F0] hover:bg-[#171426]/80'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={`transition-colors ${
                            isActive
                              ? 'text-[#8B5CF6]'
                              : 'text-[#9B97AC] group-hover:text-[#E8E7F0]'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-[#171426] border border-[rgba(232,231,240,0.1)] text-[#9B97AC]">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 space-y-4 border-t border-[rgba(232,231,240,0.08)]">
          {/* Widget: "Tu foco de hoy" */}
          <div className="rounded-2xl bg-[#171426] border border-[rgba(232,231,240,0.08)] p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9B97AC]">Tu foco de hoy</span>
              <div className="w-5 h-5 rounded-md bg-[#67E8B4]/15 flex items-center justify-center text-[#67E8B4]">
                <Sparkles size={12} />
              </div>
            </div>

            <div className="font-mono text-base font-bold text-[#E8E7F0] mb-2 flex items-baseline gap-1">
              <span>{todayFocusMinutes}</span>
              <span className="text-[#9B97AC] text-xs">/ {settings.dailyGoalMinutes} min</span>
            </div>

            <ProgressBar
              value={todayFocusMinutes}
              max={settings.dailyGoalMinutes}
              color="#67E8B4"
              height="h-1.5"
              className="mb-2"
            />

            <span className="text-[11px] text-[#9B97AC]">Un paso a la vez.</span>
          </div>

          {/* User Profile Footer */}
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[#171426] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#67E8B4] p-[1.5px]">
                <div className="w-full h-full rounded-full bg-[#171426] flex items-center justify-center font-bold text-xs text-[#E8E7F0]">
                  {settings.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'AL'}
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-[#E8E7F0] group-hover:text-white leading-tight">
                  {settings.name || 'Alex López'}
                </span>
                <span className="text-xs text-[#9B97AC] leading-tight">Cuenta personal</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-[#9B97AC] group-hover:text-[#E8E7F0]" />
          </div>
        </div>
      </aside>
    </>
  );
};
