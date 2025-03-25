// utils/storage/storage.ts
import {MMKV} from 'react-native-mmkv';
import {fromISO, toJSDate} from '~/utils/date/dateUtils';
import {Habit, HabitFormData} from '~types/habit.types';

// Initialize MMKV instance
const storage = new MMKV();

// Key for storing habits in MMKV
const HABITS_KEY = 'habits';

// Function to save habits to MMKV
export const saveHabits = (habits: Habit[]): void => {
  try {
    const habitsJson = JSON.stringify(habits);
    storage.set(HABITS_KEY, habitsJson);
    console.log('Habits saved to MMKV:', habitsJson);
  } catch (error) {
    console.error('Error saving habits to MMKV:', error);
  }
};

// Function to load habits from MMKV
export const loadHabits = (): Habit[] => {
  try {
    const habitsJson = storage.getString(HABITS_KEY);
    if (habitsJson) {
      const habits = JSON.parse(habitsJson) as Habit[];
      // Convert timeOfDay back to Date objects
      habits.forEach(habit => {
        if (
          habit.frequency.timeOfDay &&
          typeof habit.frequency.timeOfDay === 'string'
        ) {
          const dt = fromISO(habit.frequency.timeOfDay, 'utc');
          if (dt.isValid) {
            habit.frequency.timeOfDay = toJSDate(dt);
          } else {
            console.warn(
              'Invalid timeOfDay ISO string:',
              habit.frequency.timeOfDay,
            );
            habit.frequency.timeOfDay = null;
          }
        }
        // Convert goal.deadline back to Date object if it exists
        if (habit.goal?.deadline && typeof habit.goal.deadline === 'string') {
          const dt = fromISO(habit.goal.deadline, 'utc');
          if (dt.isValid) {
            habit.goal.deadline = toJSDate(dt);
          } else {
            console.warn(
              'Invalid goal.deadline ISO string:',
              habit.goal.deadline,
            );
            habit.goal.deadline = null;
          }
        }
        // Validate reminders (already strings, just ensure they are valid ISO strings)
        habit.reminders = habit.reminders
          .map(reminder => {
            if (typeof reminder === 'string') {
              const dt = fromISO(reminder, 'utc');
              if (dt.isValid) {
                return reminder; // Keep as string
              } else {
                console.warn(
                  'Invalid reminder ISO string in loadHabits:',
                  reminder,
                );
                return null;
              }
            }
            console.warn('Unexpected reminder type in loadHabits:', reminder);
            return null;
          })
          .filter((reminder): reminder is string => reminder !== null);
      });
      console.log('Habits loaded from MMKV:', habits);
      return habits;
    }
    console.log('No habits found in MMKV, returning empty array');
    return [];
  } catch (error) {
    console.error('Error loading habits from MMKV:', error);
    return [];
  }
};

// Function to clear habits from MMKV (optional, for debugging or reset)
export const clearHabits = (): void => {
  try {
    storage.delete(HABITS_KEY);
    console.log('Habits cleared from MMKV');
  } catch (error) {
    console.error('Error clearing habits from MMKV:', error);
  }
};

// Function to convert a Habit to HabitFormData (for editing)
export const habitToFormData = (habit: Habit): HabitFormData => {
  return {
    id: habit.id,
    title: habit.title,
    description: habit.description,
    category: habit.category,
    color: habit.color,
    frequency: habit.frequency,
    evaluation: habit.evaluation,
    goal: habit.goal,
    reminders: habit.reminders, // Already string[], no conversion needed
    timePeriod: habit.timePeriod,
  };
};
