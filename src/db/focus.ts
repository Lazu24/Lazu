import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { focusSessions } from './schema.ts';

export async function getFocusSessions(userId = 'default_user') {
  try {
    return await db
      .select()
      .from(focusSessions)
      .where(eq(focusSessions.userId, userId))
      .orderBy(desc(focusSessions.id));
  } catch (error) {
    console.error('Error fetching focus sessions from database:', error);
    throw new Error('Database query failed. Could not fetch focus sessions.', { cause: error });
  }
}

export async function recordFocusSession(data: {
  userId?: string;
  taskId?: number;
  taskName: string;
  categoryName?: string;
  durationMinutes: number;
  startTime: string;
  dayOfWeek?: string;
  date?: string;
  status?: string;
}) {
  try {
    const result = await db
      .insert(focusSessions)
      .values({
        userId: data.userId || 'default_user',
        taskId: data.taskId || null,
        taskName: data.taskName,
        categoryName: data.categoryName || 'Trabajo',
        durationMinutes: data.durationMinutes,
        startTime: data.startTime,
        dayOfWeek: data.dayOfWeek || 'J',
        date: data.date || '2026-10-29',
        status: data.status || 'completed',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error recording focus session:', error);
    throw new Error('Database query failed. Could not record focus session.', { cause: error });
  }
}
