export interface Task {
  id: number;
  userId: string;
  categoryId: number | null;
  categoryName: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  estimatedDuration: number; // in minutes
  scheduledTime?: string | null;
  notes?: string | null;
  createdAt?: string;
}

export interface Category {
  id: number;
  userId: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  isDefault: boolean;
  createdAt?: string;
  taskCount?: {
    pending: number;
    completed: number;
    total: number;
  };
}

export interface FocusSession {
  id: number;
  userId: string;
  taskId?: number | null;
  taskName: string;
  categoryName: string;
  durationMinutes: number;
  startTime: string;
  dayOfWeek: string;
  date: string;
  status: 'completed' | 'cancelled';
  createdAt?: string;
}

export interface PlanBlock {
  id: number;
  userId: string;
  taskId?: number | null;
  title: string;
  day: string; // 'LUN 26', 'MAR 27', 'MIÉ 28', 'JUE 29', 'VIE 30'
  dayDate: string;
  startTime: string; // '08:30', '10:00'
  durationMinutes: number;
  categoryName: string;
  status: 'pending' | 'completed';
  createdAt?: string;
}

export interface UserSettings {
  id?: number;
  userId: string;
  name: string;
  email: string;
  focusDuration: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  notifySessionEnd: boolean;
  ambientSound: string;
  ambientVolume: number;
  dailyGoalMinutes: number;
  theme: string;
  language: string;
  timezone: string;
}

export interface TaskFormData {
  newTaskNameInput: string;
  newTaskDescription: string;
  newTaskDueDate: string;
  newTaskStatus: string;
  categoryName?: string;
  estimatedDuration?: number;
}
