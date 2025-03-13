import {format, isValid, parseISO, startOfDay} from 'date-fns';
import {MMKV} from 'react-native-mmkv';
import {Habit, HabitFormData, TimePeriod} from '~/types/habit.types';
import {create} from '~/utils/store/createStore';

// Initialize MMKV storage
const storage = new MMKV({
  id: 'habits-storage',
  encryptionKey: 'yati-habits-secure-key',
});

// Store state interface
interface HabitStoreState {
  habits: Habit[];
  selectedDate: Date;
  timeFilter: TimePeriod | 'all';
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: HabitStoreState = {
  habits: [],
  selectedDate: new Date(),
  timeFilter: 'all',
  loading: false,
  error: null,
};

// Generate a unique ID for a habit
const generateId = (): string => {
  return (
    'id_' +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Load habits from storage if available
const loadInitialState = (): HabitStoreState => {
  try {
    const storedHabits = storage.getString('habits');
    if (storedHabits) {
      const parsedHabits = JSON.parse(storedHabits);

      // Validate habits array
      if (!Array.isArray(parsedHabits)) {
        console.error('Stored habits is not an array, using default state');
        return initialState;
      }

      return {
        ...initialState,
        habits: parsedHabits,
      };
    }
  } catch (error) {
    console.error('Failed to load habits from storage:', error);
  }
  return initialState;
};

// Create store with initial loaded state
const {
  useStore: useHabitStore,
  set: setHabitStore,
  getStoreSnapshot: getHabitStoreSnapshot,
} = create<HabitStoreState>('HABITS', loadInitialState());

// Helper to persist habits to storage
const persistHabits = (habits: Habit[]): void => {
  try {
    if (!Array.isArray(habits)) {
      console.error('Cannot persist habits: not an array', habits);
      return;
    }
    storage.set('habits', JSON.stringify(habits));
    console.log(`Persisted ${habits.length} habits to storage`);
  } catch (error) {
    console.error('Failed to save habits to storage:', error);
  }
};

// Helper to ensure a date is valid or return a default
const ensureValidDate = (date: Date | string | null | undefined): Date => {
  if (!date) {
    return startOfDay(new Date());
  }

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  return isValid(parsedDate) ? startOfDay(parsedDate) : startOfDay(new Date());
};

// Helper to check if a habit is complete
export const isHabitCompleted = (habit: Habit, progress: any): boolean => {
  if (!progress) {
    return false;
  }

  // For boolean type, simply use isCompleted flag
  if (habit.evaluation.type === 'boolean') {
    return progress.isCompleted;
  }

  // For numeric or timer type, compare value to target
  if (
    (habit.evaluation.type === 'numeric' ||
      habit.evaluation.type === 'timer') &&
    typeof progress.value === 'number'
  ) {
    return progress.value >= habit.evaluation.target;
  }

  // For checklist type, check if enough items are completed
  if (habit.evaluation.type === 'checklist' && progress.checklistProgress) {
    // Count completed items
    const completedCount = Object.values(progress.checklistProgress).filter(
      completed => completed,
    ).length;

    // If target is 0 or not set, consider all items must be completed
    const target =
      habit.evaluation.target ||
      (habit.evaluation.checklistItems
        ? habit.evaluation.checklistItems.length
        : 0);

    return completedCount >= target;
  }

  return false;
};

// Helper to convert form data to habit object
const convertFormToHabit = (formData: HabitFormData): Habit => {
  const now = new Date();
  const nowStr = now.toISOString();

  // Determine time period from timeOfDay or default to 'morning'
  let timePeriod: TimePeriod = 'morning';
  if (formData.frequency.timeOfDay) {
    const hours = formData.frequency.timeOfDay.getHours();
    if (hours >= 5 && hours < 12) {
      timePeriod = 'morning';
    } else if (hours >= 12 && hours < 18) {
      timePeriod = 'evening';
    } else {
      timePeriod = 'night';
    }
  }

  // Initialize checklist items if needed
  let checklistItems;
  if (
    formData.evaluation.type === 'checklist' &&
    formData.evaluation.checklistItems
  ) {
    checklistItems = formData.evaluation.checklistItems.map(item => ({
      ...item,
      completed: false,
    }));
  }

  // Create the habit object with proper typing
  const newHabit: Habit = {
    id: generateId(),
    title: formData.title,
    description: formData.description || '',
    color: formData.color,
    category: formData.categoryId,
    timePeriod,
    createdAt: nowStr,
    lastUpdatedAt: nowStr,
    frequency: {
      ...formData.frequency,
      // Ensure value is an array of strings
      value: Array.isArray(formData.frequency.value)
        ? formData.frequency.value
        : [],
    },
    evaluation: {
      ...formData.evaluation,
      checklistItems,
    },
    streak: 0,
    longestStreak: 0,
    progress: {},
  };

  // Add goal data if enabled
  if (formData.goal.enabled) {
    newHabit.goal = {
      enabled: formData.goal.enabled,
      target: formData.goal.target,
      deadline: formData.goal.deadline || null,
      progress: 0,
    };
  }

  return newHabit;
};

// Object with all habit-related actions
export const habitActions = {
  // Add a new habit
  addHabit: (formData: HabitFormData): Habit => {
    const currentState = getHabitStoreSnapshot();
    const newHabit = convertFormToHabit(formData);

    const updatedHabits = [...currentState.habits, newHabit];
    setHabitStore({
      habits: updatedHabits,
    });

    // Persist to storage
    persistHabits(updatedHabits);

    return newHabit;
  },

  // Force a refresh of the store (useful after operations)
  forceUpdate: (): void => {
    const currentState = getHabitStoreSnapshot();

    // Simply re-set the same habits to trigger a state update
    setHabitStore({
      habits: [...currentState.habits],
    });
  },

  // Delete a habit
  deleteHabit: (habitId: string): void => {
    const currentState = getHabitStoreSnapshot();
    const filteredHabits = currentState.habits.filter(
      habit => habit.id !== habitId,
    );

    setHabitStore({
      habits: filteredHabits,
    });

    // Persist to storage
    persistHabits(filteredHabits);
  },

  // Archive a habit (soft delete)
  archiveHabit: (habitId: string): void => {
    const currentState = getHabitStoreSnapshot();
    const updatedHabits = currentState.habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          archivedAt: new Date().toISOString(),
        };
      }
      return habit;
    });

