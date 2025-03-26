import {DateTime} from 'luxon';
import {Alert} from 'react-native';
import {Habit, HabitFormData, HabitFormErrors} from '~types/habit.types';
import {StreakConfig, StreakType} from '~types/streak.types';
import {now, toDateString, toUTCISO} from '~utils/date/dateUtils';
import {validateHabitForm} from '~utils/habit/habitValidations';
import {
  cancelHabitReminders,
  scheduleHabitReminders,
} from '~utils/reminders/reminderUtils';
import {isHabitScheduledForDate} from '~utils/scheduling/schedulingUtils';
import {saveHabits} from '~utils/storage/storageUtils';
import {calculateStreak} from '~utils/streak/streakCalculator';
import {
  getHabitStoreSnapshot,
  initialFormData,
  setHabitStore,
} from './habit.store';

// Utility to generate a unique ID for habits

const generateId = (): string =>
  'habit_' + Math.random().toString(36).substr(2, 9);

export const habitActions = {
  /**
   * Adds a new habit to the store with initial streak data.
   * @param formData Data from the habit creation form
   * @returns True if successful, false if validation fails
   */

  addHabit: (formData: HabitFormData): boolean => {
    const errors = validateHabitForm(formData);
    if (Object.keys(errors).length > 0) {
      setHabitStore({formErrors: errors});
      return false;
    }
    const newHabit: Habit = {
      id: generateId(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      color: formData.color,
      frequency: formData.frequency,
      evaluation: formData.evaluation,
      goal: formData.goal
        ? {...formData.goal, progress: formData.goal.progress || 0}
        : undefined,
      reminders: formData.reminders,
      timePeriod: formData.timePeriod || 'morning',
      progress: {},
      createdAt: toUTCISO(now()),
      streak: {
        type: 'daily', // Default streak type
        current: 0,
        longest: 0,
        history: [],
        freezeDaysAllowed: 3, // Initial freeze days
        freezeDaysUsed: 0,
        lastFreezeReset: toUTCISO(now().startOf('month')),
      },
    };

    setHabitStore(state => {
      const updatedHabits = [...state.habits, newHabit];
      saveHabits(updatedHabits);
      scheduleHabitReminders(newHabit);
      return {
        habits: updatedHabits,
        formData: initialFormData,
        formErrors: {},
      };
    });

    return true;
  },

  /**
   * Updates the form data in the store partially.
   * @param data Partial updates to the form data
   */

  updateFormData: (data: Partial<HabitFormData>) => {
    setHabitStore(state => ({
      formData: {...state.formData, ...data},
    }));
  },

  /**
   * Clears the form data and errors in the store.
   */

  clearFormData: () => {
    setHabitStore({
      formData: initialFormData,
      formErrors: {},
    });
  },

  /**
   * Sets form errors manually in the store.
   * @param errors Form validation errors
   */

  setFormErrors: (errors: HabitFormErrors) => {
    setHabitStore({formErrors: errors});
  },

  /**
   * Forces a store update to trigger re-rendering.
   */

  forceUpdate: () => {
    setHabitStore(state => ({...state}));
  },

  /**
   * Sets the selected date in the store.
   * @param date New selected date
   */

  setSelectedDate: (date: DateTime) => {
    setHabitStore({selectedDate: date});
  },

  /**
   * Sets the time filter in the store.
   * @param time New time filter
   */

  setTimeFilter: (time: 'morning' | 'evening' | 'night' | 'all') => {
    setHabitStore({timeFilter: time});
  },

  /**
   * Toggles completion status for a habit on a specific date and updates streak.
   * @param habitId ID of the habit
   * @param date Date to toggle completion for
   */

  toggleHabitCompletion: (habitId: string, date: DateTime) => {
    setHabitStore(state => {
      const habits = [...state.habits];
      const habitIndex = habits.findIndex(h => h.id === habitId);
      if (habitIndex === -1) {
        return state;
      }
      const habit = {...habits[habitIndex]};
      const dateStr = toDateString(date);
      const currentProgress = habit.progress[dateStr] || {
        date: dateStr,
        isCompleted: false,
      };

      habit.progress = {
        ...habit.progress,
        [dateStr]: {
          ...currentProgress,
          isCompleted: !currentProgress.isCompleted,
          completedAt: !currentProgress.isCompleted
            ? toUTCISO(now())
            : undefined,
        },
      };

      const streakConfig: StreakConfig = {
        type: habit.streak?.type || 'daily',
        weeklyTarget: habit.streak?.type === 'weekly' ? 1 : undefined,
        rollingMaxGap: habit.streak?.type === 'rolling' ? 7 : undefined,
        milestoneTarget: habit.streak?.type === 'milestone' ? 10 : undefined,
        milestoneReset: habit.streak?.type === 'milestone' ? false : undefined,
        initialFreezeDays: habit.streak?.freezeDaysAllowed || 3,
        freezeResetPeriod: 'monthly',
      };

      const streakResult = calculateStreak(habit, streakConfig, habit.streak);
      habit.streak = streakResult.streak;
      if (streakResult.requiresPayment) {
        Alert.alert(
          'Freeze Days Depleted',
          'You’ve used all your freeze days. Earn more by reaching a 21-day streak or purchase additional days.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Purchase',
              onPress: () => habitActions.purchaseFreezeDays(habitId, 1),
            },
          ],
        );
      }
      habits[habitIndex] = habit;
      saveHabits(habits);
      return {...state, habits};
    });
  },

  /**
   * Deletes a habit from the store and cancels its reminders.
   * @param habitId ID of the habit to delete
   */

  deleteHabit: (habitId: string) => {
    setHabitStore(state => {
      const updatedHabits = state.habits.filter(habit => habit.id !== habitId);
      saveHabits(updatedHabits);
      cancelHabitReminders(habitId);
      return {...state, habits: updatedHabits};
    });
  },

  /**

   * Updates an existing habit with partial data and recalculates streak.
   * @param habitId ID of the habit to update
   * @param updates Partial habit updates, including optional streak type
   */

  updateHabit: (
    habitId: string,
    updates: Partial<Habit> & {streakType?: StreakType},
  ) => {
    setHabitStore(state => {
      const habits = [...state.habits];
      const habitIndex = habits.findIndex(h => h.id === habitId);
      if (habitIndex === -1) {
        return state;
      }
      const updatedHabit = {...habits[habitIndex], ...updates};
      if (updates.goal) {
        updatedHabit.goal = {
          ...updates.goal,
          progress: updates.goal.progress || 0,
        };
      }

      if (updates.progress || updates.streakType) {
        const streakConfig: StreakConfig = {
          type: updates.streakType || updatedHabit.streak?.type || 'daily',
          weeklyTarget: updates.streakType === 'weekly' ? 1 : undefined,
          rollingMaxGap: updates.streakType === 'rolling' ? 7 : undefined,
          milestoneTarget: updates.streakType === 'milestone' ? 10 : undefined,
          milestoneReset:
            updates.streakType === 'milestone' ? false : undefined,
          initialFreezeDays: updatedHabit.streak?.freezeDaysAllowed || 3,
          freezeResetPeriod: 'monthly',
        };

        updatedHabit.streak = calculateStreak(
          updatedHabit,
          streakConfig,
          updatedHabit.streak,
        ).streak;
      }
      habits[habitIndex] = updatedHabit;
      saveHabits(habits);
      if (updates.reminders || updates.frequency) {
        scheduleHabitReminders(updatedHabit);
      }
      if (updates.archivedAt) {
        cancelHabitReminders(habitId);
      }
      return {...state, habits};
    });
  },

  /**

   * Purchases additional freeze days for a habit.
   * @param habitId ID of the habit
   * @param count Number of freeze days to add
   */

  purchaseFreezeDays: (habitId: string, count: number) => {
    setHabitStore(state => {
      const habits = [...state.habits];
      const habitIndex = habits.findIndex(h => h.id === habitId);
      if (habitIndex === -1) {
        return state;
      }
      const habit = {...habits[habitIndex]};
      habit.streak = {
        ...habit.streak!,
        freezeDaysAllowed: (habit.streak?.freezeDaysAllowed || 3) + count,
      };
      habits[habitIndex] = habit;
      saveHabits(habits);
      return {...state, habits};
    });
  },

  /**

   * Sets the streak type for a habit and recalculates streak.
   * @param habitId ID of the habit
   * @param streakType New streak type
   * @param customConfig Optional custom streak configuration
   */

  setStreakType: (
    habitId: string,
    streakType: StreakType,
    customConfig?: Partial<StreakConfig>,
  ) => {
    setHabitStore(state => {
      const habits = [...state.habits];
      const habitIndex = habits.findIndex(h => h.id === habitId);
      if (habitIndex === -1) {
        return state;
      }
      const habit = {...habits[habitIndex]};
      const streakConfig: StreakConfig = {
        type: streakType,
        weeklyTarget:
          streakType === 'weekly' ? customConfig?.weeklyTarget || 1 : undefined,
        rollingMaxGap:
          streakType === 'rolling'
            ? customConfig?.rollingMaxGap || 7
            : undefined,
        milestoneTarget:
          streakType === 'milestone'
            ? customConfig?.milestoneTarget || 10
            : undefined,
        milestoneReset:
          streakType === 'milestone'
            ? customConfig?.milestoneReset || false
            : undefined,
        initialFreezeDays: habit.streak?.freezeDaysAllowed || 3,
        freezeResetPeriod: 'monthly',
      };
      habit.streak = calculateStreak(habit, streakConfig, habit.streak).streak;
      habits[habitIndex] = habit;
      saveHabits(habits);
      return {...state, habits};
    });
  },

  /**
   * Gets habits scheduled for a specific date and time period.
   * @param date Date to filter habits for
   * @param timePeriod Time period to filter by
   * @returns Array of filtered habits
   */

  getHabitsForDate: (
    date: DateTime,
    timePeriod: 'morning' | 'evening' | 'night' | 'all',
  ) => {
    const state = getHabitStoreSnapshot();

    return state.habits.filter(habit => {
      const isScheduled = isHabitScheduledForDate(habit, date);
      if (!isScheduled) {
        return false;
      }
      return timePeriod === 'all' || habit.timePeriod === timePeriod;
    });
  },

  /**
   * Checks if a habit is completed on a specific date.
   * @param habit Habit to check
   * @param progress Progress data for the date
   * @returns True if completed, false otherwise
   */
  isHabitCompleted: (habit: Habit, progress: any) => {
    return progress?.isCompleted || false;
  },
};
