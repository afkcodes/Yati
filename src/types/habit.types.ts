// Basic types
export type TimePeriod = 'morning' | 'evening' | 'night';
export type HabitCategory =
  | 'health'
  | 'learning'
  | 'productivity'
  | 'mindfulness'
  | 'fitness'
  | 'sleep'
  | 'goals'
  | 'career';
export type FrequencyType = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type EvaluationType = 'boolean' | 'numeric' | 'timer' | 'checklist';

// Habit evaluation data
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface HabitEvaluation {
  type: EvaluationType;
  target: number;
  unit: string;
  checklistItems?: ChecklistItem[];
  currentValue?: number; // For numeric/timer types
}

// Frequency data (when the habit should be performed)
export interface FrequencyData {
  type: FrequencyType;
  value: string[]; // Days of week or dates of month
  timeOfDay: Date | null;
  interval?: number; // For hourly frequency (every X hours)
}

// Goal data
export interface GoalData {
  enabled: boolean;
  target: number; // Number of completions
  deadline: Date | null;
  progress: number; // Current progress towards goal (0-100)
}

// Tracking progress for a specific day
export interface DailyProgress {
  date: string; // ISO format date string
  isCompleted: boolean;
  value?: number; // For numeric/timer habits
  checklistProgress?: {[itemId: string]: boolean}; // For checklist habits
  notes?: string;
}

// Main Habit interface
export interface Habit {
  id: string;
  title: string;
  description?: string;
  color: string;
  category: HabitCategory;
  timePeriod: TimePeriod;
  createdAt: string; // ISO date string
  lastUpdatedAt: string; // ISO date string

  // Core tracking data
  frequency: FrequencyData;
  evaluation: HabitEvaluation;
  goal?: GoalData;

  // Status and progress
  streak: number;
  longestStreak: number;
  progress: {[date: string]: DailyProgress}; // Keyed by date strings
  archivedAt?: string; // ISO date string if archived
}

// Form data for creating/editing
export interface HabitFormData {
  title: string;
  description: string;
  color: string;
  categoryId: HabitCategory;
  frequency: FrequencyData;
  evaluation: HabitEvaluation;
  goal: {
    enabled: boolean;
    target: number;
    deadline: Date | null;
  };
  reminders: Date[];
}

// Validation error interface
export interface HabitFormErrors {
  title?: string;
  categoryId?: string;
  frequency?: string;
  evaluation?: string;
  goal?: string;
  general?: string;
  reminders?: string;
}

// Helper for analytics and stats
export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  currentStreaks: {[habitId: string]: number};
  longestStreaks: {[habitId: string]: number};
  categoryBreakdown: {[category in HabitCategory]?: number};
  completionRate: number; // 0-1
}
