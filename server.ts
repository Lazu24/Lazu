import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { validFormFieldInput, getValidationErrors } from './src/utils/validation.ts';
import { getAllTasks, createTask, updateTask, deleteTask, clearCompletedTasks } from './src/db/tasks.ts';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from './src/db/categories.ts';
import { getFocusSessions, recordFocusSession } from './src/db/focus.ts';
import { getPlanBlocks, createPlanBlock, updatePlanBlock, deletePlanBlock } from './src/db/plan.ts';
import { getUserSettings, updateUserSettings } from './src/db/settings.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API: Tasks
app.get('/api/tasks', async (_req: Request, res: Response) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error: any) {
    console.error('Error in GET /api/tasks:', error);
    res.status(500).json({ error: error.message || 'Error al obtener tareas' });
  }
});

app.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const { newTaskNameInput, newTaskDescription, newTaskDueDate, newTaskStatus, categoryName, categoryId, estimatedDuration, scheduledTime } = req.body;

    // Server-side strict Sprint 1 validation check
    const isValid = validFormFieldInput({
      newTaskNameInput,
      newTaskDescription,
      newTaskDueDate,
      newTaskStatus,
    });

    if (!isValid) {
      const errors = getValidationErrors({
        newTaskNameInput,
        newTaskDescription,
        newTaskDueDate,
        newTaskStatus,
      });
      return res.status(400).json({
        error: 'Validación fallida: uno o más campos obligatorios están incompletos.',
        details: errors,
      });
    }

    const newTask = await createTask({
      name: newTaskNameInput.trim(),
      description: newTaskDescription.trim(),
      dueDate: newTaskDueDate.trim(),
      status: newTaskStatus.trim(),
      categoryId: categoryId ? Number(categoryId) : undefined,
      categoryName: categoryName || 'Personal',
      estimatedDuration: estimatedDuration ? Number(estimatedDuration) : 25,
      scheduledTime: scheduledTime || 'Hoy · 10:00',
    });

    res.status(201).json(newTask);
  } catch (error: any) {
    console.error('Error in POST /api/tasks:', error);
    res.status(500).json({ error: error.message || 'Error al crear la tarea' });
  }
});

app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await updateTask(id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error(`Error in PUT /api/tasks/${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al actualizar la tarea' });
  }
});

app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await deleteTask(id);
    res.json({ message: 'Tarea eliminada exitosamente', task: deleted });
  } catch (error: any) {
    console.error(`Error in DELETE /api/tasks/${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al eliminar la tarea' });
  }
});

app.post('/api/tasks/cleanup-completed', async (_req: Request, res: Response) => {
  try {
    const result = await clearCompletedTasks();
    res.json({ message: 'Tareas completadas limpiadas exitosamente', count: result.length });
  } catch (error: any) {
    console.error('Error in POST /api/tasks/cleanup-completed:', error);
    res.status(500).json({ error: error.message || 'Error al limpiar completadas' });
  }
});

// API: Categories
app.get('/api/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Error in GET /api/categories:', error);
    res.status(500).json({ error: error.message || 'Error al obtener categorías' });
  }
});

app.post('/api/categories', async (req: Request, res: Response) => {
  try {
    const { name, icon, color, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
    }
    const created = await createCategory({
      name: name.trim(),
      icon: icon || 'folder',
      color: color || '#8B5CF6',
      description: description || '',
    });
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Error in POST /api/categories:', error);
    res.status(500).json({ error: error.message || 'Error al crear categoría' });
  }
});

app.put('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await updateCategory(id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error(`Error in PUT /api/categories/${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al actualizar categoría' });
  }
});

