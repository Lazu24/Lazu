import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { userSettings } from './schema.ts';

export async function getUserSettings(userId = 'default_user') {
  try {
    const result = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    if (result.length > 0) {
      return result[0];
    }

    // Default settings if not created yet
    const created = await db
      .insert(userSettings)
      .values({
        userId,
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
      })
      .returning();
    return created[0];
  } catch (error) {
    console.error('Error fetching user settings from database:', error);
    throw new Error('Database query failed. Could not fetch user settings.', { cause: error });
  }
}

export async function updateUserSettings(userId = 'default_user', data: Partial<typeof userSettings.$inferInsert>) {
  try {
    const result = await db
      .update(userSettings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(userSettings.userId, userId))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error updating user settings in database:', error);
    throw new Error('Database query failed. Could not update user settings.', { cause: error });
  }
}
