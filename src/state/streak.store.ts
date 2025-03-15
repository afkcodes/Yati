import {parseISO, subDays} from 'date-fns';
import {MMKV} from 'react-native-mmkv';
import {Habit} from '~/types/habit.types';
import {
  StreakAnalytics,
  StreakData,
  StreakSettings,
} from '~/types/streak.types';
import {create} from '~/utils/store/createStore';
import {
  calculateCompletionRate,
  calculateCurrentStreak,
  calculateLongestStreak,
  countPerfectMonths,
  countPerfectWeeks,
  getCompletedDates,
  getCurrentStreakStartDate,
  getStreakHistory,
  isStreakActive,
} from '~/utils/streak/streakCalculationUtils';
import {
  getHabitStoreSnapshot,
  persistHabits,
  setHabitStore,
} from './habit.store';

import {toDateString} from '~/utils/date/dateUtils';

// Initialize storage
const storage = new MMKV();

// Store state interface
interface StreakStoreState {
  streaks: Record<string, StreakData>;
  settings: StreakSettings;
  loading: boolean;
  error: string | null;
}

// Default streak settings
const defaultSettings: StreakSettings = {
  countTodayInStreaks: true,
  maintainStreakWithinHours: 24,
  allowStreakFreezes: false,
  streakFreezesAvailable: 0,
};

// Initial state
const initialState: StreakStoreState = {
  streaks: {},
  settings: defaultSettings,
  loading: false,
  error: null,
};

// Load streaks from storage if available
const loadInitialState = (): StreakStoreState => {
  try {
    // Load streak data
    const storedStreaks = storage.getString('streaks');
    const storedSettings = storage.getString('streakSettings');

    let streaks = {};
    let settings = defaultSettings;

    if (storedStreaks) {
      streaks = JSON.parse(storedStreaks);
    }

    if (storedSettings) {
      settings = JSON.parse(storedSettings);
    }

    return {
      ...initialState,
      streaks,
      settings,
    };
  } catch (error) {
    console.error('Error loading streaks from storage:', error);
    return initialState;
  }
};

console.log('initial streak data', loadInitialState());

// Create store with initial loaded state
export const {
  useStore: useStreakStore,
  getStoreSnapshot: getStreakStoreSnapshot,
  set: setStreakStore,
} = create<StreakStoreState>('streaks', loadInitialState());

// Helper to persist streaks to storage
const persistStreaks = (streaks: Record<string, StreakData>): void => {
  try {
    storage.set('streaks', JSON.stringify(streaks));
  } catch (error) {
    console.error('Error persisting streaks to storage:', error);
  }
};

// Helper to persist streak settings
const persistSettings = (settings: StreakSettings): void => {
  try {
    storage.set('streakSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error persisting streak settings to storage:', error);
  }
};

// Helper to get the current store snapshot
const getStoreSnapshot = (): StreakStoreState => {
  return getStreakStoreSnapshot();
};

