import React, { useState } from 'react';
import {
  Download,
  Timer,
  CheckCircle2,
  ListTodo,
  Hourglass,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { GlassCard } from '../components/ui/GlassCard.tsx';
import { SecondaryButton } from '../components/ui/Buttons.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';

export const StatisticsPage: React.FC = () => {
  const { focusSessions, tasks, showToast } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'custom'>('week');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleExportCSV = () => {
    window.location.href = '/api/export-csv';
    showToast('Descargando reporte CSV de concentración...');
  };

  const totalMins = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const avgDuration = focusSessions.length > 0 ? Math.round(totalMins / focusSessions.length) : 0;
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;

  const dailyData = [
    { day: 'Lun 26', mins: 0, heightPct: 0, active: false },
    { day: 'Mar 27', mins: 0, heightPct: 0, active: false },
    { day: 'Mié 28', mins: 0, heightPct: 0, active: false },
    { day: 'Jue 29', mins: totalMins, heightPct: Math.min((totalMins / 180) * 100, 100), active: true },
    { day: 'Vie 30', mins: 0, heightPct: 0, active: false },
    { day: 'Sáb 31', mins: 0, heightPct: 0, active: false },
    { day: 'Dom 1', mins: 0, heightPct: 0, active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E8E7F0]">
            Haz visible tu progreso.
          </h1>
          <p className="text-sm text-[#9B97AC] mt-1">
            Observa tus hábitos, no solo tus pendientes.
          </p>
        </div>
        <SecondaryButton
          icon={<Download size={16} />}
          onClick={handleExportCSV}
        >
          Exportar informe
        </SecondaryButton>
      </div>

      {/* Filter and Date Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs: Esta semana, Este mes, Personalizado */}
        <div className="flex items-center p-1 rounded-xl bg-[#171426] border border-[rgba(232,231,240,0.08)]">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeRange === 'week'
                ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#E8E7F0]'
                : 'text-[#9B97AC] hover:text-[#E8E7F0]'
            }`}
          >
            Esta semana
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeRange === 'month'
                ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#E8E7F0]'
                : 'text-[#9B97AC] hover:text-[#E8E7F0]'
            }`}
          >
            Este mes
          </button>
          <button
            onClick={() => setTimeRange('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeRange === 'custom'
                ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#E8E7F0]'
                : 'text-[#9B97AC] hover:text-[#E8E7F0]'
            }`}
          >
            Personalizado
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#9B97AC]">
            26 oct – 1 nov, 2026
          </span>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#171426] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#171426]">Categoría: todas ▾</option>
            <option value="Trabajo" className="bg-[#171426]">Trabajo</option>
            <option value="Personal" className="bg-[#171426]">Personal</option>
            <option value="Aprendizaje" className="bg-[#171426]">Aprendizaje</option>
            <option value="Salud" className="bg-[#171426]">Salud</option>
          </select>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9B97AC] mb-2">
            <span className="text-xs font-medium">Tiempo de foco</span>
            <Timer size={18} className="text-[#8B5CF6]" />
          </div>
          <div>
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#E8E7F0]">
              {hours} <span className="text-sm font-normal text-[#9B97AC]">h</span> {String(mins).padStart(2, '0')} <span className="text-sm font-normal text-[#9B97AC]">m</span>
            </div>
            <p className="text-xs text-[#9B97AC] mt-1.5">{totalMins} minutos registrados</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9B97AC] mb-2">
            <span className="text-xs font-medium">Sesiones finalizadas</span>
            <CheckCircle2 size={18} className="text-[#8B5CF6]" />
          </div>
          <div>
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#E8E7F0]">
              {focusSessions.length}
            </div>
            <p className="text-xs text-[#9B97AC] mt-1.5">{focusSessions.length} completadas</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9B97AC] mb-2">
            <span className="text-xs font-medium">Tareas completadas</span>
            <ListTodo size={18} className="text-[#8B5CF6]" />
          </div>
          <div>
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#E8E7F0]">
              {completedTasksCount}
            </div>
            <p className="text-xs text-[#9B97AC] mt-1.5">{completedTasksCount} de tu lista actual</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9B97AC] mb-2">
            <span className="text-xs font-medium">Duración media</span>
            <Hourglass size={18} className="text-[#8B5CF6]" />
          </div>
          <div>
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#E8E7F0]">
              {avgDuration} <span className="text-sm font-normal text-[#9B97AC]">min</span>
            </div>
            <p className="text-xs text-[#9B97AC] mt-1.5">Por sesión finalizada</p>
          </div>
        </GlassCard>
      </div>

      {/* Middle Row: Concentration by Day Chart & Category Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concentration per day chart (2 cols) */}
        <div className="lg:col-span-2">
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#E8E7F0]">Concentración por día</h3>
              <span className="text-xs text-[#9B97AC]">Minutos de foco</span>
            </div>

            {/* Chart Area with target gridline */}
            <div className="relative pt-6 pb-2">
              {/* Target Line at 120 mins */}
              <div className="absolute top-[35%] left-0 right-0 border-b border-[rgba(103,232,180,0.25)] flex items-center justify-start pointer-events-none">
                <span className="text-[10px] font-mono text-[#67E8B4]/70 -top-4 relative">
                  Meta 120m
                </span>
              </div>

              {/* Bars */}
              <div className="flex items-end justify-between gap-3 h-44 px-2">
                {dailyData.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-mono text-[#9B97AC]">
                      {d.mins > 0 ? d.mins : '-'}
                    </span>
                    <div className="w-full flex items-end justify-center h-32">
                      {d.mins > 0 ? (
                        <div
                          className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                            d.active
                              ? 'bg-[#67E8B4] shadow-[0_0_15px_rgba(103,232,180,0.35)]'
                              : 'bg-[#8B5CF6]/50 hover:bg-[#8B5CF6]/70'
                          }`}
                          style={{ height: `${d.heightPct}%` }}
                        />
                      ) : (
                        <div className="w-6 h-[2px] bg-[#9B97AC]/30 rounded-full" />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-mono mt-1 ${
                        d.active ? 'text-[#67E8B4] font-bold' : 'text-[#9B97AC]'
                      }`}
                    >
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Foco por categoría (Donut Chart) */}
        <div>
          <GlassCard className="flex flex-col justify-between h-full space-y-4">
            <h3 className="text-sm font-semibold text-[#E8E7F0]">Foco por categoría</h3>

            {/* Donut SVG Ring */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Background */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(232, 231, 240, 0.08)"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Trabajo: 300 / 450 = 66.7% -> dasharray 251.2 * 0.667 = 167.5 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#8B5CF6"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="83.7"
                    fill="none"
                  />
                  {/* Personal: 100 / 450 = 22.2% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#67E8B4"
                    strokeWidth="12"
                    strokeDasharray="55.8 251.2"
                    strokeDashoffset="-167.5"
                    fill="none"
                  />
                  {/* Aprendizaje: 50 / 450 = 11.1% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#38BDF8"
                    strokeWidth="12"
                    strokeDasharray="27.9 251.2"
                    strokeDashoffset="-223.3"
                    fill="none"
                  />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-2xl font-bold text-[#E8E7F0]">450</span>
                  <span className="text-[10px] text-[#9B97AC]">minutos</span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                    <span className="text-[#9B97AC]">Trabajo</span>
                  </div>
                  <span className="font-mono text-[#E8E7F0]">300 m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#67E8B4]" />
                    <span className="text-[#9B97AC]">Personal</span>
                  </div>
                  <span className="font-mono text-[#E8E7F0]">100 m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                    <span className="text-[#9B97AC]">Aprendizaje</span>
                  </div>
                  <span className="font-mono text-[#E8E7F0]">50 m</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#9B97AC] text-center pt-2 border-t border-[rgba(232,231,240,0.06)]">
              Las categorías incluyen actividad histórica.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Bottom Table Card: Últimas sesiones */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#E8E7F0]">Últimas sesiones</h3>
          <span className="text-xs text-[#9B97AC]">
            {focusSessions.length > 0 ? `Hoy · ${focusSessions.length} finalizadas` : 'Sin sesiones registradas'}
          </span>
        </div>

        {focusSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[rgba(232,231,240,0.08)] text-[#9B97AC] font-mono uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Inicio</th>
                  <th className="pb-3">Tarea</th>
                  <th className="pb-3">Categoría</th>
                  <th className="pb-3">Duración</th>
                  <th className="pb-3 text-right pr-2">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(232,231,240,0.04)]">
                {focusSessions.slice(0, 5).map((sess) => (
                  <tr key={sess.id} className="hover:bg-[#0B0A12]/40 transition-colors">
                    <td className="py-3.5 pl-2 font-mono text-[#9B97AC]">{sess.startTime}</td>
                    <td className="py-3.5 font-medium text-[#E8E7F0]">{sess.taskName}</td>
                    <td className="py-3.5 text-[#9B97AC]">{sess.categoryName}</td>
                    <td className="py-3.5 font-mono text-[#E8E7F0]">{sess.durationMinutes} min</td>
                    <td className="py-3.5 text-right pr-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#67E8B4]/15 border border-[#67E8B4]/30 text-[#67E8B4]">
                        Finalizada
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#9B97AC]">
            No hay sesiones registradas en este período. ¡Inicia una sesión en Concentración para comenzar!
          </div>
        )}
      </GlassCard>
    </div>
  );
};
