import {subDays} from 'date-fns';
import {
  getHabitStoreSnapshot,
  persistHabits,
  setHabitStore,
} from '~state/habit.store';
import {streakActions} from '~state/streak.store';
import {DailyProgress, Habit, HabitCategory} from '~types/habit.types';
import {getLocalToday, toDateString} from './date/dateUtils';

/**
 * Creates a test habit with completions for the past 5 days
 * @param {string} title The title of the habit
 * @param {string} categoryId The category ID for the habit
 * @param {string} color The color for the habit
 * @returns {Habit} A habit object with 5 days of completions
 */
export const createTestHabitWithStreak = (
  title = 'Test Streak Habit',
  categoryId = 'health',
  color = '#FF6B6B',
) => {
  // Get dates for the past 5 days
  const today = getLocalToday();
  const dates = [];

  for (let i = 0; i < 5; i++) {
    dates.push(subDays(today, i));
  }

  const progress: Record<string, DailyProgress> = {};

  // Only mark the previous 5 days as complete, NOT today
  for (let i = 1; i <= 5; i++) {
    // Start from 1 to skip today
    const date = subDays(today, i);
    const dateStr = toDateString(date);

    // Create a valid DailyProgress object
    progress[dateStr] = {
      date: dateStr,
      isCompleted: true,
    };
  }

  // Create the new habit with progress data
  const habitId = '8123jnasdasganbd127cab'; // Reusing the existing ID generator
  const now = new Date();
  const nowStr = now.toISOString();

  // Go back 6 days for creation date (one day before first completion)
  const createdAt = subDays(today, 6).toISOString();

  const newHabit: Habit = {
    id: habitId,
    title,
    description: 'A test habit to verify streak calculation',
    color,
    category: categoryId as HabitCategory,
    timePeriod: 'morning',
    createdAt,
    lastUpdatedAt: nowStr,
    frequency: {
      type: 'daily',
      value: [],
      timeOfDay: new Date(now.setHours(9, 0, 0, 0)), // 9:00 AM
    },
    evaluation: {
      type: 'boolean',
      target: 1,
      unit: '',
    },
    streak: 0,
    longestStreak: 0,
    progress,
  };

  // Add the habit to the store
  const currentState = getHabitStoreSnapshot();
  const updatedHabits = [...currentState.habits, newHabit];

  setHabitStore({
    habits: updatedHabits,
  });

  // Persist to storage
  persistHabits(updatedHabits);

  // Initialize streak
  streakActions.initializeStreak(habitId);

  // Calculate streak values
  const updatedHabit = getHabitStoreSnapshot().habits.find(
    h => h.id === habitId,
  );
  if (updatedHabit) {
    streakActions.recalculateStreakForHabit(updatedHabit);
  }

  console.log(`Created test habit "${title}" with 5 days of completions`);
  console.log('Check the streak value - it should be 5!');

  return updatedHabit || newHabit;
};
