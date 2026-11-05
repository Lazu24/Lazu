import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ListTodo,
  Timer,
  Target,
  Flame,
  Sparkles,
  ArrowUpRight,
  Laptop,
  Check,
  Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { GlassCard } from '../components/ui/GlassCard.tsx';
import { PrimaryButton } from '../components/ui/Buttons.tsx';

export const DashboardPage: React.FC = () => {
  const {
    tasks,
    planBlocks,
    focusSessions,
    settings,
    todayFocusMinutes,
    pendingTasksCount,
    toggleTaskStatus,
    activeFocusTask,
    selectTaskForFocus,
  } = useApp();
  const navigate = useNavigate();

  const completedToday = tasks.filter((t) => t.status === 'completed').length;
  const goalPercentage = Math.min(
    Math.round((todayFocusMinutes / settings.dailyGoalMinutes) * 100),
    100
  );
  const minutesToGoal = Math.max(settings.dailyGoalMinutes - todayFocusMinutes, 0);

  const nextTask = activeFocusTask || tasks.find((t) => t.status === 'pending') || tasks[0];

  const handleStartFocus = (task = nextTask) => {
    if (task) {
      selectTaskForFocus(task);
    }
    navigate('/concentracion');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E8E7F0]">
            Tu día, con intención.
          </h1>
          <p className="text-sm text-[#9B97AC] mt-1">
            Buenos días, {settings.name.split(' ')[0] || 'Alex'}. Tienes espacio para lo que importa.
          </p>
        </div>
        <PrimaryButton
          icon={<Plus size={16} />}
          onClick={() => navigate('/tareas')}
        >
          Nueva tarea
        </PrimaryButton>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9B97AC] mb-2">
            <span className="text-xs font-medium">Tareas pendientes</span>
            <ListTodo size={18} className="text-[#8B5CF6]" />
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-[#E8E7F0] tracking-tight">
              {String(pendingTasksCount).padStart(2, '0')}
            </div>
            <p className="text-xs text-[#9B97AC] mt-2">
              {completedToday} {completedToday === 1 ? 'tarea completada hoy' : 'tareas completadas hoy'}
            </p>
          </div>
        </GlassCard>

        {/* KPI 2 */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9B97AC] mb-2">
            <span className="text-xs font-medium">Tiempo de concentración</span>
            <Timer size={18} className="text-[#8B5CF6]" />
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-[#E8E7F0] tracking-tight">
              {todayFocusMinutes} <span className="text-xl font-normal">min</span>
            </div>
            <p className="text-xs text-[#9B97AC] mt-2">3 sesiones finalizadas hoy</p>
          </div>
        </GlassCard>

        {/* KPI 3 */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9B97AC] mb-2">
            <span className="text-xs font-medium">Meta diaria</span>
            <Target size={18} className="text-[#8B5CF6]" />
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-[#E8E7F0] tracking-tight">
              {goalPercentage}%
            </div>
            <p className="text-xs text-[#9B97AC] mt-2">
              {minutesToGoal > 0 ? `${minutesToGoal} min para llegar a tu objetivo` : '¡Objetivo diario alcanzado!'}
            </p>
          </div>
        </GlassCard>

        {/* KPI 4 */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9B97AC] mb-2">
            <span className="text-xs font-medium">Días de constancia</span>
            <Flame size={18} className="text-[#8B5CF6]" />
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-[#E8E7F0] tracking-tight">
              04
            </div>
            <p className="text-xs text-[#9B97AC] mt-2">Tu ritmo, de lunes a jueves</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Row: Tu siguiente paso & Tus tareas de hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tu siguiente paso */}
        <GlassCard className="flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider text-[#A78BFA] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2.5 py-1 rounded-full uppercase">
                Tu siguiente paso
              </span>
              <Sparkles size={16} className="text-[#8B5CF6]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#E8E7F0] tracking-tight">
                Una cosa a la vez.
              </h2>
              <p className="text-xs text-[#9B97AC] mt-1">
                Dale toda tu atención a tu próxima prioridad.
              </p>
            </div>

            {nextTask ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0B0A12]/40 border border-[rgba(232,231,240,0.06)]">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shrink-0">
                  <Laptop size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-[#E8E7F0] truncate">
                    {nextTask.name}
                  </h4>
                  <p className="text-xs text-[#9B97AC]">
                    {nextTask.categoryName} · {Math.max(Math.round((nextTask.estimatedDuration || 25) / 25), 1)} sesiones estimadas
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0B0A12]/30 border border-[rgba(232,231,240,0.06)]">
                <div className="w-10 h-10 rounded-xl bg-[#67E8B4]/15 border border-[#67E8B4]/30 flex items-center justify-center text-[#67E8B4] shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-[#E8E7F0]">
                    Sin tareas pendientes
                  </h4>
                  <p className="text-xs text-[#9B97AC]">
                    Crea tu primera tarea para iniciar tu sesión de foco.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-[rgba(232,231,240,0.08)]">
            <PrimaryButton
              icon={<Play size={15} fill="currentColor" />}
              onClick={() => handleStartFocus(nextTask)}
            >
              Iniciar foco
            </PrimaryButton>
            <span className="font-mono text-xs text-[#9B97AC]">25:00 min</span>
          </div>
        </GlassCard>

        {/* Tus tareas de hoy */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#E8E7F0]">Tus tareas de hoy</h3>
              <button
                onClick={() => navigate('/tareas')}
                className="text-xs text-[#9B97AC] hover:text-[#67E8B4] flex items-center gap-1 transition-colors"
              >
                <span>Ver todas</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.length > 0 ? (
                tasks.slice(0, 3).map((task) => {
                  const isCompleted = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isCompleted
                          ? 'bg-[#0B0A12]/30 border-[rgba(232,231,240,0.04)] text-[#9B97AC]'
                          : 'bg-[#0B0A12]/60 border-[rgba(232,231,240,0.06)] hover:border-[#8B5CF6]/30 text-[#E8E7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isCompleted
                              ? 'bg-[#67E8B4] text-[#0B0A12]'
                              : 'border border-[rgba(232,231,240,0.3)] hover:border-[#67E8B4]'
                          }`}
                        >
                          {isCompleted && <Check size={13} strokeWidth={3} />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-medium truncate ${
                              isCompleted ? 'line-through text-[#9B97AC]' : 'text-[#E8E7F0]'
                            }`}
                          >
                            {task.name}
                          </p>
                          <p className="text-[11px] text-[#9B97AC]">
                            {task.categoryName} {task.estimatedDuration} min
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isCompleted ? (
                          <span className="text-[11px] font-medium text-[#67E8B4]">
                            Completada
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-[#9B97AC]">
                            {task.scheduledTime || 'Hoy · 10:00'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-[#9B97AC]">
                  No tienes tareas para hoy. ¡Tu día está despejado!
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Row: En tu agenda & Pequeños pasos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* En tu agenda */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#E8E7F0]">En tu agenda</h3>
            <span className="text-xs text-[#9B97AC]">Hoy</span>
          </div>

          <div className="space-y-3">
            {planBlocks.filter((b) => b.day === 'JUE 29' || b.dayDate === '2026-10-29').length > 0 ? (
              planBlocks
                .filter((b) => b.day === 'JUE 29' || b.dayDate === '2026-10-29')
                .slice(0, 3)
                .map((block, idx) => (
                  <div
                    key={block.id}
                    className={`flex items-center gap-3 p-3 rounded-xl bg-[#0B0A12]/40 border-l-2 ${
                      idx % 2 === 0 ? 'border-l-[#8B5CF6]' : 'border-l-[#67E8B4]'
                    } border-y border-r border-[rgba(232,231,240,0.06)]`}
                  >
                    <span className="font-mono text-xs text-[#9B97AC] shrink-0">{block.startTime}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#E8E7F0]">{block.title}</p>
                      <p className="text-[11px] text-[#9B97AC]">
                        {block.categoryName} · {block.durationMinutes} min
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-6 text-xs text-[#9B97AC]">
                Sin actividades en tu agenda para hoy.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Pequeños pasos, progreso real */}
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#E8E7F0]">
              Pequeños pasos, progreso real
            </h3>
            <span className="text-xs text-[#9B97AC]">Esta semana</span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <div className="font-mono text-2xl md:text-3xl font-bold text-[#E8E7F0]">
              7 <span className="text-sm font-normal text-[#9B97AC]">h</span> 30 <span className="text-sm font-normal text-[#9B97AC]">m</span>
            </div>
          </div>
          <p className="text-xs text-[#9B97AC] mb-3">de concentración acumulada</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA] mb-5">
            4 días con foco
          </span>

          {/* Weekly Histogram Bars */}
          <div className="flex items-end justify-between gap-2 pt-4 border-t border-[rgba(232,231,240,0.08)]">
            {[
              { day: 'L', mins: 90, height: 'h-14', active: false },
              { day: 'M', mins: 120, height: 'h-20', active: false },
              { day: 'X', mins: 165, height: 'h-28', active: false },
              { day: 'J', mins: 75, height: 'h-12', active: true },
              { day: 'V', mins: 0, height: 'h-1', active: false },
              { day: 'S', mins: 0, height: 'h-1', active: false },
              { day: 'D', mins: 0, height: 'h-1', active: false },
            ].map((col) => (
              <div key={col.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-28">
                  {col.mins > 0 ? (
                    <div
                      className={`w-full max-w-[34px] rounded-t-lg transition-all ${
                        col.active
                          ? 'bg-[#67E8B4] shadow-[0_0_12px_rgba(103,232,180,0.3)]'
                          : 'bg-[#8B5CF6]/40 hover:bg-[#8B5CF6]/60'
                      } ${col.height}`}
                    />
                  ) : (
                    <div className="w-4 h-[2px] bg-[#9B97AC]/30 rounded-full" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-mono ${
                    col.active ? 'text-[#67E8B4] font-bold' : 'text-[#9B97AC]'
                  }`}
                >
                  {col.day}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
