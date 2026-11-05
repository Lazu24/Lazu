import React, { useState } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Calendar as CalendarIcon,
  Edit3,
  CalendarCheck2,
  X,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { GlassCard } from '../components/ui/GlassCard.tsx';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { Modal } from '../components/ui/Modal.tsx';
import { PlanBlock } from '../types/index.ts';

export const PlanningPage: React.FC = () => {
  const {
    planBlocks,
    selectedPlanBlock,
    setSelectedPlanBlock,
    addNewPlanBlock,
    updatePlanBlockById,
    tasks,
    categories,
  } = useApp();

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // New activity form states
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState('JUE 29');
  const [newStartTime, setNewStartTime] = useState('11:00');
  const [newDuration, setNewDuration] = useState(50);
  const [newCategory, setNewCategory] = useState('Trabajo');
  const [linkedTaskId, setLinkedTaskId] = useState<number | undefined>(undefined);

  const days = [
    { key: 'LUN 26', label: 'LUN 26' },
    { key: 'MAR 27', label: 'MAR 27' },
    { key: 'MIÉ 28', label: 'MIÉ 28' },
    { key: 'JUE 29', label: 'JUE 29', isToday: true },
    { key: 'VIE 30', label: 'VIE 30' },
  ];

  const hours = ['08:00', '10:00', '12:00', '14:00', '16:00'];

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    await addNewPlanBlock({
      title: newTitle,
      day: newDay,
      dayDate: '2026-10-29',
      startTime: newStartTime,
      durationMinutes: Number(newDuration),
      categoryName: newCategory,
      taskId: linkedTaskId,
      status: 'pending',
    });

    setIsScheduleOpen(false);
    setNewTitle('');
  };

  const handleSaveEdit = async () => {
    if (!selectedPlanBlock) return;
    await updatePlanBlockById(selectedPlanBlock.id, {
      title: selectedPlanBlock.title,
      startTime: selectedPlanBlock.startTime,
      durationMinutes: selectedPlanBlock.durationMinutes,
    });
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E8E7F0]">
            Dale espacio a tus planes.
          </h1>
          <p className="text-sm text-[#9B97AC] mt-1">
            Organiza tu semana sin llenar cada minuto.
          </p>
        </div>
        <PrimaryButton
          icon={<Plus size={16} />}
          onClick={() => setIsScheduleOpen(true)}
        >
          Programar actividad
        </PrimaryButton>
      </div>

      {/* Filter and Date Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SecondaryButton size="sm">Hoy</SecondaryButton>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg text-[#9B97AC] hover:text-[#E8E7F0] hover:bg-[#171426]">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 rounded-lg text-[#9B97AC] hover:text-[#E8E7F0] hover:bg-[#171426]">
              <ChevronRight size={16} />
            </button>
          </div>
          <span className="text-sm font-semibold text-[#E8E7F0] ml-2">
            26 – 30 de octubre, 2026
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171426] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0]">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
            <span>Todas las categorías</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#171426] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0]">
            Semana laboral ▾
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Calendar & Selected Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Weekly Calendar (3 cols) */}
        <div className="lg:col-span-3">
          <GlassCard className="p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Day Headers */}
              <div className="grid grid-cols-6 border-b border-[rgba(232,231,240,0.08)] pb-3 mb-4 text-center">
                <div className="text-[11px] font-mono text-[#9B97AC] text-left pl-2">
                  GMT+1
                </div>
                {days.map((d) => (
                  <div key={d.key} className="flex flex-col items-center">
                    <span
                      className={`text-xs font-semibold ${
                        d.isToday ? 'text-[#8B5CF6]' : 'text-[#9B97AC]'
                      }`}
                    >
                      {d.label}
                    </span>
                    {d.isToday && (
                      <span className="w-6 h-0.5 bg-[#8B5CF6] rounded-full mt-1"></span>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid Rows for Hours */}
              <div className="space-y-4">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-6 items-start min-h-[72px] border-b border-[rgba(232,231,240,0.04)] pb-4">
                    {/* Time Label */}
                    <div className="font-mono text-xs text-[#9B97AC] pt-1">
                      {hour}
                    </div>

                    {/* Columns for each day */}
                    {days.map((day) => {
                      // Find blocks for this day & approximate hour
                      const blocksForCell = planBlocks.filter((b) => {
                        if (b.day !== day.key) return false;
                        const blockHour = parseInt(b.startTime.split(':')[0], 10);
                        const cellHour = parseInt(hour.split(':')[0], 10);
                        return blockHour >= cellHour && blockHour < cellHour + 2;
                      });

                      return (
                        <div key={day.key} className="px-1.5 min-h-[64px] flex flex-col gap-2">
                          {blocksForCell.map((block) => {
                            const isSelected = selectedPlanBlock?.id === block.id;
                            const isCompleted = block.status === 'completed';

                            return (
                              <div
                                key={block.id}
                                onClick={() => setSelectedPlanBlock(block)}
                                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-[#171426] border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.25)] ring-1 ring-[#8B5CF6]'
                                    : isCompleted
                                    ? 'bg-[#171426]/70 border-[#67E8B4]/30 hover:border-[#67E8B4]/60'
                                    : 'bg-[#171426]/60 border-[rgba(232,231,240,0.08)] hover:border-[#8B5CF6]/40'
                                }`}
                              >
                                <p className="text-[11px] font-semibold text-[#E8E7F0] truncate">
                                  {block.title}
                                </p>
                                <p className="text-[10px] font-mono text-[#9B97AC] mt-0.5">
                                  {block.startTime} · {block.durationMinutes} min {isCompleted && '✓'}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Selected Activity Detail & Unscheduled card */}
        <div className="space-y-6">
          {/* Actividad seleccionada */}
          {selectedPlanBlock ? (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD]">
                  Actividad seleccionada
                </span>
                <button
                  onClick={() => setSelectedPlanBlock(null)}
                  className="p-1 rounded-md text-[#9B97AC] hover:text-[#E8E7F0]"
                >
                  <X size={15} />
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#E8E7F0]">
                  {selectedPlanBlock.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#9B97AC] mt-1.5">
                  <LinkIcon size={13} className="text-[#8B5CF6]" />
                  <span>Tarea vinculada · {selectedPlanBlock.categoryName}</span>
                </div>
              </div>

              {/* Date & Time fields */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] text-[#9B97AC] block">Fecha</span>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.06)] text-xs text-[#E8E7F0]">
                  <CalendarIcon size={14} className="text-[#9B97AC]" />
                  <span>Jueves, 29 de octubre</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-mono text-[#E8E7F0]">
                  {selectedPlanBlock.startTime} – {parseInt(selectedPlanBlock.startTime.split(':')[0], 10)}:50
                </span>
                <StatusBadge status={selectedPlanBlock.status} />
              </div>

              <div className="pt-2 border-t border-[rgba(232,231,240,0.06)]">
                <SecondaryButton
                  fullWidth
                  icon={<Edit3 size={14} />}
                  onClick={() => setIsEditOpen(true)}
                >
                  Editar actividad
                </SecondaryButton>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="text-center py-12 text-xs text-[#9B97AC]">
              Haz clic en cualquier bloque del calendario para ver su detalle.
            </GlassCard>
          )}

          {/* Sin programar */}
          <GlassCard className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#E8E7F0]">Sin programar</span>
              <span className="font-mono text-xs text-[#9B97AC]">
                {tasks.filter((t) => !planBlocks.some((b) => b.taskId === t.id)).length}
              </span>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0A12]/40 border border-[rgba(232,231,240,0.06)]">
              <CalendarCheck2 size={18} className="text-[#67E8B4] shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-[#E8E7F0]">
                  {tasks.filter((t) => !planBlocks.some((b) => b.taskId === t.id)).length === 0
                    ? 'Todas tus tareas ya tienen un lugar en la agenda.'
                    : `Tienes ${tasks.filter((t) => !planBlocks.some((b) => b.taskId === t.id)).length} tareas sin programar.`}
                </p>
                <p className="text-[#9B97AC] mt-1 text-[11px]">
                  Añade o programa una tarea para planificarla aquí.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#9B97AC]">Tu agenda de hoy</span>
            <span className="font-mono text-xl font-bold text-[#E8E7F0]">
              {planBlocks.filter((b) => b.day === 'JUE 29' || b.dayDate === '2026-10-29').reduce((acc, b) => acc + b.durationMinutes, 0)} min
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-[#E8E7F0]">
              {planBlocks.filter((b) => b.day === 'JUE 29' || b.dayDate === '2026-10-29').length} actividades ·{' '}
              {planBlocks.filter((b) => (b.day === 'JUE 29' || b.dayDate === '2026-10-29') && b.status === 'completed').length} completadas ·{' '}
              {planBlocks.filter((b) => (b.day === 'JUE 29' || b.dayDate === '2026-10-29') && b.status !== 'completed').length} por hacer
            </p>
            <p className="text-[11px] text-[#9B97AC]">
              Tiempo planificado; no equivale a tiempo de foco registrado.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <span className="text-xs text-[#9B97AC] mb-2">Deja margen para respirar.</span>
          <p className="text-xs text-[#E8E7F0] leading-relaxed">
            Entre tu presentación y la revisión tienes tiempo libre. Un calendario con espacio también es un buen plan.
          </p>
        </GlassCard>
      </div>

      {/* Schedule Activity Modal */}
      <Modal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        title="Programar nueva actividad"
      >
        <form onSubmit={handleCreateBlock} className="space-y-4">
          <div>
            <label className="block text-xs text-[#9B97AC] mb-1">Título de la actividad</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ej. Revisión de diseño..."
              className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-sm text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#9B97AC] mb-1">Día</label>
              <select
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none"
              >
                {days.map((d) => (
                  <option key={d.key} value={d.key} className="bg-[#171426]">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#9B97AC] mb-1">Hora de inicio</label>
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#9B97AC] mb-1">Duración (min)</label>
              <input
                type="number"
                min="10"
                max="240"
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#9B97AC] mb-1">Categoría</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#171426]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#9B97AC] mb-1">Vincular con tarea existente (opcional)</label>
            <select
              value={linkedTaskId || ''}
              onChange={(e) => setLinkedTaskId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-2.5 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none"
            >
              <option value="" className="bg-[#171426]">Ninguna</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#171426]">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <SecondaryButton type="button" onClick={() => setIsScheduleOpen(false)}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit">
              Guardar en agenda
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* Edit Activity Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar actividad"
      >
        {selectedPlanBlock && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#9B97AC] mb-1">Título</label>
              <input
                type="text"
                value={selectedPlanBlock.title}
                onChange={(e) =>
                  setSelectedPlanBlock({ ...selectedPlanBlock, title: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-sm text-[#E8E7F0] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#9B97AC] mb-1">Hora inicio</label>
                <input
                  type="time"
                  value={selectedPlanBlock.startTime}
                  onChange={(e) =>
                    setSelectedPlanBlock({ ...selectedPlanBlock, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9B97AC] mb-1">Duración (min)</label>
                <input
                  type="number"
                  value={selectedPlanBlock.durationMinutes}
                  onChange={(e) =>
                    setSelectedPlanBlock({
                      ...selectedPlanBlock,
                      durationMinutes: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setIsEditOpen(false)}>
                Cancelar
              </SecondaryButton>
              <PrimaryButton onClick={handleSaveEdit}>
                Guardar cambios
              </PrimaryButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
