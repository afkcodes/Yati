import {DateTime} from 'luxon';
import {Habit, HabitFormData, HabitFormErrors} from '~types/habit.types';
import {now, toDateString, toUTCISO} from '~utils/date/dateUtils';
import {validateHabitForm} from '~utils/habit/habitValidations';
import {
  cancelHabitReminders,
  scheduleHabitReminders,
} from '~utils/reminders/reminderUtils';
import {isHabitScheduledForDate} from '~utils/scheduling/schedulingUtils';
import {saveHabits} from '~utils/storage/storageUtils';
import {
  getHabitStoreSnapshot,
  initialFormData,
  setHabitStore,
} from './habit.store';

// Helper to generate unique IDs (simple implementation, replace with UUID if needed)
const generateId = (): string => {
  return 'habit_' + Math.random().toString(36).substr(2, 9);
};

export const habitActions = {
  // Add a new habit
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
      reminders: formData.reminders, // Already string[]
      timePeriod: formData.timePeriod || 'morning', // Default to 'morning'
      progress: {},
      createdAt: toUTCISO(now()), // Store as ISO string in UTC
      streak: {current: 0, longest: 0},
    };

    setHabitStore(state => {
      const updatedHabits = [...state.habits, newHabit];
      // Persist the updated habits to MMKV
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

  // Update form data partially
  updateFormData: (data: Partial<HabitFormData>) => {
    setHabitStore(state => ({
      formData: {...state.formData, ...data},
    }));
  },

  // Clear form data
  clearFormData: () => {
    setHabitStore({
      formData: initialFormData,
      formErrors: {},
    });
  },

  // Set form errors manually
  setFormErrors: (errors: HabitFormErrors) => {
    setHabitStore({formErrors: errors});
  },

  // Force update (for refresh)
  forceUpdate: () => {
    setHabitStore(state => ({...state}));
  },

  // Set selected date
  setSelectedDate: (date: DateTime) => {
    setHabitStore({selectedDate: date});
  },

  // Set time filter
  setTimeFilter: (time: 'morning' | 'evening' | 'night' | 'all') => {
    setHabitStore({timeFilter: time});
  },

  // Toggle habit completion
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

      habits[habitIndex] = habit;
      // Persist the updated habits to MMKV
      saveHabits(habits);
      return {...state, habits};
    });
  },

  // Delete a habit
  deleteHabit: (habitId: string) => {
    setHabitStore(state => {
      const updatedHabits = state.habits.filter(habit => habit.id !== habitId);
      // Persist the updated habits to MMKV
      saveHabits(updatedHabits);
      cancelHabitReminders(habitId);
      return {...state, habits: updatedHabits};
    });
  },

  // Update a habit (e.g., for future editing functionality)
  updateHabit: (habitId: string, updates: Partial<Habit>) => {
    setHabitStore(state => {
      const habits = [...state.habits];
      const habitIndex = habits.findIndex(h => h.id === habitId);
      if (habitIndex === -1) {
        return state;
      }

      // Ensure progress is set if goal is updated
      const updatedHabit = {...habits[habitIndex], ...updates};
      if (updates.goal) {
        updatedHabit.goal = {
          ...updates.goal,
          progress: updates.goal.progress || 0,
        };
      }

      habits[habitIndex] = updatedHabit;
      // Persist the updated habits to MMKV
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

  // Get habits for a specific date and time period
  getHabitsForDate: (
    date: DateTime,
    timePeriod: 'morning' | 'evening' | 'night' | 'all',
  ) => {
    const state = getHabitStoreSnapshot();
    const filteredHabits = state.habits.filter(habit => {
      // Check if the habit is scheduled for the given date
      const isScheduled = isHabitScheduledForDate(habit, date);
      console.log(
        `Habit "${habit.title}" scheduled for ${date.toISO()}: ${isScheduled}, createdAt: ${habit.createdAt}, frequency: ${JSON.stringify(habit.frequency)}`,
      );

      if (!isScheduled) {
        console.log(
          `Habit "${habit.title}" filtered out: not scheduled for ${date.toISO()}`,
        );
        return false;
      }

      // Filter by time period
      if (timePeriod === 'all') {
        console.log(`Habit "${habit.title}" included: timeFilter is 'all'`);
        return true;
      }

      const matchesTimePeriod = habit.timePeriod === timePeriod;
      console.log(
        `Habit "${habit.title}" timePeriod: ${habit.timePeriod}, filter: ${timePeriod}, matches: ${matchesTimePeriod}`,
      );

      if (!matchesTimePeriod) {
        console.log(
          `Habit "${habit.title}" filtered out: timePeriod ${habit.timePeriod} does not match filter ${timePeriod}`,
        );
      }

      return matchesTimePeriod;
    });
    console.log(
      `Filtered habits for ${date.toISO()} and timePeriod ${timePeriod}:`,
      filteredHabits.map(h => h.title),
    );
    return filteredHabits;
  },

  // Check if a habit is completed on a specific date
  isHabitCompleted: (habit: Habit, progress: any) => {
    return progress?.isCompleted || false;
  },
};
