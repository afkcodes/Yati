/**
 * Basic type definitions
 */
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

/**
 * Checklist item structure
 */
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Defines how a habit's progress is evaluated
 */
export interface HabitEvaluation {
  type: EvaluationType; // How to track progress
  target: number; // Target value to reach (e.g., 5 glasses of water)
  unit: string; // Unit of measurement (e.g., "glasses", "minutes")
  checklistItems?: ChecklistItem[]; // For checklist type
}

/**
 * Defines when the habit should be performed
 */
export interface HabitFrequency {
  type: FrequencyType; // How often to perform the habit
  value: string[]; // Days of week or dates of month
  timeOfDay: Date | null; // Specific time to perform the habit
  interval?: number; // For hourly frequency (every X hours)
}

/**
 * Defines a goal for a habit
 */
export interface HabitGoal {
  enabled: boolean; // Whether a goal is set
  target: number; // Number of completions to reach
  deadline: Date | null; // Date by which to complete the goal
  progress: number; // Current progress towards goal (0-100)
}

/**
 * Progress tracking for a specific day
 */
export interface DailyProgress {
  date: string; // ISO format date string
  isCompleted: boolean; // Whether the habit was completed on this day
  value?: number; // For numeric/timer habits
  checklistProgress?: {[itemId: string]: boolean}; // For checklist habits
  notes?: string; // Optional notes for the day
}

/**
 * Main Habit interface
 */
export interface Habit {
  id: string; // Unique identifier
  title: string; // Name of the habit
  description?: string; // Detailed description
  color: string; // Color used for UI elements
  category: HabitCategory; // Categorization
  timePeriod: TimePeriod; // Time of day period

  // Tracking configuration
  frequency: HabitFrequency;
  evaluation: HabitEvaluation;
  goal?: HabitGoal;

  // Status tracking
  createdAt: string; // ISO date string when created
  lastUpdatedAt: string; // ISO date string of last update
  streak: number; // Current streak count
  longestStreak: number; // Best streak ever achieved
  progress: {[date: string]: DailyProgress}; // Progress keyed by date
  archivedAt?: string; // ISO date string if archived
}

/**
 * Habit form data used for creation/editing
 */
export interface HabitFormData {
  title: string;
  description: string;
  color: string;
  categoryId: HabitCategory;
  frequency: {
    type: FrequencyType;
    value: string[];
    timeOfDay: Date | null;
    interval?: number;
  };
  evaluation: {
    type: EvaluationType;
    target: number;
    unit: string;
    checklistItems?: ChecklistItem[];
  };
  goal: {
    enabled: boolean;
    target: number;
    deadline: Date | null;
  };
  reminders: Date[];
}

/**
 * Validation error interface
 */
export interface HabitFormErrors {
  title?: string;
  categoryId?: string;
  frequency?: string;
  evaluation?: string;
  goal?: string;
  general?: string;
  reminders?: string;
}
