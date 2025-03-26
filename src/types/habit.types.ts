// types/habit.ts
import {
  CommonUnit,
  EvaluationType,
  FrequencyType,
  HabitCategoryType as HabitCategory,
  HabitColor,
  TimeUnit,
} from '~/utils/constants/habitConstants';
import {StreakData} from './streak.types';

// Frequency Type (matches FrequencySection.tsx)
export interface FrequencyData {
  type: FrequencyType;
  value: string[];
  timeOfDay: Date | null;
  interval?: number;
}

// Checklist Item
export interface ChecklistItem {
  id: string;
  text: string;
  completed?: boolean;
}

// Evaluation Type (matches EvaluationSection.tsx)
export interface EvaluationData {
  type: EvaluationType;
  target: number;
  unit: CommonUnit | TimeUnit | string;
  checklistItems?: ChecklistItem[];
}

// Goal Type (matches GoalSection.tsx)
export interface GoalData {
  enabled: boolean;
  timeframe: 'weekly' | 'monthly' | 'yearly';
  target: number;
  deadline: Date | null;
  progress?: number;
}

// Reminder Type (stored as ISO strings in UTC)
export type Reminder = string;

// Daily Progress
export interface DailyProgress {
  date: string;
  isCompleted: boolean;
  value?: number;
  checklist?: Array<{id: string; completed: boolean}>;
  completedAt?: string; // ISO string in UTC
}

// Core Habit Interface
export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  color: HabitColor;
  frequency: FrequencyData;
  evaluation: EvaluationData;
  goal?: GoalData;
  reminders: Reminder[]; // Array of ISO strings in UTC
  timePeriod: 'morning' | 'evening' | 'night';
  progress: Record<string, DailyProgress>;
  createdAt: string; // ISO string in UTC
  lastUpdatedAt?: string; // ISO string in UTC
  archivedAt?: string; // ISO string in UTC
  streak?: StreakData;
}

// Form Data for Creation
export interface HabitFormData {
  id?: string;
  title: string;
  description?: string;
  category: HabitCategory;
  color: HabitColor;
  frequency: FrequencyData;
  evaluation: EvaluationData;
  goal?: GoalData;
  reminders: string[]; // Changed to string[] (ISO strings in UTC)
  timePeriod?: 'morning' | 'evening' | 'night';
}

// Form Errors
export interface HabitFormErrors {
  title?: string;
  category?: string;
  color?: string;
  frequency?: string;
  evaluation?: string;
  goal?: string;
  reminders?: string;
}
