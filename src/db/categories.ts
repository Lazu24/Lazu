import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { categories, tasks } from './schema.ts';

export async function getAllCategories(userId = 'default_user') {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(categories.id);

    const allTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    return allCategories.map((cat) => {
      const catTasks = allTasks.filter(
        (t) => t.categoryId === cat.id || t.categoryName?.toLowerCase() === cat.name?.toLowerCase()
      );
      const pending = catTasks.filter((t) => t.status !== 'completed').length;
      const completed = catTasks.filter((t) => t.status === 'completed').length;
      return {
        ...cat,
        taskCount: {
          pending,
          completed,
          total: catTasks.length,
        },
      };
    });
  } catch (error) {
    console.error('Error fetching categories from database:', error);
    throw new Error('Database query failed. Could not fetch categories.', { cause: error });
  }
}

export async function createCategory(data: {
  userId?: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
}) {
  try {
    const result = await db
      .insert(categories)
      .values({
        userId: data.userId || 'default_user',
        name: data.name,
        icon: data.icon || 'folder',
        color: data.color || '#8B5CF6',
        description: data.description || '',
        isDefault: false,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error creating category in database:', error);
    throw new Error('Database query failed. Could not create category.', { cause: error });
  }
}

export async function updateCategory(id: number, data: Partial<typeof categories.$inferInsert>) {
  try {
    const result = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error(`Error updating category ${id} in database:`, error);
    throw new Error(`Database query failed. Could not update category ${id}.`, { cause: error });
  }
}

export async function deleteCategory(id: number) {
  try {
    // When deleting a category, tasks get unlinked (category_id = null)
    await db
      .update(tasks)
      .set({ categoryId: null, categoryName: 'Sin categoría' })
      .where(eq(tasks.categoryId, id));

    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error(`Error deleting category ${id} from database:`, error);
    throw new Error(`Database query failed. Could not delete category ${id}.`, { cause: error });
  }
}
