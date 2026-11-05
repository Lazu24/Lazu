import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Task, Category, FocusSession, PlanBlock, UserSettings, TaskFormData } from '../types/index.ts';
import { taskService, categoryService, focusService, planService, userService } from '../services/api.ts';
import { validFormFieldInput, getValidationErrors } from '../utils/validation.ts';

interface AppContextType {
  // Entities
  tasks: Task[];
  categories: Category[];
  focusSessions: FocusSession[];
  planBlocks: PlanBlock[];
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;

  // Selected entities
  activeFocusTask: Task | null;
  selectedCategory: Category | null;
  selectedPlanBlock: PlanBlock | null;
  setSelectedCategory: (cat: Category | null) => void;
  setSelectedPlanBlock: (block: PlanBlock | null) => void;

  // Timer & Focus Mode
  timerMode: 'focus' | 'shortBreak' | 'longBreak';
  timeLeft: number;
  totalDuration: number;
  isTimerRunning: boolean;
  isTimerPaused: boolean;
  currentSessionNumber: number;
  setTimerMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  finishFocusSession: () => Promise<void>;
  selectTaskForFocus: (task: Task) => void;

  // Sound
  isAmbientSoundPlaying: boolean;
  toggleAmbientSound: () => void;
  setAmbientVolume: (vol: number) => void;

  // Task actions (with Sprint 1 validation)
  addNewTask: (data: TaskFormData & { categoryId?: number; categoryName?: string; estimatedDuration?: number; scheduledTime?: string }) => Promise<{ success: boolean; error?: string; errors?: any; task?: Task }>;
  toggleTaskStatus: (id: number) => Promise<void>;
  deleteTaskById: (id: number) => Promise<void>;
  cleanCompletedTasks: () => Promise<void>;

  // Category actions
  addNewCategory: (data: { name: string; icon?: string; color?: string; description?: string }) => Promise<void>;
  updateCategoryById: (id: number, data: Partial<Category>) => Promise<void>;
  deleteCategoryById: (id: number) => Promise<void>;

  // Plan actions
  addNewPlanBlock: (data: any) => Promise<void>;
  updatePlanBlockById: (id: number, data: Partial<PlanBlock>) => Promise<void>;
  deletePlanBlockById: (id: number) => Promise<void>;

  // Settings actions
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;

  // Modals & Navigation
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isScheduleModalOpen: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Calculations
  todayFocusMinutes: number;
  pendingTasksCount: number;
  completedTasksCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_SETTINGS: UserSettings = {
  userId: 'default_user',
  name: 'Alex López',
  email: 'alex@ejemplo.com',
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: false,
  notifySessionEnd: true,
  ambientSound: 'Lluvia suave',
  ambientVolume: 60,
  dailyGoalMinutes: 120,
  theme: 'Neo Glass Dark',
  language: 'es-ES',
  timezone: 'Madrid · GMT+1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [planBlocks, setPlanBlocks] = useState<PlanBlock[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedPlanBlock, setSelectedPlanBlock] = useState<PlanBlock | null>(null);

  // Timer states
  const [timerMode, setTimerModeState] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(18 * 60 + 42); // 18:42 matches mockup!
  const [totalDuration, setTotalDuration] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(true);
  const [currentSessionNumber, setCurrentSessionNumber] = useState<number>(4);

  // Modals and notifications
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio simulation state
  const [isAmbientSoundPlaying, setIsAmbientSoundPlaying] = useState<boolean>(false);
  const [ambientAudioContext, setAmbientAudioContext] = useState<AudioContext | null>(null);
  const [ambientGainNode, setAmbientGainNode] = useState<GainNode | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Initial data loading from Cloud SQL backend
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedTasks, fetchedCategories, fetchedSessions, fetchedBlocks, fetchedSettings] =
        await Promise.allSettled([
          taskService.getAll(),
          categoryService.getAll(),
          focusService.getAll(),
          planService.getAll(),
          userService.getSettings(),
        ]);

