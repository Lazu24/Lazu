import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').default('Alex López'),
  avatar: text('avatar').default('AL'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  userId: text('user_id').default('default_user'),
  name: text('name').notNull(),
  icon: text('icon').notNull().default('briefcase'),
  color: text('color').notNull().default('#8B5CF6'),
  description: text('description').default(''),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: text('user_id').default('default_user'),
  categoryId: integer('category_id').references(() => categories.id),
  categoryName: text('category_name').default('Trabajo'),
  name: text('name').notNull(),
  description: text('description').notNull(),
  dueDate: text('due_date').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'completed'
  estimatedDuration: integer('estimated_duration').default(25), // in minutes
  scheduledTime: text('scheduled_time'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Focus Sessions table
export const focusSessions = pgTable('focus_sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').default('default_user'),
  taskId: integer('task_id').references(() => tasks.id),
  taskName: text('task_name').notNull(),
  categoryName: text('category_name').default('Trabajo'),
  durationMinutes: integer('duration_minutes').notNull().default(25),
  startTime: text('start_time').notNull(),
  dayOfWeek: text('day_of_week').notNull().default('J'), // L, M, X, J, V, S, D
  date: text('date').notNull().default('2026-10-29'),
  status: text('status').notNull().default('completed'), // completed, cancelled
  createdAt: timestamp('created_at').defaultNow(),
});

// Planning Calendar Blocks table
export const planBlocks = pgTable('plan_blocks', {
  id: serial('id').primaryKey(),
  userId: text('user_id').default('default_user'),
  taskId: integer('task_id').references(() => tasks.id),
  title: text('title').notNull(),
  day: text('day').notNull(), // 'LUN 26', 'MAR 27', 'MIÉ 28', 'JUE 29', 'VIE 30'
  dayDate: text('day_date').notNull().default('2026-10-29'),
  startTime: text('start_time').notNull(), // '08:30', '10:00', '12:00', '14:00'
  durationMinutes: integer('duration_minutes').notNull().default(50),
  categoryName: text('category_name').notNull().default('Trabajo'),
  status: text('status').notNull().default('pending'), // pending, completed
  createdAt: timestamp('created_at').defaultNow(),
});

// User Settings table
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  name: text('name').default('Alex López'),
  email: text('email').default('alex@ejemplo.com'),
  focusDuration: integer('focus_duration').default(25),
  shortBreak: integer('short_break').default(5),
  longBreak: integer('long_break').default(15),
  autoStartBreaks: boolean('auto_start_breaks').default(false),
  notifySessionEnd: boolean('notify_session_end').default(true),
  ambientSound: text('ambient_sound').default('Lluvia suave'),
  ambientVolume: integer('ambient_volume').default(60),
  dailyGoalMinutes: integer('daily_goal_minutes').default(120),
  theme: text('theme').default('Neo Glass Dark'),
  language: text('language').default('es-ES'),
  timezone: text('timezone').default('Madrid · GMT+1'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
  focusSessions: many(focusSessions),
  planBlocks: many(planBlocks),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  tasks: many(tasks),
}));

export const focusSessionsRelations = relations(focusSessions, ({ one }) => ({
  task: one(tasks, {
    fields: [focusSessions.taskId],
    references: [tasks.id],
  }),
}));

export const planBlocksRelations = relations(planBlocks, ({ one }) => ({
  task: one(tasks, {
    fields: [planBlocks.taskId],
    references: [tasks.id],
  }),
}));
