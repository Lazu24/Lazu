import { asc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { planBlocks } from './schema.ts';

export async function getPlanBlocks(userId = 'default_user') {
  try {
    return await db
      .select()
      .from(planBlocks)
      .where(eq(planBlocks.userId, userId))
      .orderBy(asc(planBlocks.startTime));
  } catch (error) {
    console.error('Error fetching plan blocks from database:', error);
    throw new Error('Database query failed. Could not fetch plan blocks.', { cause: error });
  }
}

export async function createPlanBlock(data: {
  userId?: string;
  taskId?: number;
  title: string;
  day: string;
  dayDate?: string;
  startTime: string;
  durationMinutes: number;
  categoryName: string;
  status?: string;
}) {
  try {
    const result = await db
      .insert(planBlocks)
      .values({
        userId: data.userId || 'default_user',
        taskId: data.taskId || null,
        title: data.title,
        day: data.day,
        dayDate: data.dayDate || '2026-10-29',
        startTime: data.startTime,
        durationMinutes: data.durationMinutes,
        categoryName: data.categoryName,
        status: data.status || 'pending',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error creating plan block in database:', error);
    throw new Error('Database query failed. Could not create plan block.', { cause: error });
  }
}

export async function updatePlanBlock(id: number, data: Partial<typeof planBlocks.$inferInsert>) {
  try {
    const result = await db
      .update(planBlocks)
      .set(data)
      .where(eq(planBlocks.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error(`Error updating plan block ${id}:`, error);
    throw new Error(`Database query failed. Could not update plan block ${id}.`, { cause: error });
  }
}

export async function deletePlanBlock(id: number) {
  try {
    const result = await db
      .delete(planBlocks)
      .where(eq(planBlocks.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error(`Error deleting plan block ${id}:`, error);
    throw new Error(`Database query failed. Could not delete plan block ${id}.`, { cause: error });
  }
}
