// utils/streaks/streakTypes.ts

// Defines the possible streak types supported by the app
export type StreakType = 'daily' | 'weekly' | 'rolling' | 'milestone';

// Configuration for a streak, specifying initial behavior
export interface StreakConfig {
  type: StreakType; // The type of streak (daily, weekly, etc.)
  weeklyTarget?: number; // Required for weekly streaks: min completions per week
  rollingMaxGap?: number; // Required for rolling streaks: max days between completions
  milestoneTarget?: number; // Required for milestone streaks: completions per milestone
  milestoneReset?: boolean; // For milestone streaks: reset current streak after milestone
  initialFreezeDays?: number; // Initial number of freeze days (default: 3), moved from freezeDaysAllowed
  freezeResetPeriod?: 'monthly' | 'weekly' | 'never'; // How often freeze days reset (default: monthly)
}

// Represents the current state of a habit's streak, persisted with the habit
export interface StreakData {
  type: StreakType; // The streak type, determines calculation logic
  current: number; // Current streak length (days, weeks, completions, etc.)
  longest: number; // Longest streak achieved historically
  history: {start: string; end: string; length: number}[]; // Array of past streaks (dates in 'yyyy-MM-dd')
  freezeDaysAllowed: number; // Total available freeze days (initial + earned + purchased)
  freezeDaysUsed: number; // Number of freeze days used in the current reset period
  lastFreezeReset?: string; // ISO UTC date of the last freeze day reset (e.g., start of month)
  frozenUntil?: string; // ISO UTC date until which the streak is frozen (optional)
  lastCompletion?: string; // ISO UTC date of the last completion
  earnedFreezeDayAt21?: boolean; // Flag to prevent re-earning a freeze day at 21
}

// Result of a streak calculation, including updates and events
export interface StreakUpdateResult {
  streak: StreakData; // Updated streak data after calculation
  milestoneAchieved?: number; // Milestone reached (e.g., 7, 14, 30 days), if any
  earnedFreezeDay?: boolean; // True if a freeze day was earned (e.g., at 21 days)
  requiresPayment?: boolean; // True if freeze days are depleted and payment is needed
}

// Default configuration for new streaks
export const defaultStreakConfig: StreakConfig = {
  type: 'daily', // Default to daily streak
  weeklyTarget: 1, // Default for weekly: 1 completion per week
  rollingMaxGap: 7, // Default for rolling: 7-day max gap
  milestoneTarget: 10, // Default for milestone: 10 completions
  milestoneReset: false, // Don’t reset milestone streaks by default
  initialFreezeDays: 3, // Start with 3 freeze days
  freezeResetPeriod: 'monthly', // Reset freeze days monthly
};
