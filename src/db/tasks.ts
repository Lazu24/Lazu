import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { tasks, categories } from './schema.ts';

export async function getAllTasks(userId = 'default_user') {
  try {
    return await db
      .select({
        id: tasks.id,
        userId: tasks.userId,
        categoryId: tasks.categoryId,
        categoryName: tasks.categoryName,
        name: tasks.name,
        description: tasks.description,
        dueDate: tasks.dueDate,
        status: tasks.status,
        estimatedDuration: tasks.estimatedDuration,
        scheduledTime: tasks.scheduledTime,
        notes: tasks.notes,
        createdAt: tasks.createdAt,
      })
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.id));
  } catch (error) {
    console.error('Error fetching tasks from database:', error);
    throw new Error('Database query failed. Could not fetch tasks.', { cause: error });
  }
}

export async function createTask(data: {
  userId?: string;
  name: string;
  description: string;
  dueDate: string;
  status?: string;
  categoryId?: number;
  categoryName?: string;
  estimatedDuration?: number;
  scheduledTime?: string;
}) {
  try {
    const result = await db
      .insert(tasks)
      .values({
        userId: data.userId || 'default_user',
        name: data.name,
        description: data.description,
        dueDate: data.dueDate,
        status: data.status || 'pending',
        categoryId: data.categoryId || null,
        categoryName: data.categoryName || 'Personal',
        estimatedDuration: data.estimatedDuration || 25,
        scheduledTime: data.scheduledTime || 'Hoy · 10:00',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error creating task in database:', error);
    throw new Error('Database query failed. Could not create task.', { cause: error });
  }
}

export async function updateTask(id: number, data: Partial<typeof tasks.$inferInsert>) {
  try {
    const result = await db
      .update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error(`Error updating task ${id} in database:`, error);
    throw new Error(`Database query failed. Could not update task ${id}.`, { cause: error });
  }
}

export async function deleteTask(id: number) {
  try {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error(`Error deleting task ${id} from database:`, error);
    throw new Error(`Database query failed. Could not delete task ${id}.`, { cause: error });
  }
}

export async function clearCompletedTasks(userId = 'default_user') {
  try {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.status, 'completed'))
      .returning();
    return result;
  } catch (error) {
    console.error('Error deleting completed tasks from database:', error);
    throw new Error('Database query failed. Could not delete completed tasks.', { cause: error });
  }
}
