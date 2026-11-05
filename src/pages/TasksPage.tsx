import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Play,
  AlertCircle,
  MoreHorizontal,
  Clock,
  Tag,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { GlassCard } from '../components/ui/GlassCard.tsx';
import { PrimaryButton, SecondaryButton, DangerButton } from '../components/ui/Buttons.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { validFormFieldInput, getValidationErrors, ValidationErrors } from '../utils/validation.ts';
import { Task } from '../types/index.ts';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    categories,
    addNewTask,
    toggleTaskStatus,
    deleteTaskById,
    cleanCompletedTasks,
    selectTaskForFocus,
  } = useApp();
  const navigate = useNavigate();

  // Form states with exact Sprint 1 IDs
  const [newTaskNameInput, setNewTaskNameInput] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-10-29');
  const [newTaskStatus, setNewTaskStatus] = useState('pending');
  const [selectedCategoryName, setSelectedCategoryName] = useState('Personal');
  const [estimatedDuration, setEstimatedDuration] = useState(25);

  // Validation feedback state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null);
  const [showValidationAlert, setShowValidationAlert] = useState<boolean>(false);

  // Field refs for autofocus on first invalid field
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const statusSelectRef = useRef<HTMLSelectElement>(null);

  // Selected task for detail view & task pending deletion
  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks[0] || null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Submit Handler executing validFormFieldInput(data)
  const handleSubmitTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const formData = {
      newTaskNameInput,
      newTaskDescription,
      newTaskDueDate,
      newTaskStatus,
      categoryName: selectedCategoryName,
      estimatedDuration,
    };

    // Mandatory Sprint 1 function execution
    const isValid = validFormFieldInput(formData);

    if (!isValid) {
      const errors = getValidationErrors(formData);
      setValidationErrors(errors);
      setShowValidationAlert(true);

      // Focus on first invalid field
      if (errors.firstInvalidField === 'newTaskNameInput') {
        nameInputRef.current?.focus();
      } else if (errors.firstInvalidField === 'newTaskDescription') {
        descInputRef.current?.focus();
      } else if (errors.firstInvalidField === 'newTaskDueDate') {
        dateInputRef.current?.focus();
      } else if (errors.firstInvalidField === 'newTaskStatus') {
        statusSelectRef.current?.focus();
      }
      return;
    }

    // Caso 3: Formulario válido -> Ocultar alerta, enviar al backend y limpiar
    setShowValidationAlert(false);
    setValidationErrors(null);

    const matchingCategory = categories.find(
      (c) => c.name.toLowerCase() === selectedCategoryName.toLowerCase()
    );

    const result = await addNewTask({
      ...formData,
      categoryId: matchingCategory?.id,
      scheduledTime: 'Hoy · 10:00',
    });

    if (result.success && result.task) {
      setSelectedTask(result.task);
      // Reset form
      setNewTaskNameInput('');
      setNewTaskDescription('');
      setNewTaskDueDate('2026-10-29');
      setNewTaskStatus('pending');
    }
  };

  const handleFocusOnTask = (task: Task) => {
    selectTaskForFocus(task);
    navigate('/concentracion');
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTaskById(taskToDelete.id);
      if (selectedTask?.id === taskToDelete.id) {
        setSelectedTask(tasks.find((t) => t.id !== taskToDelete.id) || null);
      }
      setTaskToDelete(null);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'pending') return t.status === 'pending';
    if (taskFilter === 'completed') return t.status === 'completed';
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E8E7F0]">
            Mis tareas
          </h1>
          <p className="text-sm text-[#9B97AC] mt-1">
            Organiza tus pendientes en un solo lugar.
          </p>
        </div>
        <SecondaryButton
          icon={<CalendarIcon size={16} />}
          onClick={() => navigate('/planificacion')}
        >
          Ver agenda
        </SecondaryButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Add Form & Tasks List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Box: Agregar una tarea */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#E8E7F0]">
                Agregar una tarea
              </h2>
              <span className="text-xs text-[#9B97AC]">Captura y sigue</span>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-3">
              <div>
                <label
                  htmlFor="newTaskNameInput"
                  className="block text-xs font-medium text-[#9B97AC] mb-1.5"
                >
                  Nombre de la tarea
                </label>
                <input
                  id="newTaskNameInput"
                  name="newTaskNameInput"
                  ref={nameInputRef}
                  type="text"
                  value={newTaskNameInput}
                  onChange={(e) => {
                    setNewTaskNameInput(e.target.value);
                    if (validationErrors?.newTaskNameInput && e.target.value.trim().length > 0) {
                      setValidationErrors((prev) => ({ ...prev, newTaskNameInput: undefined }));
                    }
                  }}
                  placeholder="Escribe una nueva tarea..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0B0A12]/80 border text-sm text-[#E8E7F0] placeholder-[#9B97AC] focus:outline-none transition-all ${
                    validationErrors?.newTaskNameInput
                      ? 'border-[#F43F5E] shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                      : 'border-[rgba(232,231,240,0.08)] focus:border-[#8B5CF6]/60'
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="newTaskDescription"
                  className="block text-xs font-medium text-[#9B97AC] mb-1.5"
                >
                  Descripción
                </label>
                <textarea
                  id="newTaskDescription"
                  name="newTaskDescription"
                  ref={descInputRef}
                  rows={2}
                  value={newTaskDescription}
                  onChange={(e) => {
                    setNewTaskDescription(e.target.value);
                    if (validationErrors?.newTaskDescription && e.target.value.trim().length > 0) {
                      setValidationErrors((prev) => ({ ...prev, newTaskDescription: undefined }));
                    }
                  }}
                  placeholder="Describe la tarea o su objetivo..."
                  className={`w-full px-3.5 py-2 rounded-xl bg-[#0B0A12]/80 border text-sm text-[#E8E7F0] placeholder-[#9B97AC] focus:outline-none resize-none transition-all ${
                    validationErrors?.newTaskDescription
                      ? 'border-[#F43F5E] shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                      : 'border-[rgba(232,231,240,0.08)] focus:border-[#8B5CF6]/60'
                  }`}
                />
              </div>

              {/* Sub-row controls: Category, Date, Status, Duration */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {/* Category */}
                <div>
                  <label className="block text-[11px] text-[#9B97AC] mb-1">
                    Categoría
                  </label>
                  <select
                    value={selectedCategoryName}
                    onChange={(e) => setSelectedCategoryName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6]/60 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name} className="bg-[#171426]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date (newTaskDueDate) */}
                <div>
                  <label
                    htmlFor="newTaskDueDate"
                    className="block text-[11px] text-[#9B97AC] mb-1"
                  >
                    Fecha de entrega
                  </label>
                  <input
                    id="newTaskDueDate"
                    name="newTaskDueDate"
                    ref={dateInputRef}
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => {
                      setNewTaskDueDate(e.target.value);
                      if (validationErrors?.newTaskDueDate && e.target.value) {
                        setValidationErrors((prev) => ({ ...prev, newTaskDueDate: undefined }));
                      }
                    }}
                    className={`w-full px-2 py-1 rounded-lg bg-[#0B0A12] border text-xs text-[#E8E7F0] focus:outline-none ${
                      validationErrors?.newTaskDueDate
                        ? 'border-[#F43F5E]'
                        : 'border-[rgba(232,231,240,0.08)] focus:border-[#8B5CF6]/60'
                    }`}
                  />
                </div>

                {/* Status (newTaskStatus) */}
                <div>
                  <label
                    htmlFor="newTaskStatus"
                    className="block text-[11px] text-[#9B97AC] mb-1"
                  >
                    Estado
                  </label>
                  <select
                    id="newTaskStatus"
                    name="newTaskStatus"
                    ref={statusSelectRef}
                    value={newTaskStatus}
                    onChange={(e) => {
                      setNewTaskStatus(e.target.value);
                      if (validationErrors?.newTaskStatus && e.target.value) {
                        setValidationErrors((prev) => ({ ...prev, newTaskStatus: undefined }));
                      }
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg bg-[#0B0A12] border text-xs text-[#E8E7F0] focus:outline-none cursor-pointer ${
                      validationErrors?.newTaskStatus
                        ? 'border-[#F43F5E]'
                        : 'border-[rgba(232,231,240,0.08)] focus:border-[#8B5CF6]/60'
                    }`}
                  >
                    <option value="pending" className="bg-[#171426]">Pendiente</option>
                    <option value="completed" className="bg-[#171426]">Completada</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[11px] text-[#9B97AC] mb-1">
                    Estimación
                  </label>
                  <select
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none cursor-pointer"
                  >
                    <option value={15} className="bg-[#171426]">15 min</option>
                    <option value={25} className="bg-[#171426]">25 min</option>
                    <option value={50} className="bg-[#171426]">50 min</option>
                    <option value={90} className="bg-[#171426]">90 min</option>
                  </select>
                </div>
              </div>

              {/* Action button & hint */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#9B97AC]">
                  ↵ Enter para agregar
                </span>
                <PrimaryButton
                  type="submit"
                  icon={<Plus size={16} />}
                >
                  Agregar tarea
                </PrimaryButton>
              </div>
            </form>
          </GlassCard>

          {/* Validation Alert (Sprint 1 mandatory alert banner) */}
          {showValidationAlert && (
            <div className="p-4 rounded-2xl bg-[#F43F5E]/10 border border-[#F43F5E]/35 text-[#FDA4AF] space-y-1 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 font-semibold text-xs tracking-wide uppercase">
                <AlertCircle size={16} className="text-[#F43F5E] shrink-0" />
                <span>
                  {validationErrors?.summaryMessage?.includes('vacío')
                    ? 'VALIDACIÓN · AL ENVIAR EL CAMPO VACÍO'
                    : 'VALIDACIÓN · CAMPOS INCOMPLETOS'}
                </span>
              </div>
              <p className="text-sm font-medium pl-6">
                {validationErrors?.newTaskNameInput ||
                  validationErrors?.summaryMessage ||
                  'Escribe un nombre para tu tarea.'}
              </p>
              <p className="text-xs text-[#FDA4AF]/80 pl-6">
                El campo se resalta y conserva el foco. No se crea ninguna tarea.
              </p>
            </div>
          )}

          {/* Lista de tareas Card */}
          <GlassCard className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-[#E8E7F0]">
                  Lista de tareas
                </h3>
                <p className="text-xs text-[#9B97AC]">
                  {pendingCount} pendientes · {completedCount} completada
                </p>
              </div>

              {/* Tabs / Filters */}
              <div className="flex items-center p-1 rounded-xl bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.06)]">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    taskFilter === 'all'
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#E8E7F0]'
                      : 'text-[#9B97AC] hover:text-[#E8E7F0]'
                  }`}
                >
                  Todas · {tasks.length}
                </button>
                <button
                  onClick={() => setTaskFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    taskFilter === 'pending'
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#E8E7F0]'
                      : 'text-[#9B97AC] hover:text-[#E8E7F0]'
                  }`}
                >
                  Pendientes · {pendingCount}
                </button>
                <button
                  onClick={() => setTaskFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    taskFilter === 'completed'
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#E8E7F0]'
                      : 'text-[#9B97AC] hover:text-[#E8E7F0]'
                  }`}
                >
                  Completadas · {completedCount}
                </button>
              </div>
            </div>

            {/* Tasks Items */}
            <div className="space-y-2.5">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isSelected = selectedTask?.id === task.id;

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8B5CF6]/60 bg-[#171426] shadow-[0_0_15px_rgba(139,92,246,0.12)]'
                        : isCompleted
                        ? 'bg-[#0B0A12]/30 border-[rgba(232,231,240,0.04)] hover:border-[rgba(232,231,240,0.1)]'
                        : 'bg-[#0B0A12]/60 border-[rgba(232,231,240,0.06)] hover:border-[#8B5CF6]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(task.id);
                        }}
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
                          className={`text-xs font-semibold truncate ${
                            isCompleted ? 'line-through text-[#9B97AC]' : 'text-[#E8E7F0]'
                          }`}
                        >
                          {task.name}
                        </p>
                        <p className="text-[11px] text-[#9B97AC]">
                          {task.categoryName} <span className="font-mono">{task.estimatedDuration} min</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTaskToDelete(task);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#171426] border border-[rgba(232,231,240,0.08)] text-[#9B97AC] hover:text-[#FDA4AF] hover:border-[#F43F5E]/40 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 size={13} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-xs text-[#9B97AC]">
                  No hay tareas en esta vista.
                </div>
              )}
            </div>

            {/* Bottom row: Clean completed & counter */}
            <div className="flex items-center justify-between pt-4 border-t border-[rgba(232,231,240,0.08)] text-xs text-[#9B97AC]">
              <SecondaryButton
                size="sm"
                icon={<Sparkles size={14} />}
                onClick={cleanCompletedTasks}
              >
                Limpiar completadas
              </SecondaryButton>
              <span className="font-mono">{tasks.length} tareas en total</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Task Detail & Delete Confirmation Card */}
        <div className="space-y-6">
          {/* Detalle de la tarea Card */}
          {selectedTask ? (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#9B97AC]">
                  Detalle de la tarea
                </span>
                <button className="text-[#9B97AC] hover:text-[#E8E7F0]">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div>
                <StatusBadge status={selectedTask.status} />
                <h3 className="text-lg font-bold text-[#E8E7F0] mt-2">
                  {selectedTask.name}
                </h3>
                <p className="text-xs text-[#9B97AC] mt-1 leading-relaxed">
                  {selectedTask.description || 'Sin descripción adicional.'}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[rgba(232,231,240,0.06)] text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#9B97AC]">Categoría</span>
                  <span className="text-[#E8E7F0] font-medium">{selectedTask.categoryName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9B97AC]">Programada</span>
                  <span className="font-mono text-[#E8E7F0]">{selectedTask.scheduledTime || 'Hoy · 10:00'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9B97AC]">Estimación</span>
                  <span className="font-mono text-[#E8E7F0]">{selectedTask.estimatedDuration} min</span>
                </div>
              </div>

              <div className="pt-2">
                <PrimaryButton
                  fullWidth
                  icon={<Play size={15} fill="currentColor" />}
                  onClick={() => handleFocusOnTask(selectedTask)}
                >
                  Concentrarme en esto
                </PrimaryButton>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="text-center py-10 text-xs text-[#9B97AC]">
              Selecciona una tarea para ver sus detalles.
            </GlassCard>
          )}

          {/* Confirmación de eliminación Card (Shown in mockup D) */}
          <GlassCard className="space-y-4 border-[#F43F5E]/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FDA4AF] tracking-wide uppercase">
              <Trash2 size={16} className="text-[#F43F5E]" />
              <span>Confirmación de eliminación</span>
            </div>

            <div>
              <h4 className="text-base font-bold text-[#E8E7F0]">
                ¿Eliminar esta tarea?
              </h4>

              <div className="my-3 p-3 rounded-xl bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.06)]">
                <p className="text-xs font-medium text-[#E8E7F0]">
                  {taskToDelete ? taskToDelete.name : 'Organizar la semana'}
                </p>
              </div>

              <p className="text-xs text-[#9B97AC] leading-relaxed">
                Se quitará de tu lista y de la planificación. Las sesiones registradas se conservan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <SecondaryButton
                size="sm"
                onClick={() => setTaskToDelete(null)}
              >
                Cancelar
              </SecondaryButton>
              <DangerButton
                size="sm"
                onClick={handleConfirmDelete}
                disabled={!taskToDelete}
              >
                Eliminar
              </DangerButton>
            </div>

            <span className="text-[11px] text-[#9B97AC] block text-center pt-1">
              Vista de estado: la tarea sigue en la lista hasta confirmar.
            </span>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