// Streak store actions
export const streakActions = {
  // Initialize streak for a habit
  initializeStreak: (habitId: string) => {
    const {streaks} = loadInitialState();

    // Create initial streak data if not exists
    if (!streaks[habitId]) {
      const newStreakData: StreakData = {
        habitId,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        lastCompletedDate: null,
        streakStartDate: null,
        perfectWeeks: 0,
        perfectMonths: 0,
        isStreakActive: false,
      };

      const updatedStreaks = {
        ...streaks,
        [habitId]: newStreakData,
      };

      setStreakStore({streaks: updatedStreaks});
      persistStreaks(updatedStreaks);
    }

    return streaks[habitId] || null;
  },

  // Update streak settings
  updateSettings: (settings: Partial<StreakSettings>) => {
    const currentSettings = getStoreSnapshot().settings;
    const updatedSettings = {...currentSettings, ...settings};

    setStreakStore({settings: updatedSettings});
    persistSettings(updatedSettings);

    return updatedSettings;
  },

  // Get streak data for a habit
  getStreakData: (habitId: string): StreakData | null => {
    const {streaks} = getStoreSnapshot();
    return streaks[habitId] || null;
  },

  updateStreakAfterCompletion: (
    habit: Habit,
    dateStr: string,
    completed: boolean,
  ) => {
    try {
      const {streaks, settings} = getStoreSnapshot();
      // Ensure date string is properly formatted
      const normalizedDateStr = dateStr.trim();

      // Initialize streak data if it doesn't exist
      let streakData = streaks[habit.id] || {
        habitId: habit.id,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        lastCompletedDate: null,
        streakStartDate: null,
        perfectWeeks: 0,
        perfectMonths: 0,
        isStreakActive: false,
      };

      // Create a simulated habit with the updated completion status for calculation
      const simulatedHabit = {
        ...habit,
        progress: {
          ...habit.progress,
          [normalizedDateStr]: {
            ...(habit.progress[normalizedDateStr] || {}),
            isCompleted: completed,
          },
        },
      };

      // Calculate all streak metrics with this updated habit
      const isActive = isStreakActive(simulatedHabit, settings);
      const currentStreak = calculateCurrentStreak(simulatedHabit, settings);
      const longestStreak = calculateLongestStreak(simulatedHabit);
      const perfectWeeks = countPerfectWeeks(simulatedHabit);
      const perfectMonths = countPerfectMonths(simulatedHabit);
      const streakStartDate = getCurrentStreakStartDate(
        simulatedHabit,
        settings,
      );

      // Count total completions
      const completedDates = getCompletedDates(simulatedHabit);
      const totalCompletions = completedDates.length;

      // Log results for debugging
      console.debug(`[Streak Store] Updated streak for ${habit.title}:`, {
        currentStreak,
        longestStreak: Math.max(longestStreak, streakData.longestStreak),
        isActive,
      });

      // Update streak data with calculated values
      const updatedStreakData = {
        ...streakData,
        currentStreak,
        longestStreak: Math.max(longestStreak, streakData.longestStreak),
        totalCompletions,
        lastCompletedDate: completed
          ? normalizedDateStr
          : streakData.lastCompletedDate,
        streakStartDate: streakStartDate ? toDateString(streakStartDate) : null,
        perfectWeeks,
        perfectMonths,
        isStreakActive: isActive,
      };

      // Update streaks in store
      const updatedStreaks = {
        ...streaks,
        [habit.id]: updatedStreakData,
      };

      setStreakStore({streaks: updatedStreaks});
      persistStreaks(updatedStreaks);

      // Update the habit with the new streak data
      streakActions.updateHabitWithStreakData(habit, updatedStreakData);

      return updatedStreakData;
    } catch (error) {
      console.error('Error updating streak after completion:', error);
      // Return existing streak data to prevent null references
      const {streaks} = getStoreSnapshot();
      return (
        streaks[habit.id] || {
          habitId: habit.id,
          currentStreak: 0,
          longestStreak: 0,
          totalCompletions: 0,
          lastCompletedDate: null,
          streakStartDate: null,
          perfectWeeks: 0,
          perfectMonths: 0,
          isStreakActive: false,
        }
      );
    }
  },

  // Recalculate streaks for all habits
  recalculateAllStreaks: (habits: Habit[]) => {
    const {settings} = getStoreSnapshot();
    let allStreaks: Record<string, StreakData> = {};

    // Recalculate for each habit
    for (const habit of habits) {
      // Get streak calculations
      const isActive = isStreakActive(habit, settings);
      const currentStreak = calculateCurrentStreak(habit, settings);
      const longestStreak = calculateLongestStreak(habit);
      const perfectWeeks = countPerfectWeeks(habit);
      const perfectMonths = countPerfectMonths(habit);
      const streakStartDate = getCurrentStreakStartDate(habit, settings);

      // Get last completed date
      const completedDates = getCompletedDates(habit);
      const lastCompletedDate =
        completedDates.length > 0
          ? toDateString(completedDates[completedDates.length - 1])
          : null;

      // Create updated streak data
      allStreaks[habit.id] = {
        habitId: habit.id,
        currentStreak,
        longestStreak,
        totalCompletions: completedDates.length,
        lastCompletedDate,
        streakStartDate: streakStartDate ? toDateString(streakStartDate) : null,
        perfectWeeks,
        perfectMonths,
        isStreakActive: isActive,
      };
      streakActions.updateHabitWithStreakData(habit, allStreaks[habit.id]);
    }

    // Update store
    setStreakStore({streaks: allStreaks});
    persistStreaks(allStreaks);

    return allStreaks;
  },

  // Get streak analytics data
  getStreakAnalytics: (habit: Habit): StreakAnalytics => {
    const today = new Date();
    const weekAgo = subDays(today, 7);
    const monthAgo = subDays(today, 30);

    return {
      completionRate: calculateCompletionRate(
        habit,
        parseISO(habit.createdAt),
        today,
      ),
      weeklyCompletionRate: calculateCompletionRate(habit, weekAgo, today),
      monthlyCompletionRate: calculateCompletionRate(habit, monthAgo, today),
      streakHistory: getStreakHistory(habit),
    };
  },

  /**
   * Updates habit with streak data to ensure consistency
   */
  updateHabitWithStreakData: (habit: Habit, streakData: StreakData) => {
    try {
      // Get current habits from store
      const {habits} = getHabitStoreSnapshot();

      if (!habits || !Array.isArray(habits)) {
        console.error('Invalid habits data in store');
        return;
      }

      // Find and update the habit with streak data
      const updatedHabits = habits.map(h => {
        if (h.id === habit.id) {
          return {
            ...h,
            streak: streakData.currentStreak,
            longestStreak: streakData.longestStreak,
          };
        }
        return h;
      });

      // Update habit store
      setHabitStore({habits: updatedHabits});
      persistHabits(updatedHabits);

      console.debug(
        `[Streak Store] Updated habit ${habit.title} with streak: ${streakData.currentStreak}`,
      );
    } catch (error) {
      console.error('Error updating habit with streak data:', error);
    }
  },

  /**
   * Recalculates streak for a specific habit
   * @param habit The habit to recalculate streak for
   * @returns The updated streak data
   */
  recalculateStreakForHabit: (habit: Habit) => {
    try {
      const {streaks, settings} = getStoreSnapshot();

      // Get existing streak data or initialize new
      let streakData = streaks[habit.id] || {
        habitId: habit.id,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        lastCompletedDate: null,
        streakStartDate: null,
        perfectWeeks: 0,
        perfectMonths: 0,
        isStreakActive: false,
      };

      // Calculate updated streak values
      const isActive = isStreakActive(habit, settings);
      const currentStreak = calculateCurrentStreak(habit, settings);
      const longestStreak = calculateLongestStreak(habit);
      const perfectWeeks = countPerfectWeeks(habit);
      const perfectMonths = countPerfectMonths(habit);
      const streakStartDate = getCurrentStreakStartDate(habit, settings);

      // Get last completed date
      const completedDates = getCompletedDates(habit);
      const lastCompletedDate =
        completedDates.length > 0
          ? toDateString(completedDates[completedDates.length - 1])
          : null;

      // Update streak data
      const updatedStreakData = {
        ...streakData,
        currentStreak,
        longestStreak: Math.max(longestStreak, streakData.longestStreak),
        totalCompletions: completedDates.length,
        lastCompletedDate,
        streakStartDate: streakStartDate ? toDateString(streakStartDate) : null,
        perfectWeeks,
        perfectMonths,
        isStreakActive: isActive,
      };

      // Update store
      const updatedStreaks = {
        ...streaks,
        [habit.id]: updatedStreakData,
      };

      setStreakStore({streaks: updatedStreaks});
      persistStreaks(updatedStreaks);

      // Update the habit with new streak data
      streakActions.updateHabitWithStreakData(habit, updatedStreakData);

      console.debug(
        `[Streak] Recalculated for ${habit.title}: streak=${currentStreak}, longest=${updatedStreakData.longestStreak}`,
      );

      return updatedStreakData;
    } catch (error) {
      console.error('Error recalculating streak for habit:', error);
      return null;
    }
  },
};