      if (fetchedTasks.status === 'fulfilled') {
        setTasks(fetchedTasks.value);
        // Find default active focus task ("Preparar la presentación")
        const active = fetchedTasks.value.find((t) => t.id === 1) || fetchedTasks.value[0] || null;
        setActiveFocusTask(active);
      }
      if (fetchedCategories.status === 'fulfilled') {
        setCategories(fetchedCategories.value);
        setSelectedCategory(fetchedCategories.value[0] || null);
      }
      if (fetchedSessions.status === 'fulfilled') {
        setFocusSessions(fetchedSessions.value);
      }
      if (fetchedBlocks.status === 'fulfilled') {
        setPlanBlocks(fetchedBlocks.value);
        // Find default selected block (JUE 29 10:00 "Preparar la presentación")
        const activeBlock = fetchedBlocks.value.find((b) => b.day === 'JUE 29' && b.startTime === '10:00') || fetchedBlocks.value[0] || null;
        setSelectedPlanBlock(activeBlock);
      }
      if (fetchedSettings.status === 'fulfilled') {
        setSettings(fetchedSettings.value);
        setTotalDuration(fetchedSettings.value.focusDuration * 60);
      }
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setError('No se pudo conectar con la base de datos PostgreSQL.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Keyboard shortcut Cmd+K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        // Space to toggle pause/resume when in Focus mode
        // Handled directly if on focus view or globally
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isTimerPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setIsTimerRunning(false);
            showToast('¡Sesión finalizada!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isTimerPaused, timeLeft, showToast]);

  const setTimerMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setTimerModeState(mode);
    setIsTimerRunning(false);
    setIsTimerPaused(true);
    let minutes = settings.focusDuration;
    if (mode === 'shortBreak') minutes = settings.shortBreak;
    if (mode === 'longBreak') minutes = settings.longBreak;
    setTotalDuration(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setIsTimerPaused(false);
  };

  const pauseTimer = () => {
    setIsTimerPaused(true);
  };

  const resumeTimer = () => {
    setIsTimerPaused(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setIsTimerPaused(true);
    let minutes = settings.focusDuration;
    if (timerMode === 'shortBreak') minutes = settings.shortBreak;
    if (timerMode === 'longBreak') minutes = settings.longBreak;
    setTimeLeft(minutes * 60);
  };

  const finishFocusSession = async () => {
    const durationMins = Math.round((totalDuration - timeLeft) / 60) || 25;
    const taskName = activeFocusTask ? activeFocusTask.name : 'Concentración general';
    const catName = activeFocusTask ? activeFocusTask.categoryName : 'Trabajo';

    try {
      const recorded = await focusService.record({
        taskId: activeFocusTask?.id,
        taskName,
        categoryName: catName,
        durationMinutes: durationMins,
        startTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        dayOfWeek: 'J',
        date: '2026-10-29',
        status: 'completed',
      });
      setFocusSessions((prev) => [recorded, ...prev]);
      setCurrentSessionNumber((prev) => prev + 1);
      showToast('Sesión de concentración guardada');
      resetTimer();
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  const selectTaskForFocus = (task: Task) => {
    setActiveFocusTask(task);
    setTimerMode('focus');
    showToast(`Enfocado en: "${task.name}"`);
  };

  // Ambient sound generation using Web Audio API (white/pink noise simulating rain)
  const toggleAmbientSound = () => {
    try {
      if (isAmbientSoundPlaying) {
        if (ambientGainNode) {
          ambientGainNode.gain.setValueAtTime(0, ambientAudioContext?.currentTime || 0);
        }
        setIsAmbientSoundPlaying(false);
      } else {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = ambientAudioContext || new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Buffer for soft rain pink noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gain = ctx.createGain();
        const vol = (settings.ambientVolume / 100) * 0.15;
        gain.gain.setValueAtTime(vol, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(0);

        setAmbientAudioContext(ctx);
        setAmbientGainNode(gain);
        setIsAmbientSoundPlaying(true);
      }
    } catch (e) {
      console.warn('Web Audio not allowed or failed:', e);
      setIsAmbientSoundPlaying((prev) => !prev);
    }
  };

  const setAmbientVolume = (vol: number) => {
    setSettings((prev) => ({ ...prev, ambientVolume: vol }));
    if (ambientGainNode && ambientAudioContext) {
      ambientGainNode.gain.setValueAtTime((vol / 100) * 0.15, ambientAudioContext.currentTime);
    }
  };

  // Sprint 1 Mandatory Validation and Task Creation
  const addNewTask = async (formData: TaskFormData & { categoryId?: number; categoryName?: string; estimatedDuration?: number; scheduledTime?: string }) => {
    // 1. Mandatory function call
    const isValid = validFormFieldInput(formData);
    if (!isValid) {
      const errors = getValidationErrors(formData);
      return {
        success: false,
        error: errors.summaryMessage || 'Validación fallida: campos incompletos',
        errors,
      };
    }

    try {
      const created = await taskService.create(formData);
      setTasks((prev) => [created, ...prev]);
      showToast(`Tarea "${created.name}" creada exitosamente.`);
      return { success: true, task: created };
    } catch (err: any) {
      console.error('Error saving task to PostgreSQL:', err);
      return { success: false, error: err.message || 'Error al guardar la tarea' };
    }
  };

  const toggleTaskStatus = async (id: number) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const newStatus = target.status === 'completed' ? 'pending' : 'completed';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.update(id, { status: newStatus });
      showToast(`Tarea marcada como ${newStatus === 'completed' ? 'completada' : 'pendiente'}`);
    } catch (err) {
      console.error('Error updating task status:', err);
      // Revert if error
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: target.status } : t))
      );
    }
  };

