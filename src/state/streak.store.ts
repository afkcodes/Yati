import {parseISO, subDays} from 'date-fns';
import {MMKV} from 'react-native-mmkv';
import {Habit} from '~/types/habit.types';
import {
  StreakAnalytics,
  StreakData,
  StreakSettings,
} from '~/types/streak.types';
import {toDateString} from '~/utils/date/dateUtils';
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

  // Update streak data after a habit completion
  updateStreakAfterCompletion: (
    habit: Habit,
    date: string,
    completed: boolean,
  ) => {
    const {streaks, settings} = getStoreSnapshot();
    let streakData = streaks[habit.id];

    // Initialize streak data if it doesn't exist
    if (!streakData) {
      streakData = {
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
    }

    // Update streak data with the latest calculations
    const isActive = isStreakActive(habit, settings);
    const currentStreak = calculateCurrentStreak(habit, settings);
    const longestStreak = calculateLongestStreak(habit);
    const perfectWeeks = countPerfectWeeks(habit);
    const perfectMonths = countPerfectMonths(habit);
    const streakStartDate = getCurrentStreakStartDate(habit, settings);

    // Count total completions
    const completedDates = getCompletedDates(habit);
    const totalCompletions = completedDates.length;

    // Update streak data
    const updatedStreakData = {
      ...streakData,
      currentStreak,
      longestStreak: Math.max(longestStreak, streakData.longestStreak),
      totalCompletions,
      lastCompletedDate: completed ? date : streakData.lastCompletedDate,
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
    streakActions.updateHabitWithStreakData(habit, updatedStreakData);

    return updatedStreakData;
  },

  // Recalculate streak for a habit
  recalculateStreakForHabit: (habit: Habit) => {
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
    // syncing habitData With Streaks
    streakActions.updateHabitWithStreakData(habit, updatedStreakData);

    return updatedStreakData;
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
  updateHabitWithStreakData: (habit: Habit, streakData: StreakData) => {
    // Get current habits from store
    const habits = getHabitStoreSnapshot().habits;

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
  },
};
