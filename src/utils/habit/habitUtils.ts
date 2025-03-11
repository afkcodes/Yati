// utils/habit/habitUtils.ts
import {format} from 'date-fns';
import {habitActions} from '~/state/habit.store';
import {Habit} from '~/types/habit.types';

/**
 * Checks if a habit is completed on a specific date
 * @param habit The habit to check
 * @param date The date to check (defaults to today)
 * @returns Whether the habit is completed on the date
 */
export const isHabitCompleted = (
  habit: Habit,
  date: Date = new Date(),
): boolean => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return habit.progress?.[dateStr]?.isCompleted || false;
};

/**
 * Gets the current progress value for a numeric or timer habit
 * @param habit The habit to check
 * @param date The date to check (defaults to today)
 * @returns The current numeric value
 */
export const getHabitNumericValue = (
  habit: Habit,
  date: Date = new Date(),
): number => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return habit.progress?.[dateStr]?.value || 0;
};

/**
 * Gets the current checklist progress for a checklist habit
 * @param habit The habit to check
 * @param date The date to check (defaults to today)
 * @returns Object mapping item IDs to completion status
 */
export const getHabitChecklistProgress = (
  habit: Habit,
  date: Date = new Date(),
): {[itemId: string]: boolean} => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return habit.progress?.[dateStr]?.checklistProgress || {};
};

/**
 * Calculates the completion percentage for a habit
 * @param habit The habit to check
 * @param date The date to check (defaults to today)
 * @returns A number between 0-1 representing completion percentage
 */
export const getHabitCompletionPercentage = (
  habit: Habit,
  date: Date = new Date(),
): number => {
  if (isHabitCompleted(habit, date)) {
    return 1;
  }

  const dateStr = format(date, 'yyyy-MM-dd');
  const progress = habit.progress?.[dateStr];

  if (!progress) {
    return 0;
  }

  switch (habit.evaluation.type) {
    case 'boolean':
      return progress.isCompleted ? 1 : 0;

    case 'numeric':
    case 'timer':
      const value = progress.value || 0;
      const target = habit.evaluation.target;
      return Math.min(value / target, 1);

    case 'checklist':
      if (!progress.checklistProgress || !habit.evaluation.checklistItems) {
        return 0;
      }

      const completed = Object.values(progress.checklistProgress).filter(
        Boolean,
      ).length;
      const total = habit.evaluation.checklistItems.length;

      if (total === 0) {
        return 0;
      }
      return Math.min(completed / total, 1);

    default:
      return 0;
  }
};

/**
 * Determines if a habit should be active on a specific date
 * @param habit The habit to check
 * @param date The date to check
 * @returns Whether the habit is active on the date
 */
export const isHabitActiveOnDate = (habit: Habit, date: Date): boolean => {
  // Check frequency type
  const {type, value} = habit.frequency;

  if (type === 'daily') {
    return true;
  }

  if (type === 'hourly') {
    return true;
  }

  if (type === 'weekly') {
    // Check if the day of week matches
    const day = format(date, 'EEE').toLowerCase();
    return value.includes(day);
  }

  if (type === 'monthly') {
    // Check if the day of month matches
    const dayOfMonth = format(date, 'd');
    return value.includes(dayOfMonth);
  }

  return false;
};

/**
 * Toggles the completion of a habit based on its type
 * @param habit The habit to toggle
 * @param date The date to toggle for (defaults to today)
 * @param stateNavigator Optional state navigator for navigation
 */
export const toggleHabitCompletion = (
  habit: Habit,
  date: Date = new Date(),
  stateNavigator?: any,
): void => {
  switch (habit.evaluation.type) {
    case 'boolean':
      // For boolean habits, simply toggle completion
      habitActions.toggleHabitCompletion(habit.id, date);
      break;

    case 'numeric':
    case 'timer':
    case 'checklist':
      // For other types, navigate to details screen
      if (stateNavigator) {
        stateNavigator.navigate('habitDetail', {id: habit.id});
      }
      break;

    default:
      // Default case, just toggle
      habitActions.toggleHabitCompletion(habit.id, date);
  }
};

/**
 * Gets a human-readable description of the habit's frequency
 * @param habit The habit
 * @returns A human-readable string describing the frequency
 */
export const getFrequencyDescription = (habit: Habit): string => {
  const {type, value, timeOfDay} = habit.frequency;

  let frequencyText = '';

  switch (type) {
    case 'daily':
      frequencyText = 'Every day';
      break;

    case 'hourly':
      frequencyText = `Every ${habit.frequency.interval || 1} hour${
        habit.frequency.interval !== 1 ? 's' : ''
      }`;
      break;

    case 'weekly':
      if (value.length === 7) {
        frequencyText = 'Every day of the week';
      } else {
        const days = value
          .map(day => day.charAt(0).toUpperCase() + day.slice(1))
          .join(', ');
        frequencyText = `Weekly on ${days}`;
      }
      break;

    case 'monthly':
      if (value.length === 1) {
        frequencyText = `Monthly on the ${value[0]}${getOrdinalSuffix(
          parseInt(value[0], 10),
        )}`;
      } else {
        frequencyText = `Monthly on ${value.length} dates`;
      }
      break;

    default:
      frequencyText = 'Custom schedule';
  }

  // Add time of day if available
  if (timeOfDay) {
    frequencyText += ` at ${format(timeOfDay, 'h:mm a')}`;
  }

  return frequencyText;
};

/**
 * Gets the ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 * @param n The number
 * @returns The ordinal suffix
 */
export const getOrdinalSuffix = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};
