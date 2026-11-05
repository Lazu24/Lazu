import { Task, Category, FocusSession, PlanBlock, UserSettings, TaskFormData } from '../types/index.ts';

const API_BASE = '/api';

export const taskService = {
  async getAll(): Promise<Task[]> {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error('Error al cargar las tareas');
    return res.json();
  },

  async create(data: TaskFormData & { categoryId?: number; categoryName?: string; estimatedDuration?: number; scheduledTime?: string }): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al crear la tarea');
    }
    return res.json();
  },

  async update(id: number, data: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar la tarea');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar la tarea');
  },

  async cleanupCompleted(): Promise<number> {
    const res = await fetch(`${API_BASE}/tasks/cleanup-completed`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Error al limpiar tareas completadas');
    const data = await res.json();
    return data.count || 0;
  },
};

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Error al cargar categorías');
    return res.json();
  },

  async create(data: { name: string; icon?: string; color?: string; description?: string }): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear la categoría');
    return res.json();
  },

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar la categoría');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar la categoría');
  },
};

export const focusService = {
  async getAll(): Promise<FocusSession[]> {
    const res = await fetch(`${API_BASE}/focus-sessions`);
    if (!res.ok) throw new Error('Error al cargar sesiones de concentración');
    return res.json();
  },

  async record(data: {
    taskId?: number | null;
    taskName: string;
    categoryName?: string;
    durationMinutes: number;
    startTime: string;
    dayOfWeek?: string;
    date?: string;
    status?: string;
  }): Promise<FocusSession> {
    const res = await fetch(`${API_BASE}/focus-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al registrar la sesión de concentración');
    return res.json();
  },
};

export const planService = {
  async getAll(): Promise<PlanBlock[]> {
    const res = await fetch(`${API_BASE}/plan-blocks`);
    if (!res.ok) throw new Error('Error al cargar bloques del plan');
    return res.json();
  },

  async create(data: {
    taskId?: number | null;
    title: string;
    day: string;
    dayDate?: string;
    startTime: string;
    durationMinutes: number;
    categoryName: string;
    status?: string;
  }): Promise<PlanBlock> {
    const res = await fetch(`${API_BASE}/plan-blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear bloque del plan');
    return res.json();
  },

  async update(id: number, data: Partial<PlanBlock>): Promise<PlanBlock> {
    const res = await fetch(`${API_BASE}/plan-blocks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar bloque del plan');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/plan-blocks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar bloque del plan');
  },
};

export const userService = {
  async getSettings(): Promise<UserSettings> {
    const res = await fetch(`${API_BASE}/user-settings`);
    if (!res.ok) throw new Error('Error al obtener ajustes de usuario');
    return res.json();
  },

  async updateSettings(data: Partial<UserSettings>): Promise<UserSettings> {
    const res = await fetch(`${API_BASE}/user-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar ajustes de usuario');
    return res.json();
  },
};