    setHabitStore({
      habits: updatedHabits,
    });

    // Persist to storage
    persistHabits(updatedHabits);
  },

  // Set the selected date
  setSelectedDate: (date: Date): void => {
    const validDate = ensureValidDate(date);
    console.log(`Setting selected date to: ${format(validDate, 'yyyy-MM-dd')}`);

    setHabitStore({
      selectedDate: validDate,
    });
  },

  // Set time filter
  setTimeFilter: (filter: TimePeriod | 'all'): void => {
    setHabitStore({
      timeFilter: filter,
    });
  },

  // Toggle habit completion
  toggleHabitCompletion: (habitId: string, date: Date): void => {
    const currentState = getHabitStoreSnapshot();
    const dateStr = format(date, 'yyyy-MM-dd');

    const updatedHabits = currentState.habits.map(habit => {
      if (habit.id !== habitId) {
        return habit;
      }

      // Get current progress for this date
      const currentProgress = habit.progress?.[dateStr] || {isCompleted: false};

      // Toggle completion state
      const newProgress = {
        ...currentProgress,
        isCompleted: !currentProgress.isCompleted,
      };

      // Update habit with new progress
      return {
        ...habit,
        progress: {
          ...habit.progress,
          [dateStr]: newProgress,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    });

    setHabitStore({
      habits: updatedHabits,
    });

    // Persist to storage
    persistHabits(updatedHabits);
  },

  // Update habit value (for numeric and timer habits)
  updateHabitValue: (habitId: string, value: number, date: Date): void => {
    const currentState = getHabitStoreSnapshot();
    const dateStr = format(date, 'yyyy-MM-dd');

    const updatedHabits = currentState.habits.map(habit => {
      if (habit.id !== habitId) {
        return habit;
      }

      // Get current progress for this date
      const currentProgress = habit.progress?.[dateStr] || {
        isCompleted: false,
        value: 0,
      };

      // Check if completion state changes
      const isCompleted =
        (habit.evaluation.type === 'numeric' ||
          habit.evaluation.type === 'timer') &&
        value >= habit.evaluation.target;

      // Update progress with new value
      const newProgress = {
        ...currentProgress,
        value,
        isCompleted,
      };

      // Update habit with new progress
      return {
        ...habit,
        progress: {
          ...habit.progress,
          [dateStr]: newProgress,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    });

    setHabitStore({
      habits: updatedHabits,
    });

    // Persist to storage
    persistHabits(updatedHabits);
  },

  // Toggle a checklist item
  toggleChecklistItem: (habitId: string, itemId: string, date: Date): void => {
    const currentState = getHabitStoreSnapshot();
    const dateStr = format(date, 'yyyy-MM-dd');

    const updatedHabits = currentState.habits.map(habit => {
      if (habit.id !== habitId) {
        return habit;
      }

      // Get current progress for this date
      const currentProgress = habit.progress?.[dateStr] || {
        isCompleted: false,
        checklistProgress: {},
      };

      // Current checklist progress
      const checklistProgress = currentProgress.checklistProgress || {};

      // Toggle the specific item
      const newChecklistProgress = {
        ...checklistProgress,
        [itemId]: !checklistProgress[itemId],
      };

      // Count completed items
      const completedCount =
        Object.values(newChecklistProgress).filter(Boolean).length;

      // Check if overall completion state changes based on target
      const target =
        habit.evaluation.target ||
        (habit.evaluation.checklistItems
          ? habit.evaluation.checklistItems.length
          : 0);

      const isCompleted = completedCount >= target;

      // Update progress with new checklist state
      const newProgress = {
        ...currentProgress,
        checklistProgress: newChecklistProgress,
        isCompleted,
      };

      // Update habit with new progress
      return {
        ...habit,
        progress: {
          ...habit.progress,
          [dateStr]: newProgress,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    });

    setHabitStore({
      habits: updatedHabits,
    });

    // Persist to storage
    persistHabits(updatedHabits);
  },

  // Get habits for a specific date and time filter
  getHabitsForDate: (
    date: Date,
    timeFilter: TimePeriod | 'all' = 'all',
  ): Habit[] => {
    const currentState = getHabitStoreSnapshot();

    // Get all habits
    const allHabits = currentState.habits;

    // Filter by time period if needed
    return timeFilter === 'all'
      ? allHabits
      : allHabits.filter(habit => habit.timePeriod === timeFilter);
  },
};

export {useHabitStore};