  const deleteTaskById = async (id: number) => {
    const target = tasks.find((t) => t.id === id);
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (activeFocusTask?.id === id) {
        setActiveFocusTask(tasks.find((t) => t.id !== id) || null);
      }
      showToast(`Tarea eliminada.`);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const cleanCompletedTasks = async () => {
    try {
      const count = await taskService.cleanupCompleted();
      setTasks((prev) => prev.filter((t) => t.status !== 'completed'));
      showToast(`${count} tareas completadas eliminadas.`);
    } catch (err) {
      console.error('Error cleaning completed tasks:', err);
    }
  };

  // Category actions
  const addNewCategory = async (data: { name: string; icon?: string; color?: string; description?: string }) => {
    const created = await categoryService.create(data);
    setCategories((prev) => [...prev, created]);
    showToast(`Categoría "${created.name}" agregada.`);
  };

  const updateCategoryById = async (id: number, data: Partial<Category>) => {
    const updated = await categoryService.update(id, data);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    showToast('Categoría actualizada con éxito.');
  };

  const deleteCategoryById = async (id: number) => {
    await categoryService.delete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (selectedCategory?.id === id) {
      setSelectedCategory(categories.find((c) => c.id !== id) || null);
    }
    showToast('Categoría eliminada.');
  };

  // Plan actions
  const addNewPlanBlock = async (data: any) => {
    const created = await planService.create(data);
    setPlanBlocks((prev) => [...prev, created]);
    showToast(`Actividad programada.`);
  };

  const updatePlanBlockById = async (id: number, data: Partial<PlanBlock>) => {
    const updated = await planService.update(id, data);
    setPlanBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    showToast('Actividad reprogramada.');
  };

  const deletePlanBlockById = async (id: number) => {
    await planService.delete(id);
    setPlanBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedPlanBlock?.id === id) {
      setSelectedPlanBlock(null);
    }
    showToast('Actividad eliminada de la agenda.');
  };

  // Settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = await userService.updateSettings(newSettings);
    setSettings(updated);
    showToast('Preferencias guardadas exitosamente.');
  };

  // Derived metrics
  const todayFocusMinutes = useMemo(() => {
    const todaySessions = focusSessions.filter((s) => s.date === '2026-10-29' || s.dayOfWeek === 'J');
    return todaySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  }, [focusSessions]);

  const pendingTasksCount = useMemo(() => {
    return tasks.filter((t) => t.status === 'pending').length;
  }, [tasks]);

  const completedTasksCount = useMemo(() => {
    return tasks.filter((t) => t.status === 'completed').length;
  }, [tasks]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        categories,
        focusSessions,
        planBlocks,
        settings,
        isLoading,
        error,

        activeFocusTask,
        selectedCategory,
        selectedPlanBlock,
        setSelectedCategory,
        setSelectedPlanBlock,

        timerMode,
        timeLeft,
        totalDuration,
        isTimerRunning,
        isTimerPaused,
        currentSessionNumber,
        setTimerMode,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        finishFocusSession,
        selectTaskForFocus,

        isAmbientSoundPlaying,
        toggleAmbientSound,
        setAmbientVolume,

        addNewTask,
        toggleTaskStatus,
        deleteTaskById,
        cleanCompletedTasks,

        addNewCategory,
        updateCategoryById,
        deleteCategoryById,

        addNewPlanBlock,
        updatePlanBlockById,
        deletePlanBlockById,

        updateSettings,

        isSearchOpen,
        setIsSearchOpen,
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        toastMessage,
        showToast,

        todayFocusMinutes,
        pendingTasksCount,
        completedTasksCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
