// utils/streak/streakIntegration.ts
import {getHabitStoreSnapshot, habitActions} from '~/state/habit.store';
import {streakActions} from '~/state/streak.store';
import {toDateString} from '~/utils/date/dateUtils';

/**
 * Wrapper for habit actions that also updates streak data.
 * This ensures streak data is always kept in sync with habit updates.
 */
export const habitStreakActions = {
  /**
   * Toggles a habit's completion state and updates streak data
   */
  toggleHabitCompletion: (habitId: string, date: Date = new Date()) => {
    // Get the updated habit
    const habits = getHabitStoreSnapshot().habits;
    const habit = habits.find(h => h.id === habitId);

    if (habit) {
      const dateStr = toDateString(date);
      const isCompleted = habit.progress[dateStr]?.isCompleted || false;

      // Update streak data
      streakActions.updateStreakAfterCompletion(habit, dateStr, isCompleted);
    }
  },

  /**
   * Updates a habit's numeric value and updates streak data if completion state changes
   */
  updateHabitValue: (
    habitId: string,
    value: number,
    date: Date = new Date(),
  ) => {
    // First get the original completion state
    const habits = getHabitStoreSnapshot().habits;
    const habit = habits.find(h => h.id === habitId);

    if (!habit) {
      return;
    }

    const dateStr = toDateString(date);
    const wasCompleted = habit.progress[dateStr]?.isCompleted || false;

    // Update the habit
    habitActions.updateHabitValue(habitId, value, date);

    // Get the updated habit
    const updatedHabits = getHabitStoreSnapshot().habits;
    const updatedHabit = updatedHabits.find(h => h.id === habitId);

    if (updatedHabit) {
      const isNowCompleted =
        updatedHabit.progress[dateStr]?.isCompleted || false;

      // Only update streak data if completion state changed
      if (wasCompleted !== isNowCompleted) {
        streakActions.updateStreakAfterCompletion(
          updatedHabit,
          dateStr,
          isNowCompleted,
        );
      }
    }
  },

  /**
   * Toggles a checklist item and updates streak data if completion state changes
   */
  toggleChecklistItem: (
    habitId: string,
    itemId: string,
    date: Date = new Date(),
  ) => {
    // First get the original completion state
    const habits = getHabitStoreSnapshot().habits;
    const habit = habits.find(h => h.id === habitId);

    if (!habit) {
      return;
    }

    const dateStr = toDateString(date);
    const wasCompleted = habit.progress[dateStr]?.isCompleted || false;

    // Update the checklist item
    habitActions.toggleChecklistItem(habitId, itemId, date);

    // Get the updated habit
    const updatedHabits = getHabitStoreSnapshot().habits;
    const updatedHabit = updatedHabits.find(h => h.id === habitId);

    if (updatedHabit) {
      const isNowCompleted =
        updatedHabit.progress[dateStr]?.isCompleted || false;

      // Only update streak data if completion state changed
      if (wasCompleted !== isNowCompleted) {
        streakActions.updateStreakAfterCompletion(
          updatedHabit,
          dateStr,
          isNowCompleted,
        );
      }
    }
  },

  /**
   * Adds a new habit and initializes streak data
   */
  addHabit: (formData: any) => {
    const newHabit = habitActions.addHabit(formData);

    // Initialize streak data for the new habit
    streakActions.initializeStreak(newHabit.id);

    return newHabit;
  },

  /**
   * Deletes a habit (original action, no streak update needed)
   */
  deleteHabit: habitActions.deleteHabit,

  /**
   * Archives a habit (original action, no streak update needed)
   */
  archiveHabit: habitActions.archiveHabit,

  /**
   * Sets the selected date (original action, no streak update needed)
   */
  setSelectedDate: habitActions.setSelectedDate,

  /**
   * Sets the time filter (original action, no streak update needed)
   */
  setTimeFilter: habitActions.setTimeFilter,

  /**
   * Forces a refresh of all habits and recalculates all streaks
   */
  refreshHabits: () => {
    habitActions.forceUpdate();

    // Recalculate streaks for all habits
    const habits = getHabitStoreSnapshot().habits;
    streakActions.recalculateAllStreaks(habits);
  },
};
