// utils/store/habitStore.ts
import {format, isValid, parseISO, startOfDay, subDays} from 'date-fns';
import {MMKV} from 'react-native-mmkv';
import {
  ChecklistItem,
  DailyProgress,
  Habit,
  HabitCategory,
  HabitFormData,
  HabitStats,
  TimePeriod,
} from '~/types/habit.types';
import {create} from '~utils/store/createStore';

const generateId = (): string => {
  return (
    'id_' +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

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

// Helper to persist habits to storagex
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

/**
 * Helper to ensure a date is valid or return a default
 */
const ensureValidDate = (date: Date | string | null | undefined): Date => {
  if (!date) {
    return startOfDay(new Date());
  }

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  return isValid(parsedDate) ? startOfDay(parsedDate) : startOfDay(new Date());
};

/**
 * Checks if a habit is active on a specific date
 */
const isHabitActiveOnDate = (habit: Habit, date: Date): boolean => {
  if (!habit || !date) {
    console.warn('Invalid habit or date passed to isHabitActiveOnDate');
    return false;
  }

  // Convert date to start of day for consistent comparison
  const targetDate = startOfDay(date);

  // If the habit was created after the selected date, it shouldn't be active
  const createdDate = ensureValidDate(habit.createdAt);
  if (createdDate > targetDate) {
    return false;
  }

  // If the habit is archived and was archived before or on the selected date, it shouldn't be active
  if (habit.archivedAt) {
    const archivedDate = ensureValidDate(habit.archivedAt);
    if (archivedDate <= targetDate) {
      return false;
    }
  }

  // Check frequency
  const {type, value} = habit.frequency;

  if (type === 'daily') {
    // If it has an interval, check if today is within the interval
    if (habit.frequency.interval && habit.frequency.interval > 1) {
      // Implement interval logic here if needed
      // For now, assume daily is always active
    }
    return true;
  }

  if (type === 'hourly') {
    return true; // Hourly habits are active every day
  }

  if (type === 'weekly') {
    // Check if the day of week matches
    const dayOfWeek = format(targetDate, 'EEE').toLowerCase();
    return Array.isArray(value) && value.includes(dayOfWeek);
  }

  if (type === 'monthly') {
    // Check if the day of month matches
    const dayOfMonth = format(targetDate, 'd');
    return Array.isArray(value) && value.includes(dayOfMonth);
  }

  return false;
};

// Helper to get or create progress for a specific date
// const getOrCreateProgress = (habit: Habit, date: Date): DailyProgress => {
//   const dateStr = format(date, 'yyyy-MM-dd');

//   if (habit.progress && habit.progress[dateStr]) {
//     return habit.progress[dateStr];
//   }

//   // Create a new progress entry
//   const newProgress: DailyProgress = {
//     date: dateStr,
//     isCompleted: false,
//   };

//   // Initialize specific fields based on evaluation type
//   if (
//     habit.evaluation.type === 'numeric' ||
//     habit.evaluation.type === 'timer'
//   ) {
//     newProgress.value = 0;
//   }

//   if (
//     habit.evaluation.type === 'checklist' &&
//     habit.evaluation.checklistItems
//   ) {
//     newProgress.checklistProgress = {};
//     habit.evaluation.checklistItems.forEach(item => {
//       if (newProgress.checklistProgress) {
//         newProgress.checklistProgress[item.id] = false;
//       }
//     });
//   }

//   return newProgress;
// };

// Helper to calculate streak
// const calculateStreak = (habit: Habit): number => {
//   let streak = 0;
//   let currentDate = new Date();
//   let consecutive = true;

//   // Go back day by day and check if habit was completed
//   while (consecutive) {
//     const dateStr = format(currentDate, 'yyyy-MM-dd');

//     // If habit is active on this date and has progress
//     if (
//       isHabitActiveOnDate(habit, currentDate) &&
//       habit.progress &&
//       habit.progress[dateStr]
//     ) {
//       if (habit.progress[dateStr].isCompleted) {
//         streak++;
//         currentDate = subDays(currentDate, 1);
//       } else {
//         consecutive = false;
//       }
//     }
//     // If habit should be active but has no progress entry, the streak is broken
//     else if (isHabitActiveOnDate(habit, currentDate)) {
//       consecutive = false;
//     }
//     // If habit is not active on this date, skip to the previous day
//     else {
//       currentDate = subDays(currentDate, 1);
//     }

//     // Safety check - don't go back further than habit creation date
//     const createdDate = parseISO(habit.createdAt);
//     if (createdDate > currentDate) {
//       consecutive = false;
//     }

//     // Additional safety check to prevent infinite loops
//     if (streak > 1000) {
//       console.warn(
//         `Streak calculation exceeded 1000 days for habit '${habit.title}', stopping`,
//       );
//       break;
//     }
//   }

//   return streak;
// };

// Helper to update all streaks for habits
const updateAllStreaks = (habits: Habit[]): Habit[] => {
  if (!Array.isArray(habits)) {
    console.error('updateAllStreaks received non-array', habits);
    return [];
  }

  return habits.map(habit => {
    const streak = calculateStreak(habit);
    const longestStreak = Math.max(habit.longestStreak || 0, streak);

    return {
      ...habit,
      streak,
      longestStreak,
    };
  });
};

// Helper function to calculate completion status for a habit
// export const isHabitCompleted = (
//   habit: Habit,
//   progress: DailyProgress,
// ): boolean => {
//   if (!habit || !progress) {
//     return false;
//   }

//   const {type, target} = habit.evaluation;

//   if (type === 'boolean') {
//     return Boolean(progress.isCompleted);
//   }

//   if (type === 'numeric' || type === 'timer') {
//     return (progress.value || 0) >= target;
//   }

//   if (type === 'checklist' && habit.evaluation.checklistItems) {
//     // Count completed checklist items
//     const completedItems = Object.values(
//       progress.checklistProgress || {},
//     ).filter(Boolean).length;
//     return completedItems >= target;
//   }

//   return false;
// };

// Helper to convert form data to habit
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
  let checklistItems: ChecklistItem[] | undefined;
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

// Calculate habit statistics
export const calculateHabitStats = (habits: Habit[]): HabitStats => {
  if (!Array.isArray(habits)) {
    console.error('calculateHabitStats received non-array', habits);
    return {
      totalHabits: 0,
      completedToday: 0,
      currentStreaks: {},
      longestStreaks: {},
      categoryBreakdown: {},
      completionRate: 0,
    };
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Initialize stats with the correct type
  const stats: HabitStats = {
    totalHabits: habits.length,
    completedToday: 0,
    currentStreaks: {},
    longestStreaks: {},
    categoryBreakdown: {},
    completionRate: 0,
  };

  // Only count non-archived habits
  const activeHabits = habits.filter(h => !h.archivedAt);

  // Count categories
  activeHabits.forEach(habit => {
    if (!habit.category) {
      return;
    }

    // Make sure we're using the right category type
    const category = habit.category as HabitCategory;

    // Update category breakdown
    stats.categoryBreakdown[category] =
      (stats.categoryBreakdown[category] || 0) + 1;

    // Store streaks
    stats.currentStreaks[habit.id] = habit.streak;
    stats.longestStreaks[habit.id] = habit.longestStreak;

    // Count today's completions
    if (
      habit.progress &&
      habit.progress[todayStr] &&
      habit.progress[todayStr].isCompleted
    ) {
      stats.completedToday++;
    }
  });

  // Calculate completion rate
  const totalActive = activeHabits.length;
  stats.completionRate =
    totalActive > 0 ? stats.completedToday / totalActive : 0;

  return stats;
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

  /**
   * Preloads necessary data for the app to initialize smoothly
   * This helps prevent UI jank during navigation
   */
  preloadData: async (): Promise<void> => {
    return new Promise<void>(resolve => {
      // Get the current state
      const currentState = getHabitStoreSnapshot();

      try {
        // Force an initial load of habits if needed
        if (!currentState.habits || currentState.habits.length === 0) {
          const storedHabits = storage.getString('habits');
          if (storedHabits) {
            const parsedHabits = JSON.parse(storedHabits);
            if (Array.isArray(parsedHabits)) {
              // Pre-calculate streaks for smoother initial render
              const habitsWithUpdatedStreaks = updateAllStreaks(parsedHabits);

              // Set habits in store
              setHabitStore({
                habits: habitsWithUpdatedStreaks,
                loading: false,
              });
            }
          }
        }

        // Initialize anything else needed for a smooth experience
        // e.g., preferences, settings, etc.

        // Small timeout to ensure state updates are processed
        setTimeout(() => resolve(), 50);
      } catch (error) {
        console.error('Error preloading data:', error);
        resolve(); // Resolve anyway to not block navigation
      }
    });
  },

  // Update an existing habit
  updateHabit: (habitId: string, formData: Partial<HabitFormData>): void => {
    const currentState = getHabitStoreSnapshot();
    const updatedHabits = currentState.habits.map(habit => {
      if (habit.id === habitId) {
        // Create a properly typed updated habit
        const updatedHabit: Habit = {
          ...habit,
          lastUpdatedAt: new Date().toISOString(),
        };

        // Update fields from formData
        if (formData.title !== undefined) {
          updatedHabit.title = formData.title;
        }
        if (formData.description !== undefined) {
          updatedHabit.description = formData.description;
        }
        if (formData.color !== undefined) {
          updatedHabit.color = formData.color;
        }
        if (formData.categoryId !== undefined) {
          updatedHabit.category = formData.categoryId;
        }
        if (formData.frequency !== undefined) {
          updatedHabit.frequency = {
            ...updatedHabit.frequency,
            ...formData.frequency,
            // Ensure value is always an array
            value: Array.isArray(formData.frequency.value)
              ? formData.frequency.value
              : updatedHabit.frequency.value,
          };
        }
        if (formData.evaluation !== undefined) {
          updatedHabit.evaluation = {
            ...updatedHabit.evaluation,
            ...formData.evaluation,
          };
        }
        if (formData.goal !== undefined) {
          if (formData.goal.enabled) {
            updatedHabit.goal = {
              enabled: formData.goal.enabled,
              target: formData.goal.target,
              deadline: formData.goal.deadline || null,
              progress: updatedHabit.goal?.progress || 0,
            };
          } else {
            delete updatedHabit.goal;
          }
        }

        return updatedHabit;
      }
      return habit;
    });

    setHabitStore({
      habits: updatedHabits,
    });

    // Persist to storage
    persistHabits(updatedHabits);
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

  forceUpdate: (): void => {
    const currentState = getHabitStoreSnapshot();

    // Simply re-set the same habits to trigger a state update
    setHabitStore({
      habits: [...currentState.habits],
    });
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

  // Restore an archived habit
  restoreHabit: (habitId: string): void => {
    const currentState = getHabitStoreSnapshot();
    const updatedHabits = currentState.habits.map(habit => {
      if (habit.id === habitId) {
        // Create a new habit object without the archivedAt property
        const habitWithoutArchived = {...habit};
        // Delete the archivedAt property
        delete habitWithoutArchived.archivedAt;

        return {
          ...habitWithoutArchived,
          lastUpdatedAt: new Date().toISOString(),
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

  // Toggle boolean habit completion
  toggleHabitCompletion: (habitId: string, date: Date = new Date()): void => {
    // Ensure valid date
    const validDate = ensureValidDate(date);
    const dateStr = format(validDate, 'yyyy-MM-dd');

    const currentState = getHabitStoreSnapshot();

    // Find the habit first to confirm it exists
    const habitIndex = currentState.habits.findIndex(h => h.id === habitId);
    if (habitIndex === -1) {
      console.error(
        `Cannot toggle habit completion: Habit with ID ${habitId} not found`,
      );
      return;
    }

    console.log(`Toggling completion for habit ID ${habitId} on ${dateStr}`);

    const updatedHabits = currentState.habits.map(habit => {
      if (habit.id === habitId) {
        // Get or create progress for this date
        const progress = getOrCreateProgress(habit, validDate);

        // Toggle completion status
        const updatedProgress: DailyProgress = {
          ...progress,
          isCompleted: !progress.isCompleted,
        };

        console.log(`  Previous completion status: ${progress.isCompleted}`);
        console.log(`  New completion status: ${updatedProgress.isCompleted}`);

        // Update habit with new progress
        const updatedHabit: Habit = {
          ...habit,
          progress: {
            ...habit.progress,
            [dateStr]: updatedProgress,
          },
          lastUpdatedAt: new Date().toISOString(),
        };

        return updatedHabit;
      }
      return habit;
    });

    // Update streaks for all habits
    const habitsWithUpdatedStreaks = updateAllStreaks(updatedHabits);

    setHabitStore({
      habits: habitsWithUpdatedStreaks,
    });

    // Persist to storage
    persistHabits(habitsWithUpdatedStreaks);
  },

  // Update numeric or timer value for a habit
  updateHabitValue: (
    habitId: string,
    value: number,
    date: Date = new Date(),
  ): void => {
    const validDate = ensureValidDate(date);
    const dateStr = format(validDate, 'yyyy-MM-dd');

    const currentState = getHabitStoreSnapshot();

    // Find the habit first to confirm it exists
    const habitIndex = currentState.habits.findIndex(h => h.id === habitId);
    if (habitIndex === -1) {
      console.error(
        `Cannot update habit value: Habit with ID ${habitId} not found`,
      );
      return;
    }

    const updatedHabits = currentState.habits.map(habit => {
      if (habit.id === habitId) {
        // Only process for numeric or timer habits
        if (
          habit.evaluation.type !== 'numeric' &&
          habit.evaluation.type !== 'timer'
        ) {
          return habit;
        }

        // Get or create progress for this date
        const progress = getOrCreateProgress(habit, validDate);

        // Update value and check if completed
        const updatedValue = value;
        const isCompleted = updatedValue >= habit.evaluation.target;

        const updatedProgress: DailyProgress = {
          ...progress,
          value: updatedValue,
          isCompleted,
        };

        // Update habit with new progress
        const updatedHabit: Habit = {
          ...habit,
          progress: {
            ...habit.progress,
            [dateStr]: updatedProgress,
          },
          lastUpdatedAt: new Date().toISOString(),
        };

        return updatedHabit;
      }
      return habit;
    });

    // Update streaks for all habits
    const habitsWithUpdatedStreaks = updateAllStreaks(updatedHabits);

    setHabitStore({
      habits: habitsWithUpdatedStreaks,
    });

    // Persist to storage
    persistHabits(habitsWithUpdatedStreaks);
  },

  // Toggle checklist item
  toggleChecklistItem: (
    habitId: string,
    itemId: string,
    date: Date = new Date(),
  ): void => {
    // Ensure valid date
    const validDate = ensureValidDate(date);
    const dateStr = format(validDate, 'yyyy-MM-dd');

    // Find the habit first to confirm it exists
    const habit = getHabitStoreSnapshot().habits.find(h => h.id === habitId);
    if (!habit || habit.evaluation.type !== 'checklist') {
      return;
    }

    // Verify the checklist item exists
    if (!habit.evaluation.checklistItems?.some(item => item.id === itemId)) {
      console.warn(`Checklist item ${itemId} not found in habit ${habitId}`);
      return;
    }

    // Get or create progress for this date
    const progress = getOrCreateProgress(habit, validDate);

    // Initialize checklist progress if needed
    if (!progress.checklistProgress) {
      progress.checklistProgress = {};
    }

    // Toggle this item
    progress.checklistProgress[itemId] = !progress.checklistProgress[itemId];

    // Count completed items
    const completedCount = Object.values(progress.checklistProgress).filter(
      completed => completed,
    ).length;

    // Check if the target is met
    const target =
      habit.evaluation.target ||
      (habit.evaluation.checklistItems
        ? habit.evaluation.checklistItems.length
        : 0);
    progress.isCompleted = completedCount >= target;

    // Update habit with new progress
    const updatedHabits = getHabitStoreSnapshot().habits.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          progress: {
            ...h.progress,
            [dateStr]: progress,
          },
        };
      }
      return h;
    });

    // Update streaks for all habits
    const habitsWithUpdatedStreaks = updateAllStreaks(updatedHabits);

    // Persist to storage
    persistHabits(habitsWithUpdatedStreaks);

    // Update state
    setHabitStore({habits: habitsWithUpdatedStreaks});
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

  // Get habits for a specific date
  getHabitsForDate: (
    date: Date,
    timeFilter: TimePeriod | 'all' = 'all',
  ): Habit[] => {
    const currentState = getHabitStoreSnapshot();

    if (!Array.isArray(currentState.habits)) {
      console.error(
        'getHabitsForDate: current state habits is not an array',
        currentState.habits,
      );
      return [];
    }

    // Convert to start of day for consistent comparison
    const targetDate = ensureValidDate(date);
    const dateStr = format(targetDate, 'yyyy-MM-dd');

    console.log(
      `Getting habits for date: ${dateStr}, timeFilter: ${timeFilter}`,
    );
    console.log(`Total habits in store: ${currentState.habits.length}`);

    // Filter habits that are active on this date and not archived
    const filteredHabits = currentState.habits.filter(habit => {
      // Skip archived habits (if archived before or on this date)
      const archiveCheck = !(
        habit.archivedAt && ensureValidDate(habit.archivedAt) <= targetDate
      );

      // Skip habits created after this date
      const creationCheck = !(ensureValidDate(habit.createdAt) > targetDate);

      // Filter by time period if not 'all'
      const timePeriodCheck =
        timeFilter === 'all' || habit.timePeriod === timeFilter;

      // Check if habit is active on this date based on frequency
      const isActive = isHabitActiveOnDate(habit, targetDate);

      const passes =
        archiveCheck && creationCheck && timePeriodCheck && isActive;

      if (!passes) {
        console.log(`  Filtering out habit: ${habit.title} (ID: ${habit.id})`);
        if (!archiveCheck) {
          console.log('    Reason: Archived');
        }
        if (!creationCheck) {
          console.log('    Reason: Created after selected date');
        }
        if (!timePeriodCheck) {
          console.log('    Reason: Time period mismatch');
        }
        if (!isActive) {
          console.log('    Reason: Not active based on frequency');
        }
      }

      return passes;
    });

    console.log(`Filtered habits count: ${filteredHabits.length}`);
    filteredHabits.forEach(habit => {
      console.log(`  - ${habit.title} (ID: ${habit.id})`);
    });

    return filteredHabits;
  },

  // Get habit statistics
  getStats: (): HabitStats => {
    const currentState = getHabitStoreSnapshot();
    return calculateHabitStats(currentState.habits);
  },

  // Import habits (for backup/restore)
  importHabits: (habits: Habit[]): void => {
    if (!Array.isArray(habits)) {
      console.error('Cannot import habits: not an array', habits);
      setHabitStore({
        error: 'Failed to import habits: invalid data format',
      });
      return;
    }

    setHabitStore({
      habits,
      loading: false,
      error: null,
    });

    // Persist to storage
    persistHabits(habits);
  },

  // Initialize with sample habits (for testing/demo)
  initializeWithSampleHabits: (sampleHabits: Habit[]): void => {
    if (!Array.isArray(sampleHabits)) {
      console.error(
        'Cannot initialize with sample habits: not an array',
        sampleHabits,
      );
      return;
    }

    setHabitStore({
      habits: sampleHabits,
      loading: false,
      error: null,
    });

    // Persist to storage
    persistHabits(sampleHabits);
  },
};

export {useHabitStore};

// ---------------------------------------------------

// Fix 1: Improve the getOrCreateProgress function to better handle date consistency
const getOrCreateProgress = (habit: Habit, date: Date): DailyProgress => {
  // Normalize date to ensure consistency
  const normalizedDate = startOfDay(date);
  const dateStr = format(normalizedDate, 'yyyy-MM-dd');

  // Check if progress exists for this date
  if (habit.progress && habit.progress[dateStr]) {
    return habit.progress[dateStr];
  }

  // Create a new progress entry with the correct normalized date
  const newProgress: DailyProgress = {
    date: dateStr,
    isCompleted: false,
  };

  // Initialize specific fields based on evaluation type
  if (
    habit.evaluation.type === 'numeric' ||
    habit.evaluation.type === 'timer'
  ) {
    newProgress.value = 0;
  } else if (
    habit.evaluation.type === 'checklist' &&
    habit.evaluation.checklistItems
  ) {
    newProgress.checklistProgress = {};
    // Initialize all checklist items as not completed
    habit.evaluation.checklistItems.forEach(item => {
      if (newProgress.checklistProgress) {
        newProgress.checklistProgress[item.id] = false;
      }
    });
  }

  return newProgress;
};

// Fix 2: Improve isHabitCompleted to handle all evaluation types correctly
export const isHabitCompleted = (
  habit: Habit,
  progress: DailyProgress,
): boolean => {
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

// Fix 3: Improve updateNumericValue to handle validation and edge cases
const updateNumericValue = (
  habitId: string,
  value: number,
  date: Date = new Date(),
): void => {
  // Ensure valid date and find habit
  const validDate = ensureValidDate(date);
  const dateStr = format(validDate, 'yyyy-MM-dd');

  // Find the habit first to confirm it exists
  const habit = getHabitStoreSnapshot().habits.find(h => h.id === habitId);
  if (!habit) {
    return;
  }

  // Only process for numeric or timer habits
  if (
    habit.evaluation.type !== 'numeric' &&
    habit.evaluation.type !== 'timer'
  ) {
    return;
  }

  // Get or create progress for this date
  const progress = getOrCreateProgress(habit, validDate);

  // Ensure value is not negative
  const newValue = Math.max(0, value);

  // Update value and check if completed
  progress.value = newValue;
  progress.isCompleted = newValue >= habit.evaluation.target;

  // Update habit with new progress
  const updatedHabits = getHabitStoreSnapshot().habits.map(h => {
    if (h.id === habitId) {
      return {
        ...h,
        progress: {
          ...h.progress,
          [dateStr]: progress,
        },
      };
    }
    return h;
  });

  // Update streaks for all habits
  const habitsWithUpdatedStreaks = updateAllStreaks(updatedHabits);

  // Persist to storage
  persistHabits(habitsWithUpdatedStreaks);

  // Update state
  setHabitStore({habits: habitsWithUpdatedStreaks});
};

// Fix 4: Improve toggleChecklistItem to handle missing checklist items
const toggleChecklistItem = (
  habitId: string,
  itemId: string,
  date: Date = new Date(),
): void => {
  // Ensure valid date
  const validDate = ensureValidDate(date);
  const dateStr = format(validDate, 'yyyy-MM-dd');

  // Find the habit first to confirm it exists
  const habit = get().habits.find(h => h.id === habitId);
  if (!habit || habit.evaluation.type !== 'checklist') {
    return;
  }

  // Verify the checklist item exists
  if (!habit.evaluation.checklistItems?.some(item => item.id === itemId)) {
    console.warn(`Checklist item ${itemId} not found in habit ${habitId}`);
    return;
  }

  // Get or create progress for this date
  const progress = getOrCreateProgress(habit, validDate);

  // Initialize checklist progress if needed
  if (!progress.checklistProgress) {
    progress.checklistProgress = {};
  }

  // Toggle this item
  progress.checklistProgress[itemId] = !progress.checklistProgress[itemId];

  // Count completed items
  const completedCount = Object.values(progress.checklistProgress).filter(
    completed => completed,
  ).length;

  // Check if the target is met
  const target =
    habit.evaluation.target ||
    (habit.evaluation.checklistItems
      ? habit.evaluation.checklistItems.length
      : 0);
  progress.isCompleted = completedCount >= target;

  // Update habit with new progress
  const updatedHabits = get().habits.map(h => {
    if (h.id === habitId) {
      return {
        ...h,
        progress: {
          ...h.progress,
          [dateStr]: progress,
        },
      };
    }
    return h;
  });

  // Update streaks for all habits
  const habitsWithUpdatedStreaks = updateAllStreaks(updatedHabits);

  // Persist to storage
  persistHabits(habitsWithUpdatedStreaks);

  // Update state
  set({habits: habitsWithUpdatedStreaks});
};

// Fix 5: Improve calculateStreak to handle different frequency types
const calculateStreak = (habit: Habit): number => {
  if (!habit) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(); // Start from today
  let daysChecked = 0;
  const maxDaysToCheck = 365; // Safety limit

  // Go back day by day and check if habit was completed
  while (daysChecked < maxDaysToCheck) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const progress = habit.progress && habit.progress[dateStr];

    // Check if the habit should be active on this date based on frequency
    const isActive = isHabitActiveOnDate(habit, currentDate);

    if (isActive) {
      // If habit is active on this date and has progress
      if (progress) {
        // Check if it was completed based on its type
        const wasCompleted = isHabitCompleted(habit, progress);

        if (wasCompleted) {
          streak++; // Increment streak for completed habits
        } else {
          break; // Streak is broken
        }
      } else {
        // If habit should be active but has no progress entry, the streak is broken
        break;
      }
    }
    // If habit is not active on this date, just move to the previous day without affecting the streak

    // Move to previous day
    currentDate = subDays(currentDate, 1);
    daysChecked++;

    // Safety check - don't go back further than habit creation date
    if (habit.createdAt && new Date(habit.createdAt) > currentDate) {
      break;
    }
  }

  return streak;
};
