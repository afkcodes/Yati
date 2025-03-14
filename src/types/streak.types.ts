/**
 * Streak standards for habit tracking applications
 *
 * Industry standard definitions for streak calculations:
 *
 * 1. Current Streak: The number of consecutive days/occurrences the habit was completed
 *    when it was scheduled, counting backwards from the most recent scheduled day.
 *    - For daily habits: Consecutive days completed
 *    - For non-daily habits: Consecutive scheduled occurrences completed
 *
 * 2. Active/Maintained Streak: A streak is considered active if:
 *    - The habit was completed on the most recent scheduled date, OR
 *    - The habit is scheduled for today and hasn't been marked yet
 *
 * 3. Broken Streak: A streak is broken when a scheduled occurrence is missed
 *
 * 4. Streak Freeze: A special feature that allows maintaining a streak despite missing
 *    a scheduled day (not implemented in base version)
 *
 * 5. Longest Streak: The highest number of consecutive completions ever achieved
 *
 * 6. Perfect Week/Month: Completing all scheduled occurrences in a week/month
 */

/**
 * Represents streak data for a habit
 */
export interface StreakData {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  lastCompletedDate: string | null;
  streakStartDate: string | null;
  perfectWeeks: number;
  perfectMonths: number;
  isStreakActive: boolean;
}

/**
 * Represents streak analytics data
 */
export interface StreakAnalytics {
  completionRate: number; // Percentage of scheduled days completed overall
  weeklyCompletionRate: number; // Percentage completed in the last 7 days
  monthlyCompletionRate: number; // Percentage completed in the last 30 days
  streakHistory: Array<{
    startDate: string;
    endDate: string;
    length: number;
  }>;
}

/**
 * Represents settings for streak calculations
 */
export interface StreakSettings {
  countTodayInStreaks: boolean; // Whether to include today in streak calculations
  maintainStreakWithinHours: number; // Grace period to maintain streak (e.g., 24 hours)
  allowStreakFreezes: boolean; // Whether streak freezes are enabled
  streakFreezesAvailable: number; // Number of streak freezes available to use
}

/**
 * Complete streak information combining basic data and analytics
 */
export interface CompleteStreakInfo {
  streakData: StreakData;
  analytics: StreakAnalytics;
  settings: StreakSettings;
}
