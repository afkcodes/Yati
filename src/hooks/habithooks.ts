// utils/habit/habitHooks.ts
import {useHabitStore} from 'App';
import {format} from 'date-fns';
import {useEffect, useState} from 'react';
import {Habit} from '~/types/habit.types';
import {habitActions} from '~state/habit.store';
import {
  getHabitChecklistProgress,
  getHabitCompletionPercentage,
  getHabitNumericValue,
  isHabitActiveOnDate,
} from '~utils/habit/habitUtils';

/**
 * Hook to get habits for a specific date, filtered by time period
 * @param date The date to get habits for (defaults to selected date from store)
 * @param timePeriod The time period to filter by (defaults to 'all')
 * @returns Array of habits matching the criteria
 */
export const useHabitsForDate = (
  date?: Date,
  timePeriod: 'all' | string = 'all',
) => {
  const [{habits, selectedDate: storeDate}] = useHabitStore();
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);

  const targetDate = date || storeDate || new Date();

  useEffect(() => {
    // Get habits from the store filtered by date and time period
    const habitsForDate = habitActions.getHabitsForDate(targetDate, timePeriod);
    setFilteredHabits(habitsForDate);
  }, [habits, targetDate, timePeriod, storeDate]);

  return filteredHabits;
};

/**
 * Hook to get detailed information about a habit's progress for a specific date
 * @param habitId The ID of the habit
 * @param date The date to check (defaults to selected date from store)
 * @returns Object with progress details
 */
export const useHabitProgress = (habitId: string, date?: Date) => {
  const [{habits, selectedDate: storeDate}] = useHabitStore();
  const [progressDetails, setProgressDetails] = useState({
    habit: null as Habit | null,
    isCompleted: false,
    numericValue: 0,
    completionPercentage: 0,
    checklistProgress: {} as {[itemId: string]: boolean},
    isActiveOnDate: false,
  });

  const targetDate = date || storeDate || new Date();
  const dateStr = format(targetDate, 'yyyy-MM-dd');

  useEffect(() => {
    // Find the habit by ID
    const habit = habits.find(h => h.id === habitId);

    if (habit) {
      setProgressDetails({
        habit,
        isCompleted: habit.progress?.[dateStr]?.isCompleted || false,
        numericValue: getHabitNumericValue(habit, targetDate),
        completionPercentage: getHabitCompletionPercentage(habit, targetDate),
        checklistProgress: getHabitChecklistProgress(habit, targetDate),
        isActiveOnDate: isHabitActiveOnDate(habit, targetDate),
      });
    } else {
      // Reset if habit not found
      setProgressDetails({
        habit: null,
        isCompleted: false,
        numericValue: 0,
        completionPercentage: 0,
        checklistProgress: {},
        isActiveOnDate: false,
      });
    }
  }, [habits, habitId, targetDate, dateStr]);

  return progressDetails;
};

/**
 * Hook to handle the logic for completing a habit
 * @param habitId The ID of the habit
 * @param date The date to update (defaults to selected date from store)
 * @returns Object with functions and state for completing the habit
 */
export const useHabitCompletion = (habitId: string, date?: Date) => {
  const [{habits, selectedDate: storeDate}] = useHabitStore();
  const targetDate = date || storeDate || new Date();

  // Find the habit
  const habit = habits.find(h => h.id === habitId);

  // Functions for different habit types
  const toggleBooleanHabit = () => {
    if (habit) {
      habitActions.toggleHabitCompletion(habitId, targetDate);
    }
  };

  const updateNumericValue = (value: number) => {
    if (habit) {
      habitActions.updateHabitValue(habitId, value, targetDate);
    }
  };

  const toggleChecklistItem = (itemId: string) => {
    if (habit) {
      habitActions.toggleChecklistItem(habitId, itemId, targetDate);
    }
  };

  return {
    habit,
    toggleBooleanHabit,
    updateNumericValue,
    toggleChecklistItem,
  };
};