app.delete('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await deleteCategory(id);
    res.json({ message: 'Categoría eliminada con éxito', category: deleted });
  } catch (error: any) {
    console.error(`Error in DELETE /api/categories/${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al eliminar categoría' });
  }
});

// API: Focus Sessions
app.get('/api/focus-sessions', async (_req: Request, res: Response) => {
  try {
    const sessions = await getFocusSessions();
    res.json(sessions);
  } catch (error: any) {
    console.error('Error in GET /api/focus-sessions:', error);
    res.status(500).json({ error: error.message || 'Error al obtener sesiones' });
  }
});

app.post('/api/focus-sessions', async (req: Request, res: Response) => {
  try {
    const { taskId, taskName, categoryName, durationMinutes, startTime, dayOfWeek, date, status } = req.body;
    if (!taskName || !durationMinutes) {
      return res.status(400).json({ error: 'Nombre de tarea y duración requeridos' });
    }
    const recorded = await recordFocusSession({
      taskId: taskId ? Number(taskId) : undefined,
      taskName,
      categoryName: categoryName || 'Trabajo',
      durationMinutes: Number(durationMinutes),
      startTime: startTime || '10:00',
      dayOfWeek: dayOfWeek || 'J',
      date: date || '2026-10-29',
      status: status || 'completed',
    });
    res.status(201).json(recorded);
  } catch (error: any) {
    console.error('Error in POST /api/focus-sessions:', error);
    res.status(500).json({ error: error.message || 'Error al guardar sesión' });
  }
});

// API: Planning Blocks
app.get('/api/plan-blocks', async (_req: Request, res: Response) => {
  try {
    const blocks = await getPlanBlocks();
    res.json(blocks);
  } catch (error: any) {
    console.error('Error in GET /api/plan-blocks:', error);
    res.status(500).json({ error: error.message || 'Error al obtener bloques del plan' });
  }
});

app.post('/api/plan-blocks', async (req: Request, res: Response) => {
  try {
    const { taskId, title, day, dayDate, startTime, durationMinutes, categoryName, status } = req.body;
    if (!title || !day || !startTime) {
      return res.status(400).json({ error: 'Título, día y hora de inicio requeridos' });
    }
    const created = await createPlanBlock({
      taskId: taskId ? Number(taskId) : undefined,
      title,
      day,
      dayDate,
      startTime,
      durationMinutes: Number(durationMinutes || 50),
      categoryName: categoryName || 'Trabajo',
      status: status || 'pending',
    });
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Error in POST /api/plan-blocks:', error);
    res.status(500).json({ error: error.message || 'Error al crear bloque' });
  }
});

app.put('/api/plan-blocks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await updatePlanBlock(id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error(`Error in PUT /api/plan-blocks/${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al actualizar bloque' });
  }
});

app.delete('/api/plan-blocks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await deletePlanBlock(id);
    res.json({ message: 'Bloque eliminado exitosamente', block: deleted });
  } catch (error: any) {
    console.error(`Error in DELETE /api/plan-blocks/${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al eliminar bloque' });
  }
});

// API: User Settings
app.get('/api/user-settings', async (_req: Request, res: Response) => {
  try {
    const settings = await getUserSettings();
    res.json(settings);
  } catch (error: any) {
    console.error('Error in GET /api/user-settings:', error);
    res.status(500).json({ error: error.message || 'Error al obtener ajustes' });
  }
});

app.put('/api/user-settings', async (req: Request, res: Response) => {
  try {
    const updated = await updateUserSettings('default_user', req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error in PUT /api/user-settings:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar ajustes' });
  }
});

// API: Export CSV
app.get('/api/export-csv', async (_req: Request, res: Response) => {
  try {
    const sessions = await getFocusSessions();
    let csv = 'ID,Tarea,Categoría,Duración (min),Inicio,Fecha,Día,Estado\n';
    sessions.forEach((s) => {
      csv += `${s.id},"${s.taskName.replace(/"/g, '""')}","${s.categoryName}",${s.durationMinutes},"${s.startTime}","${s.date}","${s.dayOfWeek}","${s.status}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="lazu-sesiones-concentracion.csv"');
    res.send(csv);
  } catch (error: any) {
    console.error('Error in GET /api/export-csv:', error);
    res.status(500).json({ error: 'Error al exportar reporte CSV' });
  }
});

