import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {DateTime} from 'luxon';
import {Habit, HabitFormData, HabitFormErrors} from '~/types/habit.types';
import {DEFAULT_CATEGORY, DEFAULT_COLOR} from '~/utils/constants/habitConstants';
import {getLocalToday, now, toUTCISO} from '~/utils/date/dateUtils';
import {validateHabitForm} from '~/utils/habit/habitValidations';
import {
  cancelHabitReminders,
  scheduleHabitReminders,
} from '~/utils/reminders/reminderUtils';
import {MMKV} from 'react-native-mmkv';

// Storage instance for persisting state
const storage = new MMKV();

// Create a storage object for Zustand persist middleware
const zustandStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? Promise.resolve(value) : null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
    return Promise.resolve(true);
  },
  removeItem: (name: string) => {
    storage.delete(name);
    return Promise.resolve();
  },
};

// Initial form data
export const initialFormData: HabitFormData = {
  title: '',
  description: '',
  category: DEFAULT_CATEGORY,
  color: DEFAULT_COLOR,
  frequency: {type: 'daily', value: [], timeOfDay: null},
  evaluation: {type: 'boolean', target: 1, unit: ''},
  goal: {
    enabled: false,
    timeframe: 'weekly',
    target: 7,
    deadline: null,
    progress: 0,
  },
  reminders: [],
  timePeriod: 'morning',
};

// Define the store state interface
interface HabitState {
  habits: Habit[];
  formData: HabitFormData;
  formErrors: HabitFormErrors;
  selectedDate: DateTime;
  timeFilter: 'morning' | 'evening' | 'night' | 'all';
  
  // Actions
  addHabit: (formData: HabitFormData) => boolean;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  updateFormData: (data: Partial<HabitFormData>) => void;
  clearFormData: () => void;
  setFormErrors: (errors: HabitFormErrors) => void;
  updateSelectedDate: (date: DateTime) => void;
  updateTimeFilter: (filter: 'morning' | 'evening' | 'night' | 'all') => void;
  completeHabit: (habitId: string, date: string, value?: number, checklist?: Array<{id: string; completed: boolean}>) => void;
  uncompleteHabit: (habitId: string, date: string) => void;
  archiveHabit: (id: string) => void;
  unarchiveHabit: (id: string) => void;
}

// Utility to generate a unique ID for habits
const generateId = (): string =>
  'habit_' + Math.random().toString(36).substr(2, 9);

