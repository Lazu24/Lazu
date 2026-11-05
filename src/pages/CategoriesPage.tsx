import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowUpDown,
  Briefcase,
  Leaf,
  BookOpen,
  Heart,
  Folder,
  Code,
  Lightbulb,
  Edit,
  MoreHorizontal,
  Link as LinkIcon,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { GlassCard } from '../components/ui/GlassCard.tsx';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons.tsx';
import { ProgressBar } from '../components/ui/ProgressBar.tsx';
import { Modal } from '../components/ui/Modal.tsx';
import { Category } from '../types/index.ts';

export const CategoriesPage: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    updateCategoryById,
    deleteCategoryById,
    addNewCategory,
    tasks,
    showToast,
  } = useApp();
  const navigate = useNavigate();

  // Editing form states
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('briefcase');
  const [editDescription, setEditDescription] = useState('');
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);

  // New category form
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('folder');
  const [newColor, setNewColor] = useState('#8B5CF6');
  const [newDescription, setNewDescription] = useState('');

  // Sync edit form with selected category
  useEffect(() => {
    if (selectedCategory) {
      setEditName(selectedCategory.name);
      setEditIcon(selectedCategory.icon || 'briefcase');
      setEditDescription(selectedCategory.description || '');
    }
  }, [selectedCategory]);

  const handleSaveEdit = async () => {
    if (!selectedCategory || !editName.trim()) return;
    await updateCategoryById(selectedCategory.id, {
      name: editName.trim(),
      icon: editIcon,
      description: editDescription.trim(),
    });
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await addNewCategory({
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
      description: newDescription.trim(),
    });
    setIsNewCategoryOpen(false);
    setNewName('');
    setNewDescription('');
  };

  const getCategoryIconComponent = (iconName: string, size = 18) => {
    switch (iconName.toLowerCase()) {
      case 'briefcase':
        return <Briefcase size={size} />;
      case 'leaf':
        return <Leaf size={size} />;
      case 'book-open':
        return <BookOpen size={size} />;
      case 'heart':
        return <Heart size={size} />;
      case 'code':
        return <Code size={size} />;
      case 'lightbulb':
        return <Lightbulb size={size} />;
      case 'edit':
        return <Edit size={size} />;
      default:
        return <Folder size={size} />;
    }
  };

  // Tasks in selected category
  const tasksInSelectedCategory = tasks.filter(
    (t) =>
      t.categoryId === selectedCategory?.id ||
      t.categoryName.toLowerCase() === selectedCategory?.name.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E8E7F0]">
            Un lugar para cada intención.
          </h1>
          <p className="text-sm text-[#9B97AC] mt-1">
            Agrupa tus tareas y encuentra el equilibrio entre tus áreas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SecondaryButton icon={<ArrowUpDown size={15} />}>
            Orden: manual
          </SecondaryButton>
          <PrimaryButton
            icon={<Plus size={16} />}
            onClick={() => setIsNewCategoryOpen(true)}
          >
            Nueva categoría
          </PrimaryButton>
        </div>
      </div>

      <p className="text-xs text-[#9B97AC]">
        {categories.length} categorías · {tasks.length} tareas en tu espacio
      </p>

      {/* Main Grid: 2x2 Category Cards + Edit Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2x2 Categories Grid (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory?.id === cat.id;
            const catTasks = tasks.filter(
              (t) =>
                t.categoryId === cat.id ||
                t.categoryName.toLowerCase() === cat.name.toLowerCase()
            );
            const pending = catTasks.filter((t) => t.status !== 'completed').length;
            const completed = catTasks.filter((t) => t.status === 'completed').length;
            const progress =
              catTasks.length > 0 ? (completed / catTasks.length) * 100 : 0;

            return (
              <GlassCard
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`p-5 flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.18)] bg-[#171426]'
                    : 'hover:border-[rgba(232,231,240,0.16)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
                      {getCategoryIconComponent(cat.icon, 20)}
                    </div>
                    {isSelected ? (
                      <CheckCircle2 size={18} className="text-[#8B5CF6]" />
                    ) : (
                      <button className="text-[#9B97AC] hover:text-[#E8E7F0]">
                        <MoreHorizontal size={18} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-base font-bold text-[#E8E7F0]">{cat.name}</h3>
                    <span className="font-mono text-xl font-bold text-[#9B97AC]">
                      {String(catTasks.length).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#9B97AC] mb-3">
                    {catTasks.length > 0 ? (
                      <>
                        <span>{pending} pendiente{pending !== 1 && 's'}</span>
                        <span className={completed > 0 ? 'text-[#67E8B4]' : ''}>
                          {completed} completada{completed !== 1 && 's'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>Sin tareas actuales</span>
                        <span>Lista para empezar</span>
                      </>
                    )}
                  </div>
                </div>

                <ProgressBar
                  value={progress}
                  max={100}
                  color={completed > 0 ? '#67E8B4' : '#8B5CF6'}
                  height="h-1.5"
                />
              </GlassCard>
            );
          })}
        </div>

        {/* Right: Edit Category Panel */}
        <div>
          {selectedCategory ? (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#E8E7F0]">
                  Editar categoría
                </h3>
                <span className="text-xs text-[#9B97AC]">
                  {selectedCategory.name}
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs text-[#9B97AC] mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-sm text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              {/* Icon selector */}
              <div>
                <label className="block text-xs text-[#9B97AC] mb-1.5">Icono</label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'briefcase', icon: Briefcase },
                    { id: 'folder', icon: Folder },
                    { id: 'code', icon: Code },
                    { id: 'lightbulb', icon: Lightbulb },
                    { id: 'edit', icon: Edit },
                  ].map((item) => {
                    const IconC = item.icon;
                    const isSelected = editIcon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEditIcon(item.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6] text-[#8B5CF6]'
                            : 'bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-[#9B97AC] hover:text-[#E8E7F0]'
                        }`}
                      >
                        <IconC size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-[#9B97AC] mb-1.5">Descripción</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6] resize-none"
                />
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-1.5 text-xs text-[#9B97AC] pt-2 border-t border-[rgba(232,231,240,0.06)]">
                <LinkIcon size={13} className="text-[#8B5CF6]" />
                <span>
                  {tasksInSelectedCategory.length} tarea vinculada · 300 min esta semana
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <PrimaryButton fullWidth onClick={handleSaveEdit}>
                  Guardar cambios
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => {
                    setEditName(selectedCategory.name);
                    setEditDescription(selectedCategory.description);
                  }}
                >
                  Cancelar
                </SecondaryButton>
              </div>

              {/* Delete link */}
              <div className="flex items-center justify-between pt-3 border-t border-[rgba(232,231,240,0.06)] text-xs">
                <span className="text-[#9B97AC]">Las tareas se conservan.</span>
                <button
                  onClick={() => deleteCategoryById(selectedCategory.id)}
                  className="text-[#FDA4AF] hover:text-[#F43F5E] transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="text-center py-10 text-xs text-[#9B97AC]">
              Selecciona una categoría para ver y editar sus detalles.
            </GlassCard>
          )}
        </div>
      </div>

      {/* Bottom Section: Tasks in Selected Category */}
      {selectedCategory && (
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#E8E7F0]">
              En {selectedCategory.name}
            </h3>
            <span className="text-xs text-[#9B97AC]">
              {tasksInSelectedCategory.length} tarea · selección activa
            </span>
          </div>

          <div className="space-y-2">
            {tasksInSelectedCategory.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B0A12]/60 border border-[rgba(232,231,240,0.06)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md border border-[rgba(232,231,240,0.3)] flex items-center justify-center">
                    {task.status === 'completed' && <CheckCircle2 size={13} className="text-[#67E8B4]" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#E8E7F0]">{task.name}</p>
                    <p className="text-[11px] text-[#9B97AC]">
                      {task.scheduledTime || 'Hoy · 10:00'} · {task.status === 'completed' ? 'Completada' : 'Pendiente'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#9B97AC]">
                    {task.estimatedDuration} min
                  </span>
                  <SecondaryButton
                    size="sm"
                    icon={<ExternalLink size={12} />}
                    onClick={() => navigate('/tareas')}
                  >
                    Ver tarea
                  </SecondaryButton>
                </div>
              </div>
            ))}

            {tasksInSelectedCategory.length === 0 && (
              <p className="text-xs text-[#9B97AC] text-center py-4">
                No hay tareas vinculadas a esta categoría.
              </p>
            )}
          </div>
        </GlassCard>
      )}

      {/* New Category Modal */}
      <Modal
        isOpen={isNewCategoryOpen}
        onClose={() => setIsNewCategoryOpen(false)}
        title="Crear nueva categoría"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs text-[#9B97AC] mb-1">Nombre</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. Proyectos, Finanzas..."
              className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-sm text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6]"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[#9B97AC] mb-1">Icono</label>
            <div className="flex items-center gap-2">
              {['folder', 'briefcase', 'leaf', 'book-open', 'heart', 'code', 'lightbulb'].map(
                (ico) => (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setNewIcon(ico)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      newIcon === ico
                        ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6] text-[#8B5CF6]'
                        : 'bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-[#9B97AC]'
                    }`}
                  >
                    {getCategoryIconComponent(ico, 16)}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#9B97AC] mb-1">Color representativo</label>
            <div className="flex items-center gap-2">
              {['#8B5CF6', '#67E8B4', '#38BDF8', '#F43F5E', '#F59E0B'].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setNewColor(col)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    newColor === col ? 'scale-110 border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#9B97AC] mb-1">Descripción</label>
            <textarea
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Propósito de esta categoría..."
              className="w-full px-3 py-2 rounded-xl bg-[#0B0A12] border border-[rgba(232,231,240,0.08)] text-xs text-[#E8E7F0] focus:outline-none focus:border-[#8B5CF6] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <SecondaryButton type="button" onClick={() => setIsNewCategoryOpen(false)}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit">
              Crear categoría
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