// API: Testing & Reset Helpers
app.get('/api/test/status', async (_req: Request, res: Response) => {
  try {
    const [tasks, sessions, blocks, categories] = await Promise.all([
      getAllTasks(),
      getFocusSessions(),
      getPlanBlocks(),
      getAllCategories(),
    ]);
    res.json({
      tasksCount: tasks.length,
      sessionsCount: sessions.length,
      blocksCount: blocks.length,
      categoriesCount: categories.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/test/reset-to-zero', async (_req: Request, res: Response) => {
  try {
    const { db } = await import('./src/db/index.ts');
    const { tasks, focusSessions, planBlocks } = await import('./src/db/schema.ts');
    await db.delete(focusSessions);
    await db.delete(planBlocks);
    await db.delete(tasks);
    res.json({ message: 'Base de datos reiniciada a cero exitosamente' });
  } catch (error: any) {
    console.error('Error in POST /api/test/reset-to-zero:', error);
    res.status(500).json({ error: error.message || 'Error al reiniciar datos' });
  }
});

app.post('/api/test/seed-demo', async (_req: Request, res: Response) => {
  try {
    const { db } = await import('./src/db/index.ts');
    const { tasks, focusSessions, planBlocks } = await import('./src/db/schema.ts');
    
    // Clean first
    await db.delete(focusSessions);
    await db.delete(planBlocks);
    await db.delete(tasks);

    // Insert demo tasks
    await db.insert(tasks).values([
      {
        id: 1,
        userId: 'default_user',
        categoryId: 1,
        categoryName: 'Trabajo',
        name: 'Preparar la presentación',
        description: 'Definir el hilo narrativo y preparar las diapositivas clave.',
        dueDate: '2026-10-29',
        status: 'pending',
        estimatedDuration: 50,
        scheduledTime: 'Hoy · 10:00',
      },
      {
        id: 2,
        userId: 'default_user',
        categoryId: 2,
        categoryName: 'Personal',
        name: 'Revisar los pendientes',
        description: 'Responder correos urgentes y revisar tareas de la semana.',
        dueDate: '2026-10-29',
        status: 'pending',
        estimatedDuration: 25,
        scheduledTime: 'Hoy · 14:00',
      },
      {
        id: 3,
        userId: 'default_user',
        categoryId: 2,
        categoryName: 'Personal',
        name: 'Organizar la semana',
        description: 'Planificar prioridades y bloques de tiempo.',
        dueDate: '2026-10-29',
        status: 'completed',
        estimatedDuration: 25,
        scheduledTime: 'Hoy · 08:30',
      },
    ]);

    // Insert demo focus sessions
    await db.insert(focusSessions).values([
      {
        userId: 'default_user',
        taskId: 1,
        taskName: 'Preparar la presentación',
        categoryName: 'Trabajo',
        durationMinutes: 25,
        startTime: '08:00',
        dayOfWeek: 'J',
        date: '2026-10-29',
        status: 'completed',
      },
      {
        userId: 'default_user',
        taskId: 3,
        taskName: 'Organizar la semana',
        categoryName: 'Personal',
        durationMinutes: 25,
        startTime: '08:30',
        dayOfWeek: 'J',
        date: '2026-10-29',
        status: 'completed',
      },
      {
        userId: 'default_user',
        taskId: 1,
        taskName: 'Preparar la presentación',
        categoryName: 'Trabajo',
        durationMinutes: 25,
        startTime: '09:00',
        dayOfWeek: 'J',
        date: '2026-10-29',
        status: 'completed',
      },
    ]);

    // Insert demo plan blocks
    await db.insert(planBlocks).values([
      {
        id: 1,
        userId: 'default_user',
        title: 'Bloque de concentración',
        day: 'LUN 26',
        dayDate: '2026-10-26',
        startTime: '10:00',
        durationMinutes: 90,
        categoryName: 'Trabajo',
        status: 'completed',
      },
      {
        id: 2,
        userId: 'default_user',
        title: 'Bloque de concentración',
        day: 'MAR 27',
        dayDate: '2026-10-27',
        startTime: '10:00',
        durationMinutes: 120,
        categoryName: 'Trabajo',
        status: 'completed',
      },
      {
        id: 3,
        userId: 'default_user',
        title: 'Bloque de concentración',
        day: 'MIÉ 28',
        dayDate: '2026-10-28',
        startTime: '12:00',
        durationMinutes: 165,
        categoryName: 'Trabajo',
        status: 'completed',
      },
      {
        id: 4,
        userId: 'default_user',
        taskId: 3,
        title: 'Organizar la semana',
        day: 'JUE 29',
        dayDate: '2026-10-29',
        startTime: '08:30',
        durationMinutes: 25,
        categoryName: 'Personal',
        status: 'completed',
      },
      {
        id: 5,
        userId: 'default_user',
        taskId: 1,
        title: 'Preparar la presentación',
        day: 'JUE 29',
        dayDate: '2026-10-29',
        startTime: '10:00',
        durationMinutes: 50,
        categoryName: 'Trabajo',
        status: 'pending',
      },
      {
        id: 6,
        userId: 'default_user',
        taskId: 2,
        title: 'Revisar los pendientes',
        day: 'JUE 29',
        dayDate: '2026-10-29',
        startTime: '14:00',
        durationMinutes: 25,
        categoryName: 'Personal',
        status: 'pending',
      },
      {
        id: 7,
        userId: 'default_user',
        title: 'Tiempo personal',
        day: 'VIE 30',
        dayDate: '2026-10-30',
        startTime: '10:00',
        durationMinutes: 60,
        categoryName: 'Personal',
        status: 'pending',
      },
    ]);

    res.json({ message: 'Datos demo restablecidos exitosamente' });
  } catch (error: any) {
    console.error('Error in POST /api/test/seed-demo:', error);
    res.status(500).json({ error: error.message || 'Error al poblar datos demo' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lazu fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