// Create the Zustand store with persistence
export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      formData: initialFormData,
      formErrors: {},
      selectedDate: getLocalToday(),
      timeFilter: 'all',

      addHabit: (formData: HabitFormData): boolean => {
        const errors = validateHabitForm(formData);
        if (Object.keys(errors).length > 0) {
          set({ formErrors: errors });
          return false;
        }

        const newHabit: Habit = {
          id: formData.id || generateId(),
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

        set(state => ({
          habits: [...state.habits, newHabit],
          formData: initialFormData,
          formErrors: {},
        }));

        // Schedule reminders
        scheduleHabitReminders(newHabit);

        return true;
      },

      updateHabit: (id: string, updates: Partial<Habit>) => {
        set(state => {
          const habitIndex = state.habits.findIndex(h => h.id === id);
          if (habitIndex === -1) {
            return state;
          }

          const updatedHabit = {
            ...state.habits[habitIndex], 
            ...updates,
            lastUpdatedAt: toUTCISO(now()),
          };
          
          // Update reminders if changed
          if (updates.reminders && 
              JSON.stringify(updatedHabit.reminders) !== 
              JSON.stringify(state.habits[habitIndex].reminders)) {
            cancelHabitReminders(state.habits[habitIndex]);
            scheduleHabitReminders(updatedHabit);
          }
          
          const updatedHabits = [...state.habits];
          updatedHabits[habitIndex] = updatedHabit;
          
          return { habits: updatedHabits };
        });
      },

      deleteHabit: (id: string) => {
        set(state => {
          const habitToDelete = state.habits.find(h => h.id === id);
          if (habitToDelete) {
            // Cancel reminders before deleting
            cancelHabitReminders(habitToDelete);
          }
          
          return {
            habits: state.habits.filter(h => h.id !== id)
          };
        });
      },

      updateFormData: (data: Partial<HabitFormData>) => {
        set(state => ({
          formData: { ...state.formData, ...data }
        }));
      },

      clearFormData: () => {
        set({
          formData: initialFormData,
          formErrors: {}
        });
      },

      setFormErrors: (errors: HabitFormErrors) => {
        set({ formErrors: errors });
      },

      updateSelectedDate: (date: DateTime) => {
        set({ selectedDate: date });
      },

      updateTimeFilter: (filter: 'morning' | 'evening' | 'night' | 'all') => {
        set({ timeFilter: filter });
      },

      completeHabit: (habitId: string, date: string, value?: number, checklist?: Array<{id: string; completed: boolean}>) => {
        set(state => {
          const habitIndex = state.habits.findIndex(h => h.id === habitId);
          if (habitIndex === -1) return state;

          const habit = state.habits[habitIndex];
          const updatedProgress = { ...habit.progress };
          
          updatedProgress[date] = {
            date,
            isCompleted: true,
            value,
            checklist,
            completedAt: toUTCISO(now())
          };

          const updatedHabit = {
            ...habit,
            progress: updatedProgress,
            // We'll recalculate streak in a real implementation
            // For simplicity, we're not implementing the full streak logic here
          };

          const updatedHabits = [...state.habits];
          updatedHabits[habitIndex] = updatedHabit;

          return { habits: updatedHabits };
        });
      },

      uncompleteHabit: (habitId: string, date: string) => {
        set(state => {
          const habitIndex = state.habits.findIndex(h => h.id === habitId);
          if (habitIndex === -1) return state;

          const habit = state.habits[habitIndex];
          const updatedProgress = { ...habit.progress };
          
          if (updatedProgress[date]) {
            updatedProgress[date] = {
              ...updatedProgress[date],
              isCompleted: false,
              completedAt: undefined
            };
          }

          const updatedHabit = {
            ...habit,
            progress: updatedProgress,
            // We'd recalculate streak here in a full implementation
          };

          const updatedHabits = [...state.habits];
          updatedHabits[habitIndex] = updatedHabit;

          return { habits: updatedHabits };
        });
      },

      archiveHabit: (id: string) => {
        set(state => {
          const habitIndex = state.habits.findIndex(h => h.id === id);
          if (habitIndex === -1) return state;

          const updatedHabit = { 
            ...state.habits[habitIndex], 
            archivedAt: toUTCISO(now())
          };
          
          // Cancel reminders for archived habits
          cancelHabitReminders(state.habits[habitIndex]);
          
          const updatedHabits = [...state.habits];
          updatedHabits[habitIndex] = updatedHabit;
          
          return { habits: updatedHabits };
        });
      },

      unarchiveHabit: (id: string) => {
        set(state => {
          const habitIndex = state.habits.findIndex(h => h.id === id);
          if (habitIndex === -1) return state;

          const updatedHabit = { 
            ...state.habits[habitIndex], 
            archivedAt: undefined
          };
          
          // Reschedule reminders for unarchived habits
          scheduleHabitReminders(updatedHabit);
          
          const updatedHabits = [...state.habits];
          updatedHabits[habitIndex] = updatedHabit;
          
          return { habits: updatedHabits };
        });
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        habits: state.habits,
        // We don't need to persist these
        // selectedDate: state.selectedDate,
        // timeFilter: state.timeFilter,
      }),
      // Transform selectedDate from string to DateTime when hydrating from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Habit store hydrated');
        }
      }
    }
  )
);

// Export some selectors to make data access easier
export const useHabits = () => useHabitStore(state => state.habits);
export const useFormData = () => useHabitStore(state => state.formData);
export const useFormErrors = () => useHabitStore(state => state.formErrors);
export const useSelectedDate = () => useHabitStore(state => state.selectedDate);
export const useTimeFilter = () => useHabitStore(state => state.timeFilter);

// Get active (non-archived) habits
export const useActiveHabits = () => 
  useHabitStore(state => state.habits.filter(h => !h.archivedAt));

// Get archived habits
export const useArchivedHabits = () => 
  useHabitStore(state => state.habits.filter(h => h.archivedAt));

// Get habits for a specific date
export const useHabitsForDate = (date: string) => 
  useHabitStore(state => 
    state.habits.filter(habit => {
      // This is a simplified version - in reality, you'd use your scheduling logic here
      // to determine if a habit is scheduled for this date based on frequency settings
      return !habit.archivedAt; // && isHabitScheduledForDate(habit, date);
    })
  );

// Get habits for a specific time period
export const useHabitsForTimePeriod = (timePeriod: 'morning' | 'evening' | 'night') => 
  useHabitStore(state => 
    state.habits.filter(habit => 
      !habit.archivedAt && habit.timePeriod === timePeriod
    )
  );
